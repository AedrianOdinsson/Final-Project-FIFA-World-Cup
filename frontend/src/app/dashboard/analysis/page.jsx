"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { SkeletonList } from "../../components/Skeleton";

const SECTIONS_ENDPOINTS = {
  scorers: "topscorers",
  defense: "goals-against",
  yellow: "topyellowcards",
  red: "topredcards",
};

// Fila unificada. `size` (36 j jugador, 32 j equipo) decide estilos de la
// imagen, ring y fallback para que PlayerRow y TeamRow no vuelvan a
// desincronizarse en el proximo cambio de flags/icons.
// `sub` es opcional: si llega, dibuja segunda linea gris debajo del nombre
// (caso jugadores); si no, queda line unica (caso equipos).
function Row({ rank, flag, name, sub, size = 36, value, valueLabel }) {
  const isPlayer = size >= 36;
  const imgCls = isPlayer
    ? "h-9 w-9 shrink-0 rounded-md object-cover bg-gray-800 ring-1 ring-white/10"
    : "h-8 w-8 shrink-0 object-contain";
  const fbCls = isPlayer
    ? "h-9 w-9 shrink-0 rounded-md bg-gray-800"
    : "h-8 w-8 shrink-0 rounded-full bg-gray-800";
  return (
    <div className="flex items-center gap-2.5 bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-3">
      <span className="w-5 shrink-0 text-center text-xs font-bold text-gray-500">
        {rank}
      </span>
      {flag ? (
        <Image
          src={flag}
          alt={name}
          width={size}
          height={size}
          // loading=lazy: las 10 filas piden las banderas en cascada.
          loading="lazy"
          className={imgCls}
        />
      ) : (
        <div className={fbCls} />
      )}
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold text-white">
          {name}
        </div>
        {sub && (
          <div className="truncate text-xs text-gray-500">{sub}</div>
        )}
      </div>
      <div className="shrink-0 text-right">
        <div className="text-lg font-black text-white leading-none">
          {value ?? "-"}
        </div>
        <div className="text-[10px] uppercase tracking-wide text-gray-600">
          {valueLabel}
        </div>
      </div>
    </div>
  );
}

function Section({ title, subtitle, children }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-black text-white tracking-tight mb-0.5">
        {title}
      </h2>
      <p className="text-gray-500 text-xs mb-3">{subtitle}</p>
      {children}
    </section>
  );
}

export default function AnalysisPage() {
  const [data, setData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAll() {
      const entries = await Promise.all(
        Object.entries(SECTIONS_ENDPOINTS).map(async ([key, endpoint]) => {
          try {
            const res = await fetch(`http://localhost:5000/api/stats/${endpoint}`);
            const json = await res.json();
            if (!res.ok) {
              return [key, null, json.msg || "Error al cargar"];
            }
            return [key, json, null];
          } catch {
            return [key, null, "No se pudo conectar con el servidor"];
          }
        }),
      );

      const nextData = {};
      const nextErrors = {};
      entries.forEach(([key, value, err]) => {
        if (err) nextErrors[key] = err;
        else nextData[key] = value;
      });
      setData(nextData);
      setErrors(nextErrors);
      setLoading(false);
    }
    loadAll();
  }, []);

  const globalError = Object.values(errors)[0];
  const scorers = data.scorers || [];
  const yellow = data.yellow || [];
  const red = data.red || [];
  const defense = data.defense || { best_defense: [], worst_defense: [] };

  return (
    <div className="h-full overflow-y-auto bg-[#0f0f0f] px-8 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-black text-white tracking-tight mb-1">
          Análisis del Torneo
        </h1>
        <p className="text-gray-400 text-sm mb-2">
          Estadísticas del Mundial 2026 — goleadores, defensas y disciplina.
        </p>

        {globalError && !loading && (
          <p className="mb-8 px-4 py-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm">
            {globalError}
            {globalError.includes("ZAFRONIX_API_KEY") && (
              <>
                {" "}
                Consigue una clave gratuita en{" "}
                <a
                  href="https://api.zafronix.com/signup"
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  api.zafronix.com/signup
                </a>{" "}
                y agrégala como <code className="bg-black/40 px-1 rounded">ZAFRONIX_API_KEY</code>{" "}
                en <code className="bg-black/40 px-1 rounded">backend/.env</code>.
              </>
            )}
          </p>
        )}

        {loading ? (
          <SkeletonList count={8} rowClassName="h-16" />
        ) : (
          <>
            <Section
              title="⚽ Goleadores"
              subtitle="Jugadores con más goles anotados en el torneo"
            >
              <div className="flex flex-col gap-2">
                {scorers.length === 0 && (
                  <p className="text-gray-600 text-sm">Sin datos disponibles.</p>
                )}
                {scorers.slice(0, 10).map((p, i) => (
                  <Row
                    size={36}
                    key={p.id ?? i}
                    rank={i + 1}
                    flag={p.team_logo}
                    name={p.name}
                    sub={p.team}
                    value={p.goals}
                    valueLabel="goles"
                  />
                ))}
              </div>
            </Section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Section
                title="🧤 Mejores Defensas"
                subtitle="Equipos con menos goles recibidos"
              >
                <div className="flex flex-col gap-2">
                  {defense.best_defense.length === 0 && (
                    <p className="text-gray-600 text-sm">Sin datos disponibles.</p>
                  )}
                  {defense.best_defense.map((t, i) => (
                    <Row
                      key={t.team + i}
                      rank={i + 1}
                      flag={t.team_logo}
                      size={32}
                      name={t.team}
                      value={t.goals_against}
                      valueLabel="en contra"
                    />
                  ))}
                </div>
              </Section>

              <Section
                title="🥅 Defensas más Vulnerables"
                subtitle="Equipos con más goles recibidos"
              >
                <div className="flex flex-col gap-2">
                  {defense.worst_defense.length === 0 && (
                    <p className="text-gray-600 text-sm">Sin datos disponibles.</p>
                  )}
                  {defense.worst_defense.map((t, i) => (
                    <Row
                      key={t.team + i}
                      rank={i + 1}
                      flag={t.team_logo}
                      size={32}
                      name={t.team}
                      value={t.goals_against}
                      valueLabel="en contra"
                    />
                  ))}
                </div>
              </Section>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-2">
              <Section
                title="🟨 Tarjetas Amarillas"
                subtitle="Jugadores más amonestados"
              >
                <div className="flex flex-col gap-2">
                  {yellow.length === 0 && (
                    <p className="text-gray-600 text-sm">Sin datos disponibles.</p>
                  )}
                  {yellow.slice(0, 10).map((p, i) => (
                    <Row
                      size={36}
                      key={p.id ?? i}
                      rank={i + 1}
                      flag={p.team_logo}
                      name={p.name}
                      sub={p.team}
                      value={p.yellow_cards}
                      valueLabel="amarillas"
                    />
                  ))}
                </div>
              </Section>

              <Section
                title="🟥 Tarjetas Rojas"
                subtitle="Jugadores expulsados en el torneo"
              >
                <div className="flex flex-col gap-2">
                  {red.length === 0 && (
                    <p className="text-gray-600 text-sm">Sin expulsiones registradas.</p>
                  )}
                  {red.slice(0, 10).map((p, i) => (
                    <Row
                      size={36}
                      key={p.id ?? i}
                      rank={i + 1}
                      flag={p.team_logo}
                      name={p.name}
                      sub={p.team}
                      value={p.red_cards}
                      valueLabel="rojas"
                    />
                  ))}
                </div>
              </Section>
            </div>
          </>
        )}
      </div>
    </div>
  );
}