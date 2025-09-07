import { Box, Edges, Cylinder } from "@react-three/drei";
import type { JSX } from "react";

export type ModelProps = JSX.IntrinsicElements["group"];

export const SOFA_DIMS = { x: 4.2, y: 0.7, z: 1.8 }; // largura, altura, profundidade
export const SOFA_AABB = {
    min: [-SOFA_DIMS.x / 2, 0, -SOFA_DIMS.z / 2],
    max: [SOFA_DIMS.x / 2, SOFA_DIMS.y, SOFA_DIMS.z / 2],
};

export default function SofaModel(props: ModelProps): JSX.Element {
    const { x, y, z } = SOFA_DIMS;

    // ---- Config dos pés ----
    const footRadius = 0.06;
    const footHeight = 0.15;
    const insetX = 0.12; // margem em X
    const insetZ = 0.1; // margem em Z

    // Posições dos cantos (com inset). Altura = metade do pé (apoiado no piso)
    const hx = x / 2 - insetX;
    const hz = z / 2 - insetZ;
    const footY = footHeight / 2;
    const footPositions: [number, number, number][] = [
        [-hx, footY, -hz],
        [hx, footY, -hz],
        [hx, footY, hz],
        [-hx, footY, hz],
    ];

    // Corpo em cima dos pés
    const bodyY = y / 2 + footHeight;

    return (
        <group {...props}>
            {/* Corpo central */}
            <Box args={[x, y, z]} position={[0, bodyY, 0]} castShadow>
                <meshToonMaterial color="white" />
                <Edges color="whitesmoke" />
            </Box>

            {/* Assentos */}
            <group position={[0, 0.05 + bodyY, 0]}>
                {[-1, 0, 1].map((i) => (
                    <Box key={i} args={[1.2, 0.2, 1.5]} position={[i * 1.35, 0.4, 0]} castShadow>
                        <meshToonMaterial color="skyblue" />
                        <Edges color="skyblue" opacity={1} />
                    </Box>
                ))}
            </group>

            {/* Pés — cilindros nos 4 cantos com inset */}
            {footPositions.map((p, idx) => (
                <Cylinder
                    key={idx}
                    position={p}
                    // Cylinder args = [radiusTop, radiusBottom, height, radialSegments?]
                    args={[footRadius, footRadius, footHeight, 5]}
                    castShadow
                >
                    <meshToonMaterial color="sienna" />
                </Cylinder>
            ))}
        </group>
    );
}
