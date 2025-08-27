import React from "react";
import type { JSX } from "react";
import { Canvas } from "@react-three/fiber";
import { DeveloperPanel } from "./panels/DeveloperPanel";

/**
 * Componente raiz da interface do Ativos3D.
 */
export function App(): JSX.Element {
    const showDebug = new URLSearchParams(window.location.search).has("debug");
    return (
        <>
            <Canvas>
                <ambientLight />
                <mesh>
                    <boxGeometry />
                    <meshBasicMaterial color="orange" />
                </mesh>
            </Canvas>
            {showDebug && <DeveloperPanel />}
        </>
    );
}

