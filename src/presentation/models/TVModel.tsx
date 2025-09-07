import { Box, Edges } from "@react-three/drei";
import type { JSX } from "react";

export type ModelProps = JSX.IntrinsicElements["group"];
export const TV_DIMS = { x: 2.0, y: 1.2, z: 0.06 };
export const TV_AABB = { min: [-1.0, 0, -0.03], max: [1.0, 1.2, 0.03] };

export default function TVModel(props: ModelProps): JSX.Element {
    const { x, y, z } = TV_DIMS;
    return (
        <group {...props}>
            {/* Tela - apoiada no piso (se quiser usar em pé) */}
            <mesh position={[0, y / 2, 0]} castShadow>
                <boxGeometry args={[x, y, z]} />
                <meshToonMaterial color="black" />
                {/* Screen */}
                <Box position={[0, 0, z / 2 + 0.005]} args={[x - 0.1, y - 0.1, 0.01]}>
                    <meshToonMaterial color="gray" />
                </Box>
                {/* LED */}
                <Box
                    position={[x / 2 - 0.03, -y / 2 + 0.03, z / 2 + 0.005]}
                    args={[0.03, 0.03, 0.01]}
                >
                    <meshToonMaterial color="green" />
                </Box>
                <Edges color="#666" />
            </mesh>
        </group>
    );
}
