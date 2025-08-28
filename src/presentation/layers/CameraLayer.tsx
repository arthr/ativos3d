import React, { useEffect, useMemo, useRef, useState } from "react";
import type { JSX } from "react";
import { PerspectiveCamera as DreiPerspectiveCamera, OrthographicCamera as DreiOrthographicCamera } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { application } from "@/applicationInstance";
import type { CameraMode } from "@core/types/camera";
import type { PerspectiveCamera, OrthographicCamera, Camera } from "three";

/**
 * CameraLayer: alterna entre câmeras persp/ortho do Drei conforme o CameraSystem.
 * Mantém o CameraSystem sincronizado com a câmera ativa do R3F via setExternalCamera.
 */
export function CameraLayer({
    perspPosition = [10, 10, 10],
    perspFov = 65,
    orthoPosition = [0, 50, 0],
    orthoUnitsVisibleY = 20,
}: {
    /** Posição padrão da câmera perspectiva */
    readonly perspPosition?: [number, number, number];
    /** Campo de visão da câmera perspectiva */
    readonly perspFov?: number;
    /** Posição padrão da câmera ortográfica */
    readonly orthoPosition?: [number, number, number];
    /** Quantidade de unidades do mundo visíveis em Y (altura) para ortho */
    readonly orthoUnitsVisibleY?: number;
}): JSX.Element {
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

    // Ajuste responsivo do zoom para ortho: mostra N unidades de mundo verticalmente
    const { size } = useThree();
    const perspProps = useMemo(
        () => ({ position: perspPosition as [number, number, number], fov: perspFov }),
        [perspPosition, perspFov],
    );
    const orthoZoom = useMemo(() => (size.height > 0 ? size.height / orthoUnitsVisibleY : 60), [size.height, orthoUnitsVisibleY]);
    const orthoProps = useMemo(
        () => ({ position: orthoPosition as [number, number, number], zoom: orthoZoom, rotation: [-Math.PI / 2, 0, 0] as [number, number, number] }),
        [orthoPosition, orthoZoom],
    );

    return mode === "persp" ? (
        <DreiPerspectiveCamera ref={perspRef} makeDefault {...perspProps} />
    ) : (
        <DreiOrthographicCamera ref={orthoRef} makeDefault {...orthoProps} />
    );
}
