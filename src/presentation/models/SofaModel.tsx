import type { JSX } from "react";
import { Box, Edges, Cylinder } from "@react-three/drei";
import { WhiteToon, EdgeColor, SkyblueToon, SkyblueEdgeColor, WoodToon } from "./_materials";
import { aabbFromDims, cornerPositions } from "./_utils";

export type ModelProps = JSX.IntrinsicElements["group"];

export const SOFA_DIMS = { x: 2.52, y: 0.42, z: 1.08 }; // largura, altura, profundidade (SofaModel * 0.6)
export const SOFA_AABB = aabbFromDims(SOFA_DIMS.x, SOFA_DIMS.y, SOFA_DIMS.z);

export default function SofaModel(props: ModelProps): JSX.Element {
    const { x, y, z } = SOFA_DIMS;

    // ---- Config dos pés ----
    const footRadius = 0.036; // 0.06 * 0.6
    const footHeight = 0.09; // 0.15 * 0.6
    const insetX = 0.072; // 0.12 * 0.6 - margem em X
    const insetZ = 0.06; // 0.1 * 0.6 - margem em Z

    // Posições dos cantos (com inset). Altura = metade do pé (apoiado no piso)
    const footPositions = cornerPositions(x, z, insetX, insetZ, footHeight / 2);
    const footY = footHeight / 2;

    // Corpo em cima dos pés
    const bodyY = y / 2 + footHeight;

    return (
        <group {...props}>
            {/* Corpo central */}
            <Box args={[x, y, z]} position={[0, bodyY, 0]} castShadow>
                {WhiteToon}
                <Edges color={EdgeColor} />
            </Box>

            {/* Assentos */}
            <group position={[0, 0.03 + bodyY, 0]}>
                {" "}
                {/* 0.05 * 0.6 = 0.03 */}
                {[-1, 0, 1].map((i) => (
                    <Box
                        key={i}
                        args={[0.72, 0.12, 0.9]} // [1.2 * 0.6, 0.2 * 0.6, 1.5 * 0.6]
                        position={[i * 0.81, 0.24, 0]} // [1.35 * 0.6, 0.4 * 0.6, 0]
                        castShadow
                    >
                        {SkyblueToon}
                        <Edges color={SkyblueEdgeColor} opacity={1} />
                    </Box>
                ))}
            </group>

            {/* Pés — cilindros nos 4 cantos com inset */}
            {footPositions.map((p, idx) => (
                <Cylinder
                    key={idx}
                    position={[p.x, footY, p.z]}
                    // Cylinder args = [radiusTop, radiusBottom, height, radialSegments?]
                    args={[footRadius, footRadius, footHeight, 5]}
                    castShadow
                >
                    {WoodToon}
                </Cylinder>
            ))}
        </group>
    );
}
