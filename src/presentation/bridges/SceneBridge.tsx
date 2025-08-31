import type { JSX } from "react";
import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { useApplication } from "../hooks/useApplication";

/**
 * Bridge que conecta câmera/cena do R3F ao ecossistema da aplicação (EventBus/CameraSystem).
 */
export function SceneBridge(): JSX.Element {
    const { camera, scene } = useThree();
    const { eventBus, cameraSystem } = useApplication();
    useEffect(() => {
        cameraSystem.setExternalCamera(camera);
        eventBus.emit("sceneStateChanged", { action: "created", sceneId: "r3f-scene" });
        // Nenhum cleanup necessário aqui
    }, [camera, scene, eventBus, cameraSystem]);
    return <></>;
}
