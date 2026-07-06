"use client";
import { useEffect, useMemo, useState } from "react";

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

  if (loading) {
    return <p className="p-8 text-gray-400">Cargando partidos...</p>;
  }

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

        <div className="flex flex-col gap-2">
          {filtered.map((m, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-3"
            >
              <div className="flex flex-col">
                <span className="text-white text-sm font-semibold">
                  {m.team1} <span className="text-gray-500">vs</span>{" "}
                  {m.team2}
                </span>
                <span className="text-gray-500 text-xs mt-0.5">
                  {m.ground}
                  {m.group ? ` · ${m.group}` : ` · ${m.round}`}
                </span>
              </div>
              <div className="text-right shrink-0 ml-4">
                <div className="text-gray-300 text-xs">{m.date}</div>
                <div className="text-gray-600 text-[11px]">{m.time}</div>
              </div>
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