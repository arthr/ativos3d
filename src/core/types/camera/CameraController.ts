import type { Camera } from "@react-three/fiber";
import type { EventBus } from "../../events/EventBus";
import type { CameraGesture } from "./CameraTypes";

/**
 * Configurações do CameraController
 */
export interface CameraControllerConfig {
    /**
     * Gestos habilitados para controle da câmera
     */
    gestures?: CameraGesture[];
}

/**
 * Dependências do CameraController
 */
export interface CameraControllerDependencies {
    /**
     * EventBus para emissão de eventos de câmera
     */
    eventBus: EventBus;

    /**
     * Câmera a ser controlada
     */
    camera: Camera;
}

/**
 * Interface para o CameraController
 */
export interface CameraController {
    /**
     * Atualizar o estado do controlador
     */
    update(): void;

    /**
     * Liberar recursos do controlador
     */
    dispose(): void;
}
