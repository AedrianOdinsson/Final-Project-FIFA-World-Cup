"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Globo } from "./Globo";
import { Ciudades } from "./Ciudades";

export default function MapaMundial() {
  return (
    <div style={{ width: "100%", height: "100%" }}>
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
        <OrbitControls
          enablePan={false}
          rotateSpeed={0.2}
          zoomSpeed={0.6}
          minDistance={8}
          maxDistance={28}
          enableDamping={true}
        />
      </Canvas>
    </div>
  );
}
