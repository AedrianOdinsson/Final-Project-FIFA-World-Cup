"use client";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../../lib/auth";

const PHASES = [
  "Fase de Grupos",
  "Octavos de Final",
  "Cuartos de Final",
  "Semifinal",
  "Final",
];

export default function FavoriteSelectionPage() {
  const [teams, setTeams] = useState([]); // [{ name, group }]
  const [loading, setLoading] = useState(true);

  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedPhase, setSelectedPhase] = useState("");

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // ── Carga equipos desde la API del mundial ──
  /*useEffect(() => {
    console.log("⚽ useEffect ejecutado");
    fetch(
      "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json",
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(
          "✅ Rounds:",
          data.rounds?.map((r) => r.name),
        );
      })
      .catch((err) => {
        console.error("❌ Error completo:", err);
        setError("No se pudieron cargar los equipos");
      })
      .then((data) => {
        const teamMap = new Map();

        data.rounds?.forEach((round) => {
          // Solo rounds de grupo (ej. "Group A", "Grupo A"...)
          const isGroupStage =
            round.name?.toLowerCase().includes("group") ||
            round.name?.toLowerCase().includes("grupo");
          if (!isGroupStage) return;

          round.matches?.forEach((match) => {
            if (match.team1 && !teamMap.has(match.team1)) {
              teamMap.set(match.team1, round.name);
            }
            if (match.team2 && !teamMap.has(match.team2)) {
              teamMap.set(match.team2, round.name);
            }
          });
        });

        const teamList = Array.from(teamMap.entries())
          .map(([name, group]) => ({ name, group }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setTeams(teamList);
      })
      .catch(() => setError("No se pudieron cargar los equipos"))
      .finally(() => setLoading(false));
  }, []);*/

  useEffect(() => {
    console.log("🌐 useEffect ejecutado");

    fetch(
      "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json",
    )
      .then((res) => res.json())
      .then((data) => {
        const teamMap = new Map();

        data.matches?.forEach((match) => {
          // Solo los partidos de fase de grupos traen "group" (ej. "Group A").
          // Los de eliminatoria usan placeholders como "2A" y no cuentan aquí.
          if (!match.group) return;
          if (match.team1 && !teamMap.has(match.team1)) {
            teamMap.set(match.team1, match.group);
          }
          if (match.team2 && !teamMap.has(match.team2)) {
            teamMap.set(match.team2, match.group);
          }
        });

        const teamList = Array.from(teamMap.entries())
          .map(([name, group]) => ({ name, group }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setTeams(teamList);
      })
      .catch((err) => {
        console.error("❌ Error completo:", err);
        setError("No se pudieron cargar los equipos");
      })
      .finally(() => setLoading(false));
  }, []);

  // ── Al elegir equipo, rellena el grupo automáticamente ──
  function handleTeamChange(e) {
    const name = e.target.value;
    setSelectedTeam(name);
    const found = teams.find((t) => t.name === name);
    setSelectedGroup(found ? found.group : "");
  }

  // ── Guarda la selección ──
  async function handleSave() {
    if (!selectedTeam || !selectedPhase) {
      setError("Selecciona un equipo y una fase");
      return;
    }

    const user = getCurrentUser();
    if (!user) {
      setError("Tu sesión expiró, vuelve a iniciar sesión");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("http://localhost:5000/api/selection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          team_name: selectedTeam,
          group: selectedGroup,
          phase: selectedPhase,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.msg || "Error al guardar");
        return;
      }
      setSuccess(
        `¡Selección guardada! ${selectedTeam} llegando a ${selectedPhase}`,
      );
      setSelectedTeam("");
      setSelectedGroup("");
      setSelectedPhase("");
    } catch {
      setError("No se pudo conectar con el servidor");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="p-8 text-gray-400">Cargando equipos...</p>;

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-8 py-12">
      <div className="w-full max-w-md">
        <h2 className="text-4xl font-black text-white tracking-tight mb-2">
          Mi Selección
        </h2>
        <p className="text-gray-400 text-sm mb-8">
          Elige tu equipo favorito y hasta qué fase crees que llegará.
        </p>

        {error && (
          <p className="mb-5 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm">
            {error}
          </p>
        )}
        {success && (
          <p className="mb-5 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm">
            {success}
          </p>
        )}

        <div className="flex flex-col gap-5">
          {/* Equipo */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Equipo Favorito
            </label>
            <select
              value={selectedTeam}
              onChange={handleTeamChange}
              className="bg-[#1a1a1a] border border-gray-700 text-white text-sm rounded-lg px-4 py-3 outline-none focus:border-gray-400 transition-colors"
            >
              <option value="" disabled>
                Selecciona un equipo...
              </option>
              {teams.map((t) => (
                <option key={t.name} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Grupo — solo lectura, se rellena solo */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Grupo
            </label>
            <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3">
              <span
                className={
                  selectedGroup ? "text-white text-sm" : "text-gray-600 text-sm"
                }
              >
                {selectedGroup || "Se rellena al elegir equipo"}
              </span>
            </div>
          </div>

          {/* Fase */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Fase que alcanzará
            </label>
            <select
              value={selectedPhase}
              onChange={(e) => setSelectedPhase(e.target.value)}
              className="bg-[#1a1a1a] border border-gray-700 text-white text-sm rounded-lg px-4 py-3 outline-none focus:border-gray-400 transition-colors"
            >
              <option value="" disabled>
                Selecciona una fase...
              </option>
              {PHASES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Botón */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-black font-bold text-sm py-4 rounded-lg transition-colors duration-150 mt-1 disabled:opacity-50"
          >
            {saving ? "Guardando..." : "Guardar Selección"}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
