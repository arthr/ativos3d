import type { Camera } from "three";
import type { EventBus } from "@core/events/EventBus";
import type { CameraMode } from "./CameraTypes";

/**
 * Configurações do CameraSystem
 */
export interface CameraSystemConfig {
    /**
     * Modo da câmera
     */
    mode?: CameraMode;

    /**
     * Controles da câmera
     */
    controlsEnabled?: boolean;
}

/**
 * Dependências do CameraSystem
 */
export interface CameraSystemDependencies {
    /**
     * EventBus para emissão de eventos de câmera
     */
    eventBus: EventBus;

    /**
     * Função opcional para criação de câmera
     */
    createCamera?: (mode: CameraMode) => Camera;
}

/**
 * Provedor de câmera ativa
 */
export interface CameraSystemProvider {
    /**
     * Retorna a câmera ativa
     */
    getCamera(): Camera;
}
