import { Box, Cylinder, Edges } from "@react-three/drei";
import type { JSX } from "react";

export type ModelProps = JSX.IntrinsicElements["group"];

// Dimensões externas da mesa
export const CT_DIMS = { x: 1.8, y: 0.4, z: 1.0 }; // largura, altura, profundidade
export const CT_AABB = {
    min: [-CT_DIMS.x / 2, 0, -CT_DIMS.z / 2],
    max: [CT_DIMS.x / 2, CT_DIMS.y, CT_DIMS.z / 2],
};

export default function CoffeeTableModel(props: ModelProps): JSX.Element {
    const { x, y: totalH, z } = CT_DIMS;

    // Partes
    const topThickness = 0.04; // tampo de vidro fino
    const legHeight = totalH - topThickness;
    const legSize = 0.03; // seção quadrada (aço)
    const insetX = 0.14; // afastamento das bordas (X)
    const insetZ = 0.12; // afastamento das bordas (Z)

    // Posições dos 4 cantos (para pés)
    const hx = x / 2 - insetX;
    const hz = z / 2 - insetZ;

    // Y do tampo
    const topY = legHeight + topThickness / 2;

    return (
        <group {...props}>
            {/* Pés de aço (estilo flatten) */}
            {[
                [-hx, legHeight / 2, -hz],
                [hx, legHeight / 2, -hz],
                [hx, legHeight / 2, hz],
                [-hx, legHeight / 2, hz],
            ].map((p, i) => (
                <Cylinder
                    key={i}
                    args={[legSize, legSize, legHeight, 10]}
                    position={p as [number, number, number]}
                    castShadow
                >
                    <meshStandardMaterial
                        color="white"
                        metalness={0.9}
                        roughness={0.45}
                        flatShading
                    />
                </Cylinder>
            ))}

            {/* Tampo de vidro */}
            <Box args={[x, topThickness, z]} position={[0, topY, 0]} castShadow receiveShadow>
                {/* “Vidro” simplificado para o look flatten */}
                <meshStandardMaterial
                    color="#baf6ff"
                    transparent
                    opacity={0.52}
                    roughness={0.1}
                    metalness={0.0}
                    flatShading
                />
                <Edges color="darkgray" opacity={1} />
            </Box>
        </group>
    );
}
