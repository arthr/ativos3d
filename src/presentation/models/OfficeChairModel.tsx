import type { JSX } from "react";
import { Box, Cylinder, Edges, RoundedBox, Tube } from "@react-three/drei";
import { aabbFromDims } from "./_utils";
import { EdgeColor } from "./_materials";
import { CatmullRomCurve3, Vector3 } from "three";

export type ModelProps = JSX.IntrinsicElements["group"];

// Envelope externo para navegação/seleção
export const CHAIR_DIMS = { x: 0.8, y: 1.4, z: 0.6 }; // Aumentada largura X para acomodar braços
export const CHAIR_AABB = aabbFromDims(CHAIR_DIMS.x, CHAIR_DIMS.y, CHAIR_DIMS.z);

export default function OfficeChairModel(props: ModelProps): JSX.Element {
    // ---- Config do Assento ----
    // Baseado nas proporções do SofaModel mas ajustado para uma pessoa (sofá tem 1.2 por pessoa)
    const seatW = 0.5; // largura do assento (proporcional para 1 pessoa)
    const seatD = 0.5; // profundidade do assento (confortável para 1 pessoa)
    const seatH = 0.1; // altura/espessura do assento (mais fino que o sofá)
    const seatY = 0.7; // altura do assento

    // ---- Config do Encosto ----
    const backrestW = 0.45; // largura do encosto
    const backrestPartH = 0.15; // altura de cada parte
    const backrestT = 0.08; // espessura do encosto
    const backrestGap = 0.05; // espaço entre as partes
    const backrestY = 1.05; // altura base do encosto
    const backrestZ = -0.3; // posição Z (atrás do assento)

    // ---- Config do Encosto da Cabeça ----
    const headrestW = backrestW / 2; // metade da largura do encosto principal
    const headrestH = 0.12; // altura do encosto da cabeça
    const headrestT = backrestT; // mesma espessura do encosto principal
    const headrestGap = 0.15; // espaço entre encosto superior e encosto da cabeça
    const headrestY = backrestY + backrestPartH + backrestGap + headrestGap + headrestH / 2; // posição Y do encosto da cabeça

    // ---- Config dos Conectores ----
    const connectorR = 0.008; // raio dos cilindros conectores
    const connectorH = backrestGap + 0.02; // altura dos conectores (preenche o gap)
    const connectorOffsetX = 0.15; // distância do centro nas laterais

    // ---- Config do Conector do Encosto da Cabeça ----
    const headrestConnectorR = 0.012; // raio do conector central (mais grosso)
    const headrestConnectorH = headrestGap; // altura do conector (preenche o gap)

    // ---- Config dos Braços ----
    const armrestW = 0.35; // largura do braço (comprimento)
    const armrestD = 0.08; // profundidade do braço (largura)
    const armrestH = 0.04; // altura/espessura do braço
    const armrestY = seatY + seatH / 2 + 0.15; // altura dos braços (acima do assento)
    const armrestOffsetX = seatW / 2 + armrestD / 2; // distância do centro (lateral do assento)
    const armrestZ = 0.05; // posição Z (ligeiramente à frente do centro do assento)
    const armrestRotationY = -Math.PI * 0.5; // ~90° rotação para frente

    // ---- Config dos Suportes dos Braços ----
    const armSupportR = 0.015; // raio dos suportes metálicos
    const armSupportH = armrestY - seatY - seatH / 2; // altura dos suportes (do assento até o braço)

    // ---- Config do Conector Central (Tubo Curvo) ----
    const centralConnectorR = 0.03; // raio do tubo central
    const centralConnectorSegments = 10; // segmentos para suavidade da curva

    // ---- Config dos Pés Raiados ----
    const N_FEET = 5; // número de pés
    const footLength = 0.4; // comprimento de cada pé
    const footR = 0.02; // raio dos pés
    const footH = 0.04; // altura dos pés (cilindros deitados)

    // ---- Config das Rodas ----
    const wheelR = 0.03; // raio das rodas
    const wheelH = 0.03; // altura/espessura das rodas
    const wheelElevation = wheelR + 0.03; // elevação da base (raio da roda)

    // ---- Config da Coluna Central ----
    const columnR = 0.04; // raio da coluna central
    const columnH = seatY - seatH / 2 - wheelElevation; // altura da coluna (das rodas até a base do assento)
    const columnY = columnH / 2 + wheelElevation; // posição Y do centro da coluna (elevada pelas rodas)

    // ---- Materiais Customizados ----
    const OrangeToon: JSX.Element = <meshToonMaterial color="#e6531d" />;
    const MetalToon: JSX.Element = <meshToonMaterial color="#b9c0c5" />;
    const WheelToon: JSX.Element = <meshToonMaterial color="black" />;

    // ---- Helpers ----
    const sides: (-1 | 1)[] = [-1, 1]; // -1 = esquerdo, 1 = direito
    const feetAngles = [...Array(N_FEET)].map((_, i) => (i * 2 * Math.PI) / N_FEET); // ângulos dos pés raiados

    // Curva para o conector central (do assento até a base do encosto)
    // Usando apenas 3 pontos para evitar curva em S - início, meio suave, fim
    const centralConnectorCurve = new CatmullRomCurve3([
        new Vector3(0, seatY - seatH / 2 + 0.05, -seatD / 2 + 0.03), // início: topo traseiro do assento
        new Vector3(
            0,
            (seatY + backrestY - backrestPartH) / 2 - 0.06,
            (-seatD / 2 + backrestZ) / 2 - 0.03,
        ), // ponto médio suave
        new Vector3(0, backrestY - backrestPartH, backrestZ - 0.08), // fim: base do encosto inferior
    ]);

    // Posições e rotações das partes do encosto (relativas ao grupo do encosto)
    // Cada parte tem altura backrestPartH, com gap backrestGap entre elas
    const backrestPositions = [
        {
            y: backrestPartH + backrestGap,
            label: "superior",
            rotationX: -Math.PI * 0.01, // ~1° inclinação para trás (quase vertical)
            offsetZ: -0.14, // pequeno ajuste Z devido à rotação
        },
        {
            y: 0,
            label: "média",
            rotationX: -Math.PI * 0.05, // ~10° inclinação intermediária
            offsetZ: -0.12, // ajuste Z devido à rotação
        },
        {
            y: -(backrestPartH + backrestGap),
            label: "inferior",
            rotationX: -Math.PI * 0.15, // ~15° inclinação para frente
            offsetZ: -0.06, // maior ajuste Z devido à maior rotação
        },
    ];

    // Posições e rotações dos conectores (ajustadas para as partes rotacionadas)
    const connectorPositions = [
        {
            y: backrestPartH / 2 + backrestGap / 2,
            z: -0.135, // posição Z intermediária entre superior (-0.14) e média (-0.12)
            rotationX: (-Math.PI * 0.01 + -Math.PI * 0.05) / 2, // média das rotações superior e média
            label: "superior-média",
        },
        {
            y: -(backrestPartH / 2 + backrestGap / 2),
            z: -0.1, // posição Z intermediária entre média (-0.12) e inferior (-0.06)
            rotationX: (-Math.PI * 0.05 + -Math.PI * 0.15) / 2, // média das rotações média e inferior
            label: "média-inferior",
        },
    ];

    return (
        <group {...props}>
            {/* ========== Cadeira de Escritório ========== */}

            {/* ========== COLUNA CENTRAL ========== */}
            <Cylinder args={[columnR, columnR, columnH, 16]} position={[0, columnY, 0]} castShadow>
                {MetalToon}
            </Cylinder>

            {/* ========== PÉS RAIADOS ========== */}
            {feetAngles.map((angle, i) => {
                const x = Math.cos(angle) * (footLength / 2);
                const z = Math.sin(angle) * (footLength / 2);
                // Posição da roda (na ponta do pé)
                const wheelX = Math.cos(angle) * footLength;
                const wheelZ = Math.sin(angle) * footLength;

                return (
                    <group key={`foot-group-${i}`}>
                        {/* Pé */}
                        <Cylinder
                            args={[footR, footR, footLength, 8]}
                            position={[x, footH / 2 + wheelElevation, -z]}
                            rotation={[0, angle, Math.PI / 2]}
                            castShadow
                        >
                            {MetalToon}
                        </Cylinder>

                        {/* Roda na ponta do pé */}
                        <Cylinder
                            args={[wheelR, wheelR, wheelH, 12]}
                            position={[wheelX, wheelR, -wheelZ]}
                            rotation={[Math.PI / 2, 0, 0]}
                            castShadow
                        >
                            {WheelToon}
                        </Cylinder>
                    </group>
                );
            })}

            {/* ========== ASSENTO ========== */}
            <Box args={[seatW, seatH, seatD]} position={[0, seatY, 0]} castShadow receiveShadow>
                {OrangeToon}
                <Edges color={EdgeColor} />
            </Box>

            {/* ========== BRAÇOS ========== */}
            {sides.map((side) => (
                <group key={`armrest-group-${side > 0 ? "right" : "left"}`}>
                    {/* Braço */}
                    <RoundedBox
                        args={[armrestW, armrestH, armrestD]}
                        radius={0.01}
                        smoothness={4}
                        position={[side * armrestOffsetX, armrestY, armrestZ]}
                        rotation={[0, armrestRotationY, 0]}
                        castShadow
                    >
                        {OrangeToon}
                        <Edges color={EdgeColor} />
                    </RoundedBox>

                    {/* Suporte do Braço */}
                    <Cylinder
                        args={[armSupportR, armSupportR, armSupportH]}
                        position={[
                            side * armrestOffsetX,
                            seatY + seatH / 2 + armSupportH / 2,
                            armrestZ,
                        ]}
                        castShadow
                    >
                        {MetalToon}
                    </Cylinder>
                </group>
            ))}

            {/* ========== CONECTOR CENTRAL CURVO ========== */}
            <Tube
                args={[
                    centralConnectorCurve,
                    centralConnectorSegments,
                    centralConnectorR,
                    8,
                    false,
                ]}
                castShadow
            >
                {MetalToon}
            </Tube>

            {/* ========== ENCOSTO ========== */}
            <group position={[0, backrestY, backrestZ]}>
                {/* Partes do Encosto */}
                {backrestPositions.map((pos) => (
                    <Box
                        key={`backrest-${pos.label}`}
                        args={[backrestW, backrestPartH, backrestT]}
                        position={[0, pos.y, pos.offsetZ]}
                        rotation={[pos.rotationX, 0, 0]}
                        castShadow
                    >
                        {OrangeToon}
                        <Edges color={EdgeColor} />
                    </Box>
                ))}

                {/* Conectores Metálicos */}
                {connectorPositions.map((pos) =>
                    sides.map((side) => (
                        <Cylinder
                            key={`connector-${pos.label}-${side > 0 ? "right" : "left"}`}
                            args={[connectorR, connectorR, connectorH]}
                            position={[side * connectorOffsetX, pos.y, pos.z]}
                            rotation={[pos.rotationX, 0, 0]}
                            castShadow
                        >
                            {MetalToon}
                        </Cylinder>
                    )),
                )}

                {/* Encosto da Cabeça */}
                <Box
                    args={[headrestW, headrestH, headrestT]}
                    position={[0, headrestY - backrestY, backrestPositions[0]?.offsetZ ?? -0.14]}
                    rotation={[backrestPositions[0]?.rotationX ?? -Math.PI * 0.01, 0, 0]}
                    castShadow
                >
                    {OrangeToon}
                    <Edges color={EdgeColor} />
                </Box>

                {/* Conector Central do Encosto da Cabeça */}
                <Cylinder
                    args={[headrestConnectorR, headrestConnectorR, headrestConnectorH]}
                    position={[
                        0,
                        headrestY - backrestY - headrestH / 2 - headrestGap / 2,
                        backrestPositions[0]?.offsetZ ?? -0.14,
                    ]}
                    rotation={[backrestPositions[0]?.rotationX ?? -Math.PI * 0.01, 0, 0]}
                    castShadow
                >
                    {MetalToon}
                </Cylinder>
            </group>
        </group>
    );
}
