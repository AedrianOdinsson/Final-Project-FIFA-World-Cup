"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Globo } from "./Globo";
import { Ciudades } from "./Ciudades";

export default function MapaMundial({ selectedTeam }) {
  const [selectedStadium, setSelectedStadium] = useState(null);
  const [tourStatus, setTourStatus] = useState("idle"); // idle | loading | empty | ready

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Canvas
        camera={{ position: [0, 0, 16], fov: 50 }}
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
          onStatusChange={setTourStatus}
        />
        <OrbitControls
          enablePan={false}
          rotateSpeed={0.2}
          zoomSpeed={0.6}
          minDistance={8}
          maxDistance={28}
          enableDamping={true}
        />
      </Canvas>

      {selectedTeam && tourStatus === "loading" && (
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(15,15,15,0.85)",
            borderRadius: "10px",
            padding: "10px 18px",
            color: "#9ca3af",
            fontSize: "13px",
            pointerEvents: "none",
          }}
        >
          🔎 Ubicando los estadios de {selectedTeam}...
        </div>
      )}

      {selectedTeam && tourStatus === "empty" && (
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(120,20,20,0.85)",
            borderRadius: "10px",
            padding: "10px 18px",
            color: "#fecaca",
            fontSize: "13px",
            pointerEvents: "none",
          }}
        >
          No se pudieron ubicar los estadios de {selectedTeam} en el mapa.
        </div>
      )}

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
            minWidth: "260px",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "11px",
              color: "#9ca3af",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "999px",
                background: "#facc15",
                display: "inline-block",
                animation: "pulse 1.4s ease-in-out infinite",
              }}
            />
            Recorrido de {selectedTeam || "la selección"}
          </p>
          <p style={{ margin: "6px 0 0", fontSize: "18px", fontWeight: "800" }}>
            ⚽ {selectedStadium.name}
          </p>
          <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#9ca3af" }}>
            {selectedStadium.lat.toFixed(4)}, {selectedStadium.lng.toFixed(4)}
          </p>
        </div>
      )}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.6); }
        }
      `}</style>
    </div>
  );
}