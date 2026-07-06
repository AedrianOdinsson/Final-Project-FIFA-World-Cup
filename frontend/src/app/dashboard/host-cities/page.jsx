"use client";
import { useEffect, useMemo, useState } from "react";

export default function HostCitiesPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json",
    )
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then((data) => setMatches(data.matches ?? []))
      .catch(() => setError("No se pudieron cargar las sedes"))
      .finally(() => setLoading(false));
  }, []);

  const cities = useMemo(() => {
    const map = new Map();
    matches.forEach((m) => {
      if (!m.ground) return;
      map.set(m.ground, (map.get(m.ground) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [matches]);

  if (loading) {
    return <p className="p-8 text-gray-400">Cargando sedes...</p>;
  }

  return (
    <div className="h-full overflow-y-auto bg-[#0f0f0f] px-8 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black text-white tracking-tight mb-1">
          Sedes
        </h1>
        <p className="text-gray-400 text-sm mb-6">
          Ciudades y estadios que albergan el Mundial 2026 ({cities.length}{" "}
          sedes).
        </p>

        {error && (
          <p className="mb-5 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm">
            {error}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {cities.map((city) => (
            <div
              key={city.name}
              className="bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-3 flex items-center justify-between"
            >
              <span className="text-white text-sm font-semibold">
                {city.name}
              </span>
              <span className="text-gray-500 text-xs">
                {city.count} {city.count === 1 ? "partido" : "partidos"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}