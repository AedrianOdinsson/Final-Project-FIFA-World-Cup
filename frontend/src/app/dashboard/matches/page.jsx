"use client";
import { useEffect, useMemo, useState } from "react";

// --- HELPERS PARA BANDERAS ---
const getCountryCode = (countryName) => {
  if (!countryName) return null;

  const codes = {
    // CONCACAF
    Mexico: "mx",
    Canada: "ca",
    "United States": "us",
    USA: "us",
    "Costa Rica": "cr",
    Panama: "pa",
    Jamaica: "jm",
    Honduras: "hn",
    "El Salvador": "sv",
    // CONMEBOL
    Argentina: "ar",
    Brazil: "br",
    Uruguay: "uy",
    Colombia: "co",
    Chile: "cl",
    Peru: "pe",
    Ecuador: "ec",
    Venezuela: "ve",
    Bolivia: "bo",
    Paraguay: "py",
    // UEFA (Europa)
    France: "fr",
    England: "gb-eng",
    Spain: "es",
    Germany: "de",
    Portugal: "pt",
    Italy: "it",
    Netherlands: "nl",
    Croatia: "hr",
    Belgium: "be",
    Switzerland: "ch",
    Denmark: "dk",
    Serbia: "rs",
    Poland: "pl",
    Wales: "gb-wls",
    Scotland: "gb-sct",
    Sweden: "se",
    Austria: "at",
    Hungary: "hu",
    "Czech Republic": "cz",
    Ukraine: "ua",
    Turkey: "tr",
    Norway: "no",
    // AFC (Asia)
    Japan: "jp",
    "South Korea": "kr",
    "Korea Republic": "kr",
    Iran: "ir",
    "Saudi Arabia": "sa",
    Australia: "au",
    Qatar: "qa",
    "United Arab Emirates": "ae",
    // CAF (África)
    Morocco: "ma",
    Senegal: "sn",
    Cameroon: "cm",
    Ghana: "gh",
    Tunisia: "tn",
    Egypt: "eg",
    Nigeria: "ng",
    Algeria: "dz",
    "Ivory Coast": "ci",
    "Côte d'Ivoire": "ci",
    "South Africa": "za",
    // OFC (Oceanía)
    "New Zealand": "nz",
  };

  const normalizedName = countryName.trim();
  return codes[normalizedName] || null;
};

const FlagIcon = ({ code, alt, className = "" }) => {
  if (!code) {
    return (
      <div
        className={`bg-gray-800 border border-gray-700 rounded-[2px] w-5 h-3.5 ${className}`}
        title={alt}
      />
    );
  }
  return (
    <img
      src={`https://flagcdn.com/w40/${code}.png`}
      srcSet={`https://flagcdn.com/w80/${code}.png 2x`}
      alt={`Bandera de ${alt}`}
      className={`w-5 h-3.5 object-cover rounded-[2px] shadow-sm ${className}`}
    />
  );
};

// --- COMPONENTES DE ESTADÍSTICAS DEL PARTIDO ---
const MatchScore = ({ match }) => {
  const s1 = match?.score?.ft?.[0] ?? match?.score1;
  const s2 = match?.score?.ft?.[1] ?? match?.score2;

  if (s1 !== undefined && s2 !== undefined) {
    return (
      <div className="flex items-center gap-2 font-bold text-sm bg-black/60 px-3 py-1 rounded-md border border-gray-800">
        <span className="text-white">{s1}</span>
        <span className="text-gray-500">-</span>
        <span className="text-white">{s2}</span>
      </div>
    );
  }
  return (
    <span className="text-gray-600 text-xs font-medium mx-2 bg-black/20 px-2 py-1 rounded">
      VS
    </span>
  );
};

const MatchStats = ({ match }) => {
  if (!match.goals || match.goals.length === 0) return null;

  return (
    <div className="mt-3 pt-3 border-t border-gray-800/50 flex flex-col gap-1.5">
      <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
        Goles / Estadísticas
      </span>
      <div className="grid grid-cols-2 gap-4 text-xs">
        <div className="text-gray-400">
          {match.goals
            .filter((g) => g.team === match.team1 || g.name1)
            .map((g, i) => (
              <div key={i} className="flex items-center gap-1.5 mb-1">
                <svg
                  className="w-3 h-3 text-emerald-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                </svg>
                <span>
                  {g.name || g.name1}{" "}
                  <span className="text-gray-600">({g.minute}')</span>
                </span>
              </div>
            ))}
        </div>
        <div className="text-gray-400 text-right">
          {match.goals
            .filter((g) => g.team === match.team2 || g.name2)
            .map((g, i) => (
              <div
                key={i}
                className="flex items-center justify-end gap-1.5 mb-1"
              >
                <span>
                  {g.name || g.name2}{" "}
                  <span className="text-gray-600">({g.minute}')</span>
                </span>
                <svg
                  className="w-3 h-3 text-emerald-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                </svg>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [groupFilter, setGroupFilter] = useState("Todos");

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json",
    )
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then((data) => setMatches(data.matches ?? []))
      .catch(() => setError("No se pudieron cargar los partidos"))
      .finally(() => setLoading(false));
  }, []);

  const groups = useMemo(() => {
    const set = new Set(matches.map((m) => m.group).filter(Boolean));
    return ["Todos", ...Array.from(set).sort()];
  }, [matches]);

  const filtered = useMemo(() => {
    if (groupFilter === "Todos") return matches;
    return matches.filter((m) => m.group === groupFilter);
  }, [matches, groupFilter]);

  if (loading) return <p className="p-8 text-gray-400">Cargando partidos...</p>;

  return (
    <div className="h-full overflow-y-auto bg-[#0f0f0f] px-8 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black text-white tracking-tight mb-1">
          Partidos
        </h1>
        <p className="text-gray-400 text-sm mb-6">
          Calendario completo del Mundial 2026.
        </p>

        {error && (
          <p className="mb-5 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm">
            {error}
          </p>
        )}

        {/* Filtros */}
        <div className="mb-6 flex flex-wrap gap-2">
          {groups.map((g) => (
            <button
              key={g}
              onClick={() => setGroupFilter(g)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                groupFilter === g
                  ? "bg-white text-black border-white"
                  : "text-gray-400 border-gray-700 hover:border-gray-500"
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Lista de Partidos */}
        <div className="flex flex-col gap-3">
          {filtered.map((m, idx) => (
            <div
              key={idx}
              className="flex flex-col bg-[#1a1a1a] border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1 sm:gap-3 flex-1">
                  {/* Equipo 1 */}
                  <div className="flex items-center gap-2 justify-end w-[35%]">
                    <span className="text-sm font-medium text-white text-right truncate">
                      {m.team1}
                    </span>
                    <FlagIcon code={getCountryCode(m.team1)} alt={m.team1} />
                  </div>

                  {/* Score o VS dinámico */}
                  <div className="flex justify-center w-[20%]">
                    <MatchScore match={m} />
                  </div>

                  {/* Equipo 2 */}
                  <div className="flex items-center gap-2 justify-start w-[35%]">
                    <FlagIcon code={getCountryCode(m.team2)} alt={m.team2} />
                    <span className="text-sm font-medium text-white truncate">
                      {m.team2}
                    </span>
                  </div>
                </div>

                {/* Info de fecha y estadio (Escritorio) */}
                <div className="text-right hidden sm:flex flex-col shrink-0 ml-4 border-l border-gray-800 pl-4 w-36">
                  <div className="text-gray-300 text-xs font-medium">
                    {m.date}
                  </div>
                  <div className="text-gray-500 text-[11px] mt-0.5">
                    {m.time} | {m.group || m.round}
                  </div>
                  <div
                    className="text-gray-600 text-[11px] mt-1 truncate"
                    title={m.ground}
                  >
                    {m.ground}
                  </div>
                </div>
              </div>

              {/* Info de fecha y estadio (Móvil) */}
              <div className="sm:hidden text-center mt-3 text-gray-500 text-[11px]">
                {m.date} a las {m.time} | {m.group || m.round}
                <br />
                <span className="text-gray-600">{m.ground}</span>
              </div>

              {/* Goles / Estadísticas */}
              <MatchStats match={m} />
            </div>
          ))}

          {filtered.length === 0 && (
            <p className="text-gray-500 text-sm">
              No hay partidos para este filtro.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
