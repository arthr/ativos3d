import React from "react";
import type { JSX } from "react";
import { Canvas } from "@react-three/fiber";

/**
 * Componente raiz da interface do Ativos3D.
 */
export function App(): JSX.Element {
    return (
        <Canvas>
            <ambientLight />
            <mesh>
                <boxGeometry />
                <meshBasicMaterial color="orange" />
            </mesh>
        </Canvas>
    );
}
