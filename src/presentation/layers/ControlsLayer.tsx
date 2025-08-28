import React, { useEffect, useState } from "react";
import type { JSX } from "react";
import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { application } from "@/applicationInstance";
import type { CameraMode } from "@core/types/camera";

/**
 * ControlsLayer: integra OrbitControls do Drei com o CameraSystem/EventBus.
 * - Habilita/Desabilita conforme CameraSystem.toggleControls
 * - Ajusta comportamento por modo (persp pode rotacionar; ortho foca em pan/zoom)
 * - Emite cameraUpdated a cada mudança
 */
export function ControlsLayer(): JSX.Element {
    const eventBus = application.resolve("eventBus");
    const cameraSystem = application.resolve("cameraSystem");
    const { camera } = useThree();
    const [mode, setMode] = useState<CameraMode>(() => cameraSystem.getMode());
    const [enabled, setEnabled] = useState<boolean>(() => cameraSystem.isControlsEnabled());

    useEffect(() => {
        const u1 = eventBus.on("cameraModeChanged", ({ mode }: { mode: CameraMode }) =>
            setMode(mode),
        );
        const u2 = eventBus.on("cameraControlsToggled", ({ enabled }: { enabled: boolean }) =>
            setEnabled(enabled),
        );
        return (): void => {
            u1();
            u2();
        };
    }, [eventBus]);

    return (
        <OrbitControls
            makeDefault
            enabled={enabled}
            enableRotate={mode === "persp"}
            enablePan
            enableZoom
            screenSpacePanning={false}
            onChange={() => eventBus.emit("cameraUpdated", { camera })}
        />
    );
}
