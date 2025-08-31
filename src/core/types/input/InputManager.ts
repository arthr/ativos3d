import type { EventBus } from "../../events/EventBus";
import type { CameraSystemProvider } from "../camera/CameraSystem";

/**
 * Dependências do InputManager
 */
export interface InputManagerDependencies {
    /**
     * EventBus para publicação de eventos de input
     */
    readonly eventBus: EventBus;
    /**
     * Provedor do sistema de câmera
     */
    readonly cameraSystem: CameraSystemProvider;
    /**
     * Elemento alvo para escutar eventos
     */
    readonly target: HTMLElement | Window;
}

/**
 * Provedor do InputManager
 */
export interface InputManagerProvider {
    /** Remove todos os listeners registrados */
    dispose(): void;
}
