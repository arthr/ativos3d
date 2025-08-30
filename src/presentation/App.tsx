import { useEffect, useMemo, useState, type JSX } from "react";
import { Canvas } from "@react-three/fiber";
import { GridLayer } from "@presentation/layers/GridLayer";
import { RenderLoopProvider } from "@presentation/providers/RenderLoopProvider";
import { SceneBridge } from "@presentation/bridges/SceneBridge";
import { CameraLayer } from "@presentation/layers/CameraLayer";
import { ControlsLayer } from "@presentation/layers/ControlsLayer";
import { ObjectsLayer } from "@presentation/layers/ObjectsLayer";
import { WallsLayer } from "@presentation/layers/WallsLayer";
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
            // Se não houver valor persistido, usa `showDebug` como padrão inicial
            return raw ? Boolean(JSON.parse(raw)) : showDebug;
        } catch {
            return showDebug;
        }
    }, [showDebug]);
    const [showGizmo, setShowGizmo] = useState<boolean>(initialGizmo);
    // Grid config (persisted defaults)
    const initialGridFollow = useMemo(() => {
        try {
            const raw = globalThis.localStorage.getItem("devpanel:grid:followCamera");
            return raw ? Boolean(JSON.parse(raw)) : false;
        } catch {
            return false;
        }
    }, []);
    const initialGridInfinite = useMemo(() => {
        try {
            const raw = globalThis.localStorage.getItem("devpanel:grid:infiniteGrid");
            return raw ? Boolean(JSON.parse(raw)) : true;
        } catch {
            return true;
        }
    }, []);
    const [gridFollowCamera, setGridFollowCamera] = useState<boolean>(initialGridFollow);
    const [gridInfiniteGrid, setGridInfiniteGrid] = useState<boolean>(initialGridInfinite);

    useEffect(() => {
        const off1 = eventBus.on("gizmoVisibilityChanged", ({ show }: { show: boolean }) =>
            setShowGizmo(show),
        );
        const off2 = eventBus.on(
            "gridConfigChanged",
            ({
                followCamera,
                infiniteGrid,
            }: {
                followCamera?: boolean;
                infiniteGrid?: boolean;
            }) => {
                if (typeof followCamera === "boolean") setGridFollowCamera(followCamera);
                if (typeof infiniteGrid === "boolean") setGridInfiniteGrid(infiniteGrid);
            },
        );
        return (): void => {
            off1();
            off2();
        };
    }, [eventBus]);
    return (
        <>
            <Canvas className="block" style={{ width: "100vw", height: "100vh" }}>
                <RenderLoopProvider />
                <SceneBridge />
                <CameraLayer />
                <ControlsLayer />
                <GizmoLayer show={showGizmo} />
                <GridLayer
                    config={{ followCamera: gridFollowCamera, infiniteGrid: gridInfiniteGrid }}
                />
                <ambientLight />
                <WallsLayer />
                <ObjectsLayer />
            </Canvas>
            {showDebug && <DeveloperPanel />}
        </>
    );
}
