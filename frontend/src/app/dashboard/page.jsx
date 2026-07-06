"use client";

import { useState } from "react";
import MapaMundial from "./components/MapaMundial";
import FavoriteSelection from "./components/FavoriteSelections";

export default function DashboardPage() {
  const [flyToCountry, setFlyToCountry] = useState(null);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Mapa 3D de fondo */}
      <MapaMundial selectedTeam={flyToCountry} />

      {/* Panel título — arriba izquierda */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          color: "white",
          pointerEvents: "none",
          background: "rgba(0,0,0,0.5)",
          padding: "20px",
          borderRadius: "8px",
          backdropFilter: "blur(5px)",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "24px" }}>Mundial 3D Dashboard</h1>
        <p style={{ opacity: 0.8 }}>Selecciona un país para ver su recorrido</p>
      </div>

      {/* Panel selección favorita — arriba derecha */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          background: "rgba(15,15,15,0.85)",
          borderRadius: "12px",
          backdropFilter: "blur(8px)",
          width: "360px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <FavoriteSelection onTeamSelect={setFlyToCountry} />
      </div>
    </div>
  );
}