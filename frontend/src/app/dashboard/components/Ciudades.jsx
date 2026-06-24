"use client"

export default function coordToVector3(lat, lng, radius = 2) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.sin(theta));
  const z = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);

  return [x, y, z];
};

const SEDES_EJEMPLO = [
  { nombre: "Ciudad de México", lat: 19.4326, lng: -99.1332 },
  { nombre: "New York", lat: 40.7128, lng: -74.0060 },
  { nombre: "Los Angeles", lat: 34.0522, lng: -118.2437 }
];

export function Ciudades() {
  return (
    <group>
      {SEDES_EJEMPLO.map((ciudad, idx) => {
        const posicion = coordToVector3(ciudad.lat, ciudad.lng, 6.03); // 6.03 para que flote sobre la superficie (globo r=6)
        return (
          <mesh key={idx} position={posicion}>
            <sphereGeometry args={[0.03, 16, 16]} />
            <meshBasicMaterial color="#ff0055" />
          </mesh>
        );
      })}
    </group>
  );
}