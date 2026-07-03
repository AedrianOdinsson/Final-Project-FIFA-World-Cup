"use client";
import { useEffect, useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function coordToVector3(lat, lng, radius = 6.03) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180) + Math.PI / 2; // ← añade + Math.PI
  const x = -(radius * Math.sin(phi) * Math.sin(theta));
  const z = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

export function latLngToCameraPos(lat, lng, distance = 14) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(distance * Math.sin(phi) * Math.sin(theta));
  const z = distance * Math.sin(phi) * Math.cos(theta);
  const y = distance * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

async function geocodeStadium(name) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(name)}&format=json&limit=1`;
  const res = await fetch(url, { headers: { "Accept-Language": "es" } });
  const data = await res.json();
  if (data.length > 0) {
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  }
  return null;
}

export function Ciudades({ onSelectStadium, selectedTeam }) {
  const [allMatches, setAllMatches] = useState([]); // todos los partidos del JSON
  const [stadiums, setStadiums] = useState([]); // estadios geocodificados a mostrar
  const [selected, setSelected] = useState(null);
  const cameraTarget = useRef(null);

  // 1 — Carga el JSON una sola vez
  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json",
    )
      .then((res) => res.json())
      .then((data) => {
        // El JSON de 2026 tiene { name, matches } en la raíz
        setAllMatches(data.matches ?? []);
      })
      .catch((err) => console.error("❌ Error cargando JSON:", err));
  }, []);

  // 2 — Cuando cambia el equipo, filtra y geocodifica sus estadios
  useEffect(() => {
    if (!selectedTeam || allMatches.length === 0) {
      setStadiums([]);
      return;
    }

    console.log("🔍 Buscando equipo:", JSON.stringify(selectedTeam));
    console.log("🔍 Equipos en JSON:", [
      ...new Set(allMatches.map((m) => m.team1).filter(Boolean)),
    ]);
    const teamMatches = allMatches.filter(
      (m) => m.team1 === selectedTeam || m.team2 === selectedTeam,
    );
    console.log("🔍 Partidos encontrados:", teamMatches.length);
    console.log("🔍 Primer partido:", JSON.stringify(teamMatches[0]));

    const uniqueStadiumNames = [
      ...new Set(teamMatches.map((m) => m.ground).filter(Boolean)),
    ];

    let cancelled = false;

    async function geocodeAll() {
      const results = [];
      for (const name of uniqueStadiumNames) {
        if (cancelled) return;
        const coords = await geocodeStadium(name);
        if (coords) results.push({ name, lat: coords.lat, lng: coords.lng });
        await new Promise((r) => setTimeout(r, 300));
      }
      console.log("🏟️ Estadios geocodificados:", results);
      if (!cancelled) setStadiums(results);
    }

    setStadiums([]); // limpia mientras carga
    geocodeAll();

    return () => {
      cancelled = true;
    }; // cancela si el equipo cambia antes de terminar
  }, [selectedTeam, allMatches]);

  useFrame(({ camera }) => {
    if (!cameraTarget.current) return;
    camera.position.lerp(cameraTarget.current, 0.04);
    camera.lookAt(0, 0, 0);
  });

  function handleClick(stadium) {
    setSelected(stadium.name);
    cameraTarget.current = latLngToCameraPos(stadium.lat, stadium.lng, 14);
    if (onSelectStadium) onSelectStadium(stadium);
  }

  return (
    <group>
      {stadiums.map((stadium, idx) => {
        const pos = coordToVector3(stadium.lat, stadium.lng, 6.08);
        const isSelected = selected === stadium.name;
        return (
          <mesh
            key={idx}
            position={pos.toArray()}
            onClick={(e) => {
              e.stopPropagation();
              handleClick(stadium);
            }}
          >
            <sphereGeometry args={[isSelected ? 0.09 : 0.06, 16, 16]} />
            <meshBasicMaterial color={isSelected ? "#facc15" : "#ff0055"} />
          </mesh>
        );
      })}
    </group>
  );
}
