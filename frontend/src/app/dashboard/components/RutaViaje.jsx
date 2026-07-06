JavaScript
import * as THREE from 'three';
import { Line } from '@react-three/drei';
import { coordToVector3 } from './utils'; // Tu función matemática

export default function RutaViaje({ origen, destino }) {
    // Convertimos las coordenadas de origen y destino a vectores 3D
    const pA = new THREE.Vector3(...coordToVector3(origen.lat, origen.lng, 2));
    const pB = new THREE.Vector3(...coordToVector3(destino.lat, destino.lng, 2));

    // Calculamos el punto medio en el espacio
    const puntoMedio = new THREE.Vector3().addVectors(pA, pB).multiplyScalar(0.5);

    // Calculamos la distancia para que el arco sea más alto si el viaje es más largo
    const distancia = pA.distanceTo(pB);

    // Normalizamos el punto medio y lo alejamos del centro de la Tierra (radio 2 + altura)
    puntoMedio.normalize().multiplyScalar(2 + distancia * 0.25);

    // Creamos una curva suave que pase por los 3 puntos
    const curva = new THREE.CatmullRomCurve3([pA, puntoMedio, pB]);
    const puntos = curva.getPoints(40); // 40 puntos bastan para que se vea fluida

    return (
        <Line
            points={puntos}
            color="#00ffcc" // Color neón para la ruta
            lineWidth={2}
            dashed={false}
        />
    );
}