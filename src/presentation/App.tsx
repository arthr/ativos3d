import { useEffect, useMemo, useState, type JSX } from "react";
import { Canvas } from "@react-three/fiber";
import { GridLayer } from "@presentation/layers/GridLayer";
import { RenderLoopProvider } from "@presentation/providers/RenderLoopProvider";
import { SceneBridge } from "@presentation/bridges/SceneBridge";
import { CameraLayer } from "@presentation/layers/CameraLayer";
import { ControlsLayer } from "@presentation/layers/ControlsLayer";
import { ObjectsLayer } from "@presentation/layers/ObjectsLayer";
import { GizmoLayer } from "@presentation/layers/GizmoLayer";
import { DeveloperPanel } from "./panels/DeveloperPanel";
import { useApplication } from "@presentation/hooks/useApplication";

/**
 * Componente raiz da interface do Ativos3D.
 */
export function App(): JSX.Element {
    const showDebug = new URLSearchParams(window.location.search).has("debug");
    const { eventBus } = useApplication();
    const initialGizmo = useMemo(() => {
        try {
            const raw = globalThis.localStorage.getItem("devpanel:showGizmo");
            return raw ? Boolean(JSON.parse(raw)) : false;
        } catch {
            return false;
        }
    }, []);
    const [showGizmo, setShowGizmo] = useState<boolean>(initialGizmo);

    useEffect(() => {
        const off = eventBus.on("gizmoVisibilityChanged", ({ show }: { show: boolean }) => setShowGizmo(show));
        return off;
    }, [eventBus]);
    return (
        <>
            <Canvas className="block" style={{ width: "100vw", height: "100vh" }}>
                <RenderLoopProvider />
                <SceneBridge />
                <CameraLayer />
                <ControlsLayer />
                <GizmoLayer show={showDebug || showGizmo} />
                <GridLayer size={50} divisions={50} />
                <ambientLight />
                <ObjectsLayer />
            </Canvas>
            {showDebug && <DeveloperPanel />}
        </>
    );
}
