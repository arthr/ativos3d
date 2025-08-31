import type { JSX } from "react";
import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { application } from "@/applicationInstance";

/**
 * Bridge que conecta câmera/cena do R3F ao ecossistema da aplicação (EventBus/CameraSystem).
 */
export function SceneBridge(): JSX.Element {
    const { camera, scene } = useThree();
    useEffect(() => {
        const eventBus = application.resolve("eventBus");
        const cameraSystem = application.resolve("cameraSystem");
        cameraSystem.setExternalCamera(camera);
        eventBus.emit("sceneStateChanged", { action: "loaded", sceneId: "r3f-scene" });
        // Nenhum cleanup necessário aqui
    }, [camera, scene]);
    return <></>;
}
