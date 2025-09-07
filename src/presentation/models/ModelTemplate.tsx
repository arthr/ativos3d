import type { JSX } from "react";
import { Box, Cylinder, Edges } from "@react-three/drei";
import { aabbFromDims, cornerPositions, innerDims } from "./_utils";
import { WhiteToon, GrayToon, SteelToon, EdgeColor } from "./_materials";

export type ModelProps = JSX.IntrinsicElements["group"];

// === Dimensões externas (pivot no piso) ===
export const MODEL_DIMS = { x: 1, y: 1, z: 1 };
export const MODEL_AABB = aabbFromDims(MODEL_DIMS.x, MODEL_DIMS.y, MODEL_DIMS.z);

export default function ModelTemplate(props: ModelProps): JSX.Element {
    const { x, y: totalH, z } = MODEL_DIMS;

    // Pés (exemplo)
    const legH = 0.08,
        legR = 0.06,
        insetX = 0.12,
        insetZ = 0.1;

    // Corpo oco (exemplo)
    const panelT = 0.03;
    const bodyY = totalH - legH;
    const bodyYpos = legH + bodyY / 2;
    const inner = innerDims(x, bodyY, z, panelT);

    return (
        <group {...props}>
            {/* Corpo “caixote” simplificado */}
            {/* tampo / base / laterais / fundo… (como na Rack) */}

            {/* Exemplo: tampo */}
            <Box
                args={[x, panelT, z]}
                position={[0, bodyYpos + bodyY / 2 - panelT / 2, 0]}
                castShadow
                receiveShadow
            >
                {WhiteToon}
                <Edges color={EdgeColor} />
            </Box>

            {/* Pés (cilíndricos) */}
            {cornerPositions(x, z, insetX, insetZ, legH / 2).map((p, i) => (
                <Cylinder key={i} args={[legR, legR, legH, 5]} position={p} castShadow>
                    {SteelToon}
                </Cylinder>
            ))}
        </group>
    );
}
