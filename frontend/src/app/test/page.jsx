"use client";
import { useEffect, useState } from "react";

export default function TestPage() {
  const [data, setData] = useState(null);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json")
      .then(res => res.json())
      .then(data => {
        console.log("✅ API consumida correctamente");
        console.log(data);
        setData(data);

        // Extraemos los estadios del mismo JSON
        const stadiums = [...new Set(
          data.rounds?.flatMap(r => r.matches?.map(m => m.stadium) ?? []).filter(Boolean)
        )];
        console.log("✅ Estadios:", stadiums);
        setVenues(stadiums);
      })
      .catch(err => console.error("❌ Error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-8 text-gray-500">Cargando...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Mundial 2026 — Grupos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.rounds?.map((round) => (
          <div key={round.name} className="bg-white border border-gray-200 rounded-lg p-4">
            <h2 className="font-semibold text-gray-700 mb-2">{round.name}</h2>
            {round.matches?.map((match, i) => (
              <div key={i} className="text-sm text-gray-600 py-1 border-b border-gray-100 last:border-0">
                {match.team1} vs {match.team2}
                {match.stadium && <span className="block text-xs text-gray-400">{match.stadium}</span>}
              </div>
            ))}
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Estadios</h2>
      <div className="flex flex-wrap gap-2">
        {venues.map((v, i) => (
          <span key={i} className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full border border-blue-200">
            {v}
          </span>
        ))}
      </div>
    </div>
  );
}