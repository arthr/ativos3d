import type { JSX } from "react";
import { RoundedBox, Box, Cylinder, Edges } from "@react-three/drei";
import { aabbFromDims } from "./_utils";

export type ModelProps = JSX.IntrinsicElements["group"];

// Dimensões externas aproximadas
export const CHAIR_DIMS = { x: 0.6, y: 1.0, z: 0.6 };
export const CHAIR_AABB = aabbFromDims(CHAIR_DIMS.x, CHAIR_DIMS.y, CHAIR_DIMS.z);

export default function OfficeChairModel(props: ModelProps): JSX.Element {
    const { x, y: totalH, z } = CHAIR_DIMS;

    // Base e rodas (flatten simplificado)
    const baseH = 0.1; // hub central
    const spokeLen = 0.36; // raio dos “pés”
    const spokeT = 0.04;
    const spokeW = 0.06;
    const wheelR = 0.03; // rodas pequenas (cilindros)
    const wheelT = 0.02;

    // Coluna central + assento/encosto
    const seatH = 0.08;
    const seatW = 0.48;
    const seatD = 0.44;
    const seatY = 0.46; // altura do assento ao piso
    const colH = seatY - baseH; // entre o hub e a base do assento
    const colR = 0.035;

    const backH = 0.5;
    const backT = 0.06;
    const backY = seatY + seatH / 2 + backH / 2 - 0.02; // encosto nasce no tampo do assento

    const armH = 0.05; // altura/espessura do apoio
    const armOffY = seatY + seatH / 2 + 0.07;
    const armLen = 0.32;
    const armT = 0.04;

    // Cores (flatten)
    const bodyColor = "#174a5a"; // azul escuro do assento/encosto
    const black = "#222";
    const grayEdge = "whitesmoke";

    return (
        <group {...props}>
            {/* Hub central */}
            <Cylinder args={[0.09, 0.09, baseH, 20]} position={[0, baseH / 2, 0]} castShadow>
                <meshToonMaterial color={black} />
            </Cylinder>

            {/* 5 raios da base */}
            {[0, 72, 144, 216, 288].map((deg, i) => {
                const a = (deg * Math.PI) / 180;
                const px = Math.cos(a) * (spokeLen / 2);
                const pz = Math.sin(a) * (spokeLen / 2);
                return (
                    <Box
                        key={`spoke-${i}`}
                        args={[spokeLen, spokeT, spokeW]}
                        position={[0, baseH / 2, 0]}
                        rotation={[0, a, 0]}
                        castShadow
                    >
                        <meshToonMaterial color={black} />
                    </Box>
                );
            })}

            {/* Rodinhas (opcional, pequenas) */}
            {[0, 72, 144, 216, 288].map((deg, i) => {
                const a = (deg * Math.PI) / 180;
                const r = spokeLen / 2;
                const px = Math.cos(a) * r;
                const pz = Math.sin(a) * r;
                return (
                    <Cylinder
                        key={`wheel-${i}`}
                        // rodas deitadas (eixo horizontal Y-rotacionado)
                        args={[wheelR, wheelR, wheelT, 16]}
                        position={[px, wheelR, pz]}
                        rotation={[0, a, Math.PI / 2]}
                        castShadow
                    >
                        <meshToonMaterial color={black} />
                    </Cylinder>
                );
            })}

            {/* Coluna central */}
            <Cylinder args={[colR, colR, colH, 16]} position={[0, baseH + colH / 2, 0]} castShadow>
                <meshToonMaterial color="#6b7c85" />
            </Cylinder>

            {/* Assento */}
            <RoundedBox
                args={[seatW, seatH, seatD]}
                radius={0.05}
                position={[0, seatY + seatH / 2, 0]}
                castShadow
            >
                <meshToonMaterial color={bodyColor} />
                <Edges color={grayEdge} />
            </RoundedBox>

            {/* Encosto */}
            <RoundedBox
                args={[seatW * 0.65, backH, backT]}
                radius={0.05}
                position={[0, backY, -seatD / 2 + backT / 2]}
                castShadow
            >
                <meshToonMaterial color={bodyColor} />
                <Edges color={grayEdge} />
            </RoundedBox>

            {/* Braços simples (pretos) */}
            {/* esquerdo */}
            <Box
                args={[armLen, armT, armT]}
                position={[-seatW / 2 + armT / 2, armOffY, 0]}
                castShadow
            >
                <meshToonMaterial color={black} />
            </Box>
            <Box
                args={[armT, armT, seatD * 0.8]}
                position={[-seatW / 2 + armT / 2, armOffY - armT / 2, 0]}
                castShadow
            >
                <meshToonMaterial color={black} />
            </Box>
            {/* direito */}
            <Box
                args={[armLen, armT, armT]}
                position={[seatW / 2 - armT / 2, armOffY, 0]}
                castShadow
            >
                <meshToonMaterial color={black} />
            </Box>
            <Box
                args={[armT, armT, seatD * 0.8]}
                position={[seatW / 2 - armT / 2, armOffY - armT / 2, 0]}
                castShadow
            >
                <meshToonMaterial color={black} />
            </Box>
        </group>
    );
}
