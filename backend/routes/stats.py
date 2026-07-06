import os
import time

import requests
from flask import Blueprint, jsonify

stats_bp = Blueprint('stats', __name__)

# Zafronix (free tier). La API key se lee del entorno: backend/.env.
ZAFRONIX_BASE = "https://api.zafronix.com/fifa/worldcup/v1"
ZAFRONIX_API_KEY = os.getenv("ZAFRONIX_API_KEY")
WC_YEAR = 2026

# Cache en memoria. Zafronix soporta ETag/If-None-Match: 304 NO consume cuota,
# asi que propagamos el ETag y caemos al cache cuando el servidor responde 304.
# Nota: /matches?year=2026 puede pesar ~45 MB (104 partidos con lineups completos);
# aceptable para dev/demo, en produccion habria que paginar o reducir el payload.
_cache = {}
_etags = {}
_CACHE_TTL = 60 * 15

DEFAULT_HEADERS = {
    "X-API-Key": ZAFRONIX_API_KEY,
    "Accept": "application/json",
}


def _fetch(endpoint, params=None):
    """Llama a Zafronix con cache + ETag. Devuelve (payload, error_str)."""
    params = params or {}
    cache_key = f"{endpoint}|{sorted(params.items())}"
    now = time.time()

    if not ZAFRONIX_API_KEY:
        return None, (
            "Falta ZAFRONIX_API_KEY en el archivo .env del backend. "
            "Consigue una clave gratuita en https://api.zafronix.com/signup"
        )

    if cache_key in _cache:
        cached_at, payload = _cache[cache_key]
        if now - cached_at < _CACHE_TTL:
            return payload, None

    headers = dict(DEFAULT_HEADERS)
    if cache_key in _etags:
        headers["If-None-Match"] = _etags[cache_key]

    try:
        res = requests.get(
            f"{ZAFRONIX_BASE}/{endpoint}",
            headers=headers,
            params=params,
            timeout=12,
        )
    except requests.RequestException:
        if cache_key in _cache:
            return _cache[cache_key][1], None
        return None, "No se pudo conectar con Zafronix"

    if res.status_code == 304 and cache_key in _cache:
        _cache[cache_key] = (now, _cache[cache_key][1])
        return _cache[cache_key][1], None

    if res.status_code == 429:
        return None, (
            "Zafronix: cuota diaria agotada (250 req/dia). "
            "Vuelve a intentarlo cuando se reinicie el limite."
        )

    if res.status_code != 200:
        if cache_key in _cache:
            return _cache[cache_key][1], None
        return None, f"Zafronix respondio con error {res.status_code}"

    payload = res.json()
    etag = res.headers.get("etag")
    if etag:
        _etags[cache_key] = etag
    _cache[cache_key] = (now, payload)
    return payload, None


def _all_matches():
    # Carga logos de equipos una sola vez por request (antes que los loops
    # por-evento iteren cientos de veces). Si _fetch("teams") falla,
    # `_team_logos` queda {} y `_team_logo_for` simplemente devuelve None.
    _load_team_logos()

    data, error = _fetch("matches", {"year": WC_YEAR, "limit": 200})
    if error:
        return [], error
    if isinstance(data, dict):
        return data.get("data") or data.get("matches") or [], None
    if isinstance(data, list):
        return data, None
    return [], None


def _resolve_team(match, side):
    if side == "home":
        return match.get("homeTeam")
    if side == "away":
        return match.get("awayTeam")
    return None


# Zafronix free tier NO expone URLs de logos de equipos. Zafronix permite en
# sus headers CSP el dominio flagcdn.com como fuente de imagenes; lo usamos
# como fallback: si el equipo tiene `iso` (2 letras), construimos la URL
# de su bandera nacional.
_FLAGCDN_TEMPLATE = "https://flagcdn.com/w160/{}.png"
# Zafronix usa codigos compuestos para las selecciones britanicas; flagcdn
# solo conoce `gb`, asi que normalizamos a Union Jack.
_ISO_OVERRIDES = {
    "gb-eng": "gb",
    "gb-sct": "gb",
}


def _flag_url_for(iso):
    if not iso:
        return None
    iso = _ISO_OVERRIDES.get(iso.lower(), iso.lower())
    return _FLAGCDN_TEMPLATE.format(iso)


_team_logos = {}              # team_name -> flag URL (puede quedar {} si /teams falla)
_team_logos_attempted_at = 0  # sello de la ultima INTENTONA (exito o fallo); evita storm


def _load_team_logos():
    """Una llamada a /teams por cada TTL; construye name -> URL de bandera.

    Zafronix puede responder con un dict ({"teams":[...]}) o con una lista
    cruda en el top-level, asi que aceptamos ambos. Estampamos
    _team_logos_attempted_at en CADA intento (exito o fallo) para que
    _team_logo_for() no re-dispare /teams dentro de un loop por-evento.
    """
    global _team_logos, _team_logos_attempted_at
    now = time.time()
    if (now - _team_logos_attempted_at) < _CACHE_TTL:
        return _team_logos

    data, error = _fetch("teams", {"tournament": WC_YEAR, "limit": 100})
    _team_logos_attempted_at = now
    if error or not data:
        return _team_logos

    if isinstance(data, dict):
        teams = data.get("teams") or data.get("data") or []
    elif isinstance(data, list):
        teams = data
    else:
        teams = []

    if isinstance(teams, list):
        _team_logos = {
            t["name"]: _flag_url_for(t.get("iso"))
            for t in teams
            if isinstance(t, dict) and t.get("name") and t.get("iso")
        }
    return _team_logos


def _empty_player(name, team):
    """Esqueleto que el frontend espera. _team_logo_for asume que
    _load_team_logos ya fue llamado por el route handler."""
    return {
        "id": name,
        "name": name,
        "team": team,
        "team_logo": _team_logo_for(team),
        "goals": 0,
        "yellow_cards": 0,
        "red_cards": 0,
        "appearances": 0,
    }


def _team_logo_for(team_name):
    """Lookup directo. Asume _load_team_logos() invocado por el route handler
    (en _all_matches), asi que esta funcion no re-dispara la API."""
    if not team_name:
        return None
    return _team_logos.get(team_name)


def _ranked_players(matches, stat_field, color_filter=None):
    """
    Devuelve jugadores rankeados por el stat indicado.

    - stat_field='goals', color_filter=None      -> cuenta goals[].scorer
    - stat_field='yellow_cards', color_filter='yellow' -> cuenta cards[]
    - stat_field='red_cards',   color_filter='red'     -> analogo

    Zafronix free tier no expone 'appearances' como campo separado, asi que
    el contador queda en 0 (el frontend nunca lo muestra).
    """
    players = {}

    if color_filter is None:
        for m in matches:
            for g in m.get("goals", []):
                name = g.get("scorer")
                team = _resolve_team(m, g.get("team"))
                if not name:
                    continue
                entry = players.setdefault(name, _empty_player(name, team))
                entry["goals"] += 1
                entry["team"] = team or entry["team"]
    else:
        for m in matches:
            for c in m.get("cards", []):
                if c.get("color") != color_filter:
                    continue
                name = c.get("player")
                team = _resolve_team(m, c.get("team"))
                if not name:
                    continue
                entry = players.setdefault(name, _empty_player(name, team))
                entry[stat_field] += 1
                entry["team"] = team or entry["team"]

    ranked = [p for p in players.values() if p[stat_field] > 0]
    ranked.sort(key=lambda p: (-p[stat_field], p["name"]))
    return ranked


def _defense_from_matches(matches):
    """Goles en contra y partidos jugados por equipo, calculados del fixture."""
    teams = {}
    for m in matches:
        home = m.get("homeTeam")
        away = m.get("awayTeam")
        hs = m.get("homeScore")
        as_ = m.get("awayScore")
        if home is None or away is None or hs is None or as_ is None:
            continue
        teams.setdefault(home, {"team": home, "team_logo": _team_logo_for(home), "goals_against": 0, "played": 0})
        teams.setdefault(away, {"team": away, "team_logo": _team_logo_for(away), "goals_against": 0, "played": 0})
        teams[home]["goals_against"] += as_ or 0
        teams[home]["played"] += 1
        teams[away]["goals_against"] += hs or 0
        teams[away]["played"] += 1

    played = [t for t in teams.values() if t["played"] > 0]
    best = sorted(played, key=lambda t: t["goals_against"])[:10]
    worst = sorted(played, key=lambda t: -t["goals_against"])[:10]
    return best, worst


@stats_bp.route("/api/stats/debug", methods=["GET"])
def debug_coverage():
    """Diagnostico: muestra que sabemos del Mundial 2026 segun Zafronix."""
    data, error = _fetch("tournaments/2026")
    if error:
        return jsonify({"msg": error}), 502
    t = data.get("tournament", {})
    return jsonify({
        "source": "Zafronix",
        "year": t.get("year"),
        "host": t.get("host"),
        "teamsCount": t.get("teamsCount"),
        "matchesCount": t.get("matchesCount"),
        "ballName": t.get("ballName"),
        "mascot": t.get("mascot"),
        "datesIso": t.get("datesIso"),
        "schemaVersion": data.get("schemaVersion"),
    }), 200


@stats_bp.route("/api/stats/debug/raw", methods=["GET"])
def debug_raw():
    """Muestra la respuesta cruda del primer partido de 2026."""
    try:
        res = requests.get(
            f"{ZAFRONIX_BASE}/matches",
            headers=DEFAULT_HEADERS,
            params={"year": WC_YEAR, "limit": 1},
            timeout=12,
        )
    except requests.RequestException as e:
        return jsonify({"msg": str(e)}), 502
    return jsonify({"status_code": res.status_code, "body": res.json()}), 200


@stats_bp.route("/api/stats/topscorers", methods=["GET"])
def top_scorers():
    matches, error = _all_matches()
    if error:
        return jsonify({"msg": error}), 502
    return jsonify(_ranked_players(matches, "goals")), 200


@stats_bp.route("/api/stats/topyellowcards", methods=["GET"])
def top_yellow_cards():
    matches, error = _all_matches()
    if error:
        return jsonify({"msg": error}), 502
    return jsonify(_ranked_players(matches, "yellow_cards", color_filter="yellow")), 200


@stats_bp.route("/api/stats/topredcards", methods=["GET"])
def top_red_cards():
    matches, error = _all_matches()
    if error:
        return jsonify({"msg": error}), 502
    return jsonify(_ranked_players(matches, "red_cards", color_filter="red")), 200


@stats_bp.route("/api/stats/goals-against", methods=["GET"])
def goals_against():
    # Zafronix free tier tampoco expone standings; calculamos del fixture.
    matches, error = _all_matches()
    if error:
        return jsonify({"msg": error}), 502
    best, worst = _defense_from_matches(matches)
    return jsonify({"best_defense": best, "worst_defense": worst}), 200
