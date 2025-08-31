import type { JSX } from "react";
import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { useApplication } from "../hooks/useApplication";

/**
 * Bridge que conecta câmera/cena do R3F ao ecossistema da aplicação (EventBus/CameraSystem).
 */
export function SceneBridge(): JSX.Element {
    // Mantemos o hook para garantir execução dentro do contexto do Canvas (R3F)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { camera: _r3fCamera, scene: _r3fScene } = useThree();
    const { eventBus } = useApplication();

    // Evita emissões duplicadas em StrictMode (dev) e em trocas de câmera do R3F.
    // Guard global ao módulo para sinalizar que já emitimos o "created" desta sessão.
    // Isto atende à diretriz de evitar eventos repetidos, mantendo mudanças mínimas.
    // Referências:
    // - README.md (R3F é o owner; Bridge publica estado)
    // - SceneTypes.ts (ação "created")
    // - SystemEvents.ts (sceneStateChanged)
    // @typescript-eslint/no-unused-vars
    useEffect(() => {
        if ((globalThis as unknown as { __a3dSceneCreatedOnce?: boolean }).__a3dSceneCreatedOnce)
            return;
        (globalThis as unknown as { __a3dSceneCreatedOnce?: boolean }).__a3dSceneCreatedOnce = true;
        eventBus.emit("sceneStateChanged", { action: "created", sceneId: "r3f-scene" });
    }, [eventBus]);

    return <></>;
}
