"use client";

import dynamic from "next/dynamic";
import MapaMundial from "./components/MapaMundial";

export default function DashboardPage() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Tu mapa 3D ocupará toda la pantalla de fondo */}
      <MapaMundial />

      {/* Aquí puedes superponer la interfaz de usuario del Dashboard (menús, resultados, etc.) */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          color: "white",
          pointerEvents: "none", // Permite que sigas interactuando con el mapa 3D de fondo
          background: "rgba(0, 0, 0, 0.5)",
          padding: "20px",
          borderRadius: "8px",
          backdropFilter: "blur(5px)",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "24px" }}>Mundial 3D Dashboard</h1>
        <p style={{ opacity: 0.8 }}>Selecciona un país para ver su recorrido</p>
      </div>
    </div>
  );
}
