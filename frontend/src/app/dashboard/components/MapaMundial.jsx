"use client";

import { useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Globo } from "./Globo";
import { Ciudades, latLngToCameraPos } from "./Ciudades";

function CameraFlight({ target }) {
  useFrame(({ camera }) => {
    if (!target) return;
    camera.position.lerp(target, 0.04);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function MapaMundial({ flyToCountry, selectedTeam }) {
  const [selectedStadium, setSelectedStadium] = useState(null);
  const [cameraTarget, setCameraTarget] = useState(null);

  // Geocodifica el país seleccionado y mueve la cámara hacia él
  useEffect(() => {
    if (!flyToCountry) return;
    console.log("🌍 Geocodificando país:", flyToCountry);

    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(flyToCountry)}&format=json&limit=1`;
    fetch(url, { headers: { "Accept-Language": "es" } })
      .then((res) => res.json())
      .then((data) => {
        console.log("🌍 Resultado geocoding:", data);
        if (data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lng = parseFloat(data[0].lon);
          console.log("🌍 Coordenadas:", lat, lng);
          setCameraTarget(latLngToCameraPos(lat, lng, 14));
        } else {
          console.warn("⚠️ No se encontraron coordenadas para:", flyToCountry);
        }
      })
      .catch((err) => console.error("❌ Error geocodificando país:", err));
  }, [flyToCountry]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Canvas
        camera={{ position: [6, -2, 15], fov: 50 }}
        style={{ width: "100%", height: "100%" }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[5, 3, 5]} intensity={1.35} />
        <directionalLight position={[-4, -1, -5]} intensity={0.45} />
        <Stars
          radius={100}
          depth={50}
          count={100}
          factor={4}
          saturation={0}
          fade
        />
        <Globo />
        <Ciudades
          onSelectStadium={setSelectedStadium}
          selectedTeam={selectedTeam}
        />
        <CameraFlight target={cameraTarget} />
        <OrbitControls
          enablePan={false}
          rotateSpeed={0.2}
          zoomSpeed={0.6}
          minDistance={8}
          maxDistance={28}
          enableDamping={true}
        />
      </Canvas>

      {selectedStadium && (
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(15,15,15,0.85)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
            padding: "16px 24px",
            color: "white",
            textAlign: "center",
            pointerEvents: "none",
            minWidth: "240px",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "11px",
              color: "#9ca3af",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Estadio seleccionado
          </p>
          <p style={{ margin: "6px 0 0", fontSize: "18px", fontWeight: "800" }}>
            {selectedStadium.name}
          </p>
          <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#9ca3af" }}>
            {selectedStadium.lat.toFixed(4)}, {selectedStadium.lng.toFixed(4)}
          </p>
        </div>
      )}
    </div>
  );
}
