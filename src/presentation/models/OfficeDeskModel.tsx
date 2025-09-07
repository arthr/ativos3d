import type { JSX } from "react";
import { RoundedBox, Box, Edges } from "@react-three/drei";
import { aabbFromDims } from "./_utils";
import { WhiteToon, EdgeColor } from "./_materials";

export type ModelProps = JSX.IntrinsicElements["group"];

// Dimensões externas (L x H x P)
export const DESK_DIMS = { x: 2.0, y: 0.75, z: 0.8 };
export const DESK_AABB = aabbFromDims(DESK_DIMS.x, DESK_DIMS.y, DESK_DIMS.z);

export default function OfficeDeskModel(props: ModelProps): JSX.Element {
    const { x, y: totalH, z } = DESK_DIMS;

    const topT = 0.05; // espessura tampo
    const legH = totalH - topT;
    const legSize = 0.08; // seção quadrada
    const insetX = 0.1; // afastamento das bordas
    const insetZ = 0.08;
    const radius = 0.02; // leve arredondado no tampo

    const topY = legH + topT / 2;
    const hx = x / 2 - insetX;
    const hz = z / 2 - insetZ;

    return (
        <group {...props}>
            {/* Pés (brancos) */}
            {[
                [-hx, legH / 2, -hz],
                [hx, legH / 2, -hz],
                [hx, legH / 2, hz],
                [-hx, legH / 2, hz],
            ].map((p, i) => (
                <Box
                    key={i}
                    args={[legSize, legH, legSize]}
                    position={p as [number, number, number]}
                    castShadow
                >
                    {WhiteToon}
                    <Edges color={EdgeColor} />
                </Box>
            ))}

            {/* Tampo (preto/gráfico) */}
            <RoundedBox
                args={[x, topT, z]}
                radius={radius}
                position={[0, topY, 0]}
                castShadow
                receiveShadow
            >
                <meshToonMaterial color="#222" />
                <Edges color="#444" />
            </RoundedBox>
        </group>
    );
}
