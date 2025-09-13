import type { JSX } from "react";
import { Box, Edges } from "@react-three/drei";
import { aabbFromDims } from "./_utils";
import { WhiteToon, EdgeColor } from "./_materials";

export type ModelProps = JSX.IntrinsicElements["group"];

// Dimensões externas (L x H x P)
export const DESK_DIMS = { x: 2.0, y: 0.75, z: 0.8 };
export const DESK_AABB = aabbFromDims(DESK_DIMS.x, DESK_DIMS.y, DESK_DIMS.z);

type SideSpec = {
    key: "front" | "back" | "left" | "right";
    // normal: eixo ortogonal onde a saia é posicionada; length é no eixo oposto
    normal: "x" | "z";
    sign: -1 | 1; // -1 lado negativo do eixo, 1 lado positivo
};

const SIDES: SideSpec[] = [
    { key: "front", normal: "z", sign: -1 },
    { key: "back", normal: "z", sign: 1 },
    { key: "left", normal: "x", sign: -1 },
    { key: "right", normal: "x", sign: 1 },
];

export default function OfficeDeskModel(props: ModelProps): JSX.Element {
    const { x, y: totalH, z } = DESK_DIMS;

    const topT = 0.05; // esp. tampo
    const legH = totalH - topT;
    const legSize = 0.04; // seção pé (quadrado)

    // saias
    const skirtH = legH / 2; // altura (vertical)
    const skirtFrontH = skirtH / 3; // altura da saia da frente
    const skirtT = 0.04; // espessura (profundidade da saia)
    const gapTop = 0; // opcional: folga entre topo da saia e tampo

    // afastamento dos pés das bordas do tampo
    const insetX = 0.04;
    const insetZ = 0.04;

    // Y do tampo
    const topY = legH + topT / 2;

    // Meias-extensões úteis (centros dos pés)
    const hx = x / 2 - insetX;
    const hz = z / 2 - insetZ;

    // Comprimentos livres entre faces internas dos pés
    const skirtLenX = Math.max(0.01, 2 * (hx - legSize / 2)); // frente/trás (alongam no X)
    const skirtLenZ = Math.max(0.01, 2 * (hz - legSize / 2)); // laterais (alongam no Z)

    // Helpers genéricos baseados em sinal e eixo normal
    const posAlong = (normal: "x" | "z", sign: -1 | 1, type: "inner" | "aside"): number => {
        if (normal === "z") {
            const inner = sign * (hz - legSize / 2);
            const aside = sign * (hz + legSize / 2);
            return type === "inner" ? inner - sign * (skirtT / 2) : aside - sign * (skirtT / 2); // z
        } else {
            const inner = sign * (hx - legSize / 2);
            const aside = sign * (hx + legSize / 2);
            return type === "inner" ? inner - sign * (skirtT / 2) : aside - sign * (skirtT / 2); // x
        }
    };

    return (
        <group {...props}>
            {/* Saias */}
            {SIDES.map(({ key, normal, sign }) => {
                const alongX = normal === "z"; // frente/trás alongam no X
                // Altura (centro) das saias
                const skirtY =
                    key === "front" ? legH - skirtFrontH / 2 - gapTop : legH - skirtH / 2 - gapTop;
                const height = key === "front" ? skirtFrontH : skirtH;
                const args: [number, number, number] = alongX
                    ? [skirtLenX, height, skirtT]
                    : [skirtT, height, skirtLenZ];

                const px = normal === "x" ? posAlong("x", sign, "aside") : 0;
                const pz = normal === "z" ? posAlong("z", sign, "aside") : 0;

                return (
                    <Box key={key} args={args} position={[px, skirtY, pz]} castShadow>
                        {WhiteToon}
                        <Edges color={EdgeColor} />
                    </Box>
                );
            })}

            {/* Pés */}
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

            {/* Tampo */}
            <Box args={[x, topT, z]} position={[0, topY, 0]} castShadow receiveShadow>
                <meshToonMaterial color="#222" />
                <Edges color="#444" />
            </Box>
        </group>
    );
}
