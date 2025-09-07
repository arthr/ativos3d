import { Box, Edges, Cylinder } from "@react-three/drei";
import type { JSX } from "react";

export type ModelProps = JSX.IntrinsicElements["group"];
export const RACK_DIMS = { x: 2.6, y: 0.8, z: 0.6 }; // L x H(total) x P
export const RACK_AABB = {
    min: [-RACK_DIMS.x / 2, 0, -RACK_DIMS.z / 2],
    max: [RACK_DIMS.x / 2, RACK_DIMS.y, RACK_DIMS.z / 2],
};

export default function RackModel(props: ModelProps): JSX.Element {
    const { x, y: totalH, z } = RACK_DIMS;

    // --- pés ---
    const legHeight = 0.08;
    const legSize = 0.06;
    const insetX = 0.12;
    const insetZ = 0.1;

    // --- corpo (oco) ---
    const bodyY = totalH - legHeight; // altura do caixote
    const bodyPosY = legHeight + bodyY / 2; // sobe sobre os pés
    const panelT = 0.03; // espessura das placas externas
    const shelfT = 0.02; // espessura da prateleira
    const dividerT = 0.02; // espessura da divisória central

    const innerX = x - 2 * panelT;
    const innerY = bodyY - 2 * panelT;
    const innerZ = z - panelT; // frente aberta; fundo com 1 painel

    // posições úteis
    const hx = x / 2 - insetX;
    const hz = z / 2 - insetZ;

    // y dos planos superior/inferior do corpo
    const topY = bodyPosY + bodyY / 2 - panelT / 2;
    const bottomY = bodyPosY - bodyY / 2 + panelT / 2;

    // prateleira no meio da cavidade
    const shelfY = bodyPosY - innerY / 2 + innerY / 2; // centro do interior

    return (
        <group {...props}>
            {/* --- Placas externas para o "oco" --- */}
            {/* tampo */}
            <Box args={[x, panelT, z]} position={[0, topY, 0]} castShadow receiveShadow>
                <meshToonMaterial color="white" />
                <Edges color="whitesmoke" />
            </Box>
            {/* base */}
            <Box args={[x, panelT, z]} position={[0, bottomY, 0]} castShadow receiveShadow>
                <meshToonMaterial color="white" />
                <Edges color="whitesmoke" />
            </Box>
            {/* laterais */}
            <Box
                args={[panelT, innerY, z]}
                position={[-x / 2 + panelT / 2, bodyPosY, 0]}
                castShadow
                receiveShadow
            >
                <meshToonMaterial color="white" />
                <Edges color="whitesmoke" />
            </Box>
            <Box
                args={[panelT, innerY, z]}
                position={[x / 2 - panelT / 2, bodyPosY, 0]}
                castShadow
                receiveShadow
            >
                <meshToonMaterial color="white" />
                <Edges color="whitesmoke" />
            </Box>
            {/* fundo (frente aberta) */}
            <Box
                args={[innerX, innerY, panelT]}
                position={[0, bodyPosY, -z / 2 + panelT / 2]}
                castShadow
                receiveShadow
            >
                <meshToonMaterial color="white" />
                <Edges color="whitesmoke" />
            </Box>

            {/* --- Intersecção central: divisória vertical + prateleira --- */}
            {/* divisória vertical */}
            <Box
                args={[dividerT, innerY, innerZ - panelT]}
                position={[0, bodyPosY, -(panelT / 2)]} // alinhada com o fundo, deixa frente livre
                castShadow
                receiveShadow
            >
                <meshToonMaterial color="#f3f3f3" />
                <Edges color="whitesmoke" />
            </Box>
            {/* prateleira */}
            <Box
                args={[innerX, shelfT, innerZ - panelT]}
                position={[0, shelfY, -(panelT / 2)]}
                castShadow
                receiveShadow
            >
                <meshToonMaterial color="#f3f3f3" />
                <Edges color="whitesmoke" />
            </Box>

            {/* --- Pés (cilíndricos “flatten”) --- */}
            {[
                [-hx, legHeight / 2, -hz],
                [hx, legHeight / 2, -hz],
                [hx, legHeight / 2, hz],
                [-hx, legHeight / 2, hz],
            ].map((p, i) => (
                <Cylinder
                    key={`leg-${i}`}
                    args={[legSize, legSize, legHeight, 5]}
                    position={p as [number, number, number]}
                    castShadow
                >
                    <meshToonMaterial color="sienna" />
                </Cylinder>
            ))}
        </group>
    );
}
