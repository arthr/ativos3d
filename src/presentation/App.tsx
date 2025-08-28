import React from "react";
import type { JSX } from "react";
import { Canvas } from "@react-three/fiber";
import { GridLayer } from "@presentation/layers/GridLayer";
import { RenderLoopProvider } from "@presentation/providers/RenderLoopProvider";
import { SceneBridge } from "@presentation/bridges/SceneBridge";
import { CameraLayer } from "@presentation/layers/CameraLayer";
import { ControlsLayer } from "@presentation/layers/ControlsLayer";
import { DeveloperPanel } from "./panels/DeveloperPanel";

/**
 * Componente raiz da interface do Ativos3D.
 */
export function App(): JSX.Element {
    const showDebug = new URLSearchParams(window.location.search).has("debug");
    return (
        <>
            <Canvas className="block" style={{ width: "100vw", height: "100vh" }}>
                <RenderLoopProvider />
                <SceneBridge />
                <CameraLayer />
                <ControlsLayer />
                <GridLayer size={50} divisions={50} />
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
