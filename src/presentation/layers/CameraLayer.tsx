import React, { useEffect, useMemo, useRef, useState } from "react";
import type { JSX } from "react";
import { PerspectiveCamera as DreiPerspectiveCamera, OrthographicCamera as DreiOrthographicCamera } from "@react-three/drei";
import { application } from "@/applicationInstance";
import type { CameraMode } from "@core/types/camera";
import type { PerspectiveCamera, OrthographicCamera, Camera } from "three";

/**
 * CameraLayer: alterna entre câmeras persp/ortho do Drei conforme o CameraSystem.
 * Mantém o CameraSystem sincronizado com a câmera ativa do R3F via setExternalCamera.
 */
export function CameraLayer(): JSX.Element {
    const eventBus = application.resolve("eventBus");
    const cameraSystem = application.resolve("cameraSystem");
    const perspRef = useRef<PerspectiveCamera | null>(null);
    const orthoRef = useRef<OrthographicCamera | null>(null);
    const [mode, setMode] = useState<CameraMode>(() => cameraSystem.getMode());

    useEffect(() => {
        const off = eventBus.on("cameraModeChanged", ({ mode }: { mode: CameraMode }) => setMode(mode));
        return off;
    }, [eventBus]);

    useEffect(() => {
        // Atualiza a câmera externa do sistema após renderizar a câmera apropriada
        const cam = (mode === "persp" ? perspRef.current : orthoRef.current) as Camera | null;
        if (cam) {
            cameraSystem.setExternalCamera(cam);
        }
    }, [mode, cameraSystem]);

    // Valores padrão simples para câmera; podem ser futuramente configuráveis
    const perspProps = useMemo(() => ({ position: [6, 6, 6] as [number, number, number], fov: 65 }), []);
    const orthoProps = useMemo(
        () => ({ position: [10, 10, 10] as [number, number, number], zoom: 60 }),
        [],
    );

    return mode === "persp" ? (
        <DreiPerspectiveCamera ref={perspRef} makeDefault {...perspProps} />
    ) : (
        <DreiOrthographicCamera ref={orthoRef} makeDefault {...orthoProps} />
    );
}
