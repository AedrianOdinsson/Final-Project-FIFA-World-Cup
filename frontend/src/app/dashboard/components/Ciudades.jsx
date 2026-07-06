"use client";
import { useEffect, useState, useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";

// Coordenadas FIJAS y reales de las 16 sedes del Mundial 2026.
// Las claves coinciden EXACTO con el campo "ground" del JSON de partidos,
// así que no hace falta geocodificar nada en tiempo real (más rápido y 100% confiable).
export const HOST_CITY_COORDS = {
  "Mexico City": { lat: 19.4326, lng: -99.1332 },
  "Guadalajara (Zapopan)": { lat: 20.6597, lng: -103.3496 },
  "Monterrey (Guadalupe)": { lat: 25.6866, lng: -100.3161 },
  "Atlanta": { lat: 33.749, lng: -84.388 },
  "Toronto": { lat: 43.6532, lng: -79.3832 },
  "Vancouver": { lat: 49.2827, lng: -123.1207 },
  "Seattle": { lat: 47.6062, lng: -122.3321 },
  "San Francisco Bay Area (Santa Clara)": { lat: 37.3541, lng: -121.9552 },
  "Los Angeles (Inglewood)": { lat: 33.9617, lng: -118.3531 },
  "New York/New Jersey (East Rutherford)": { lat: 40.8135, lng: -74.0745 },
  "Boston (Foxborough)": { lat: 42.0654, lng: -71.2478 },
  "Philadelphia": { lat: 39.9526, lng: -75.1652 },
  "Miami (Miami Gardens)": { lat: 25.958, lng: -80.2389 },
  "Houston": { lat: 29.7604, lng: -95.3698 },
  "Dallas (Arlington)": { lat: 32.7473, lng: -97.0945 },
  "Kansas City": { lat: 39.0997, lng: -94.5786 },
};

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

// Genera una textura circular con un ícono (emoji) dibujado en un canvas 2D,
// para usar como Sprite (siempre mira a la cámara, ideal para "pines" de mapa).
function useIconTexture(emoji, bg) {
  return useMemo(() => {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 4, 0, Math.PI * 2);
    ctx.fillStyle = bg;
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.stroke();

    ctx.font = `${size * 0.55}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(emoji, size / 2, size / 2 + 4);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, [emoji, bg]);
}

// Arco elevado tipo "ruta de vuelo" entre dos sedes sobre la esfera del globo.
function FlightArc({ from, to, active }) {
  const points = useMemo(() => {
    const start = from.clone();
    const end = to.clone();
    const mid = start.clone().add(end).multiplyScalar(0.5);
    mid.setLength(Math.max(start.length(), end.length()) + 1.4);

    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    return curve.getPoints(40);
  }, [from, to]);

  return (
    <Line
      points={points}
      color={active ? "#facc15" : "#38bdf8"}
      lineWidth={active ? 2.5 : 1.4}
      transparent
      opacity={active ? 0.95 : 0.45}
      dashed={!active}
      dashSize={0.12}
      gapSize={0.08}
    />
  );
}

function StadiumIcon({ position, active, onClick }) {
  const texture = useIconTexture("⚽", active ? "#facc15" : "#ff0055");
  const ref = useRef();

  useFrame(({ clock }) => {
    if (ref.current && active) {
      const s = 0.42 + Math.sin(clock.elapsedTime * 3) * 0.05;
      ref.current.scale.set(s, s, s);
    }
  });

  return (
    <sprite
      ref={ref}
      position={position.toArray()}
      scale={active ? [0.42, 0.42, 0.42] : [0.3, 0.3, 0.3]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <spriteMaterial map={texture} depthTest={false} />
    </sprite>
  );
}

export function Ciudades({ onSelectStadium, selectedTeam, onStatusChange }) {
  const [allMatches, setAllMatches] = useState([]);
  const [stadiums, setStadiums] = useState([]); // sedes de este equipo, en orden cronológico
  const [tourIndex, setTourIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const cameraTarget = useRef(null);

  // 1 — Carga el JSON una sola vez
  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json",
    )
      .then((res) => res.json())
      .then((data) => setAllMatches(data.matches ?? []))
      .catch((err) => console.error("❌ Error cargando JSON:", err));
  }, []);

  // 2 — Cuando cambia el equipo: filtra sus partidos, ordena por fecha
  //     y resuelve cada sede contra la tabla fija de coordenadas (sin red, instantáneo).
  useEffect(() => {
    if (!selectedTeam || allMatches.length === 0) {
      setStadiums([]);
      if (onStatusChange) onStatusChange("idle");
      return;
    }

    const teamMatches = allMatches
      .filter((m) => m.team1 === selectedTeam || m.team2 === selectedTeam)
      .filter((m) => m.ground)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    console.log(`🏟️ ${selectedTeam}: ${teamMatches.length} partidos encontrados`, teamMatches);

    const seen = new Set();
    const results = [];
    teamMatches.forEach((m) => {
      if (seen.has(m.ground)) return;
      seen.add(m.ground);
      const coords = HOST_CITY_COORDS[m.ground];
      if (coords) {
        results.push({ name: m.ground, lat: coords.lat, lng: coords.lng });
      } else {
        console.warn(`⚠️ Sede sin coordenadas registradas: "${m.ground}"`);
      }
    });

    console.log(`✅ ${selectedTeam}: ${results.length} sedes resueltas`, results);
    setStadiums(results);
    setTourIndex(0);
    setPaused(false);
    if (onStatusChange) onStatusChange(results.length > 0 ? "ready" : "empty");
  }, [selectedTeam, allMatches]);

  // 3 — Recorrido automático: la cámara "salta" de sede en sede.
  useEffect(() => {
    if (stadiums.length === 0 || paused) return;

    const stop = stadiums[tourIndex];
    cameraTarget.current = latLngToCameraPos(stop.lat, stop.lng, 13);
    if (onSelectStadium) onSelectStadium(stop);

    if (stadiums.length <= 1) return;

    const timer = setTimeout(() => {
      setTourIndex((i) => (i + 1) % stadiums.length);
    }, 3200);

    return () => clearTimeout(timer);
  }, [stadiums, tourIndex, paused]);

  useFrame(({ camera }) => {
    if (!cameraTarget.current) return;
    camera.position.lerp(cameraTarget.current, 0.04);
    camera.lookAt(0, 0, 0);
  });

  function handleClick(stadium, idx) {
    setPaused(true);
    setTourIndex(idx);
    cameraTarget.current = latLngToCameraPos(stadium.lat, stadium.lng, 13);
    if (onSelectStadium) onSelectStadium(stadium);
  }

  const positions = stadiums.map((s) => coordToVector3(s.lat, s.lng, 6.08));

  return (
    <group>
      {positions.slice(0, -1).map((pos, idx) => (
        <FlightArc
          key={`arc-${idx}`}
          from={pos}
          to={positions[idx + 1]}
          active={idx === tourIndex || idx + 1 === tourIndex}
        />
      ))}

      {stadiums.map((stadium, idx) => (
        <StadiumIcon
          key={stadium.name}
          position={positions[idx]}
          active={idx === tourIndex}
          onClick={() => handleClick(stadium, idx)}
        />
      ))}
    </group>
  );
}