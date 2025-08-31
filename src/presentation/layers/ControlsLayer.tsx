import type { JSX } from "react";
import type { CameraMode, CameraGesture } from "@core/types/camera";
import { useEffect, useState } from "react";
import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useApplication } from "../hooks/useApplication";

/**
 * ControlsLayer: integra OrbitControls do Drei com o CameraSystem/EventBus.
 * - Habilita/Desabilita conforme CameraSystem.setControlsEnabled
 * - Ajusta comportamento por modo (persp pode rotacionar; ortho foca em pan/zoom)
 * - Emite cameraUpdated a cada mudança
 */
export function ControlsLayer(): JSX.Element {
    const { eventBus, cameraSystem } = useApplication();
    const { camera } = useThree();
    const [mode, setMode] = useState<CameraMode>(() => cameraSystem.getMode());
    const [enabled, setEnabled] = useState<boolean>(() => cameraSystem.isControlsEnabled());
    const [gestures, setGestures] = useState<ReadonlySet<CameraGesture>>(() =>
        cameraSystem.getGestures(),
    );

    useEffect(() => {
        const u1 = eventBus.on("cameraModeChanged", ({ mode }: { mode: CameraMode }) =>
            setMode(mode),
        );
        const u2 = eventBus.on("cameraControlsToggled", ({ enabled }: { enabled: boolean }) =>
            setEnabled(enabled),
        );
        const u3 = eventBus.on("cameraGestureStarted", () => {
            setGestures(cameraSystem.getGestures());
        });
        const u4 = eventBus.on("cameraGestureEnded", () => {
            setGestures(cameraSystem.getGestures());
        });

        return (): void => {
            u1();
            u2();
            u3();
            u4();
        };
    }, [eventBus, cameraSystem]);

    return (
        <OrbitControls
            makeDefault
            enabled={enabled}
            enableRotate={mode === "persp" && gestures.has("rotate")}
            enablePan={gestures.has("pan")}
            enableZoom={gestures.has("zoom")}
            screenSpacePanning={false}
            onChange={() => eventBus.emit("cameraUpdated", { camera })}
        />
    );
}
