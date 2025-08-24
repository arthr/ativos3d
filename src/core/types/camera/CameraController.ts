import type { EventBus } from "../../events/EventBus";
import type { CameraGesture } from "./CameraTypes";
import type { CameraSystemProvider } from "./CameraSystem";
import type { Vec3 } from "@core/geometry";

/**
 * Configurações do CameraController
 */
export interface CameraControllerConfig {
    /**
     * Gestos habilitados para controle da câmera
     */
    readonly gestures?: CameraGesture[];
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
     * Sistema de câmera a ser controlado
     */
    cameraSystem: CameraSystemProvider;
}

/**
 * Interface para o CameraController
 */
export interface CameraControllerProvider {
    /**
     * Mover a câmera
     */
    pan(delta: Vec3): void;

    /**
     * Rotacionar a câmera
     */
    rotate(delta: Vec3): void;

    /**
     * Aproxima ou afasta a câmera
     */
    zoom(delta: number): void;
}
