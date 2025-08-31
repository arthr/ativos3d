import type { Camera } from "@react-three/fiber";
import type { EventBus } from "../../events/EventBus";
import type { CameraMode, CameraGesture } from "./CameraTypes";

/**
 * Dimensões do canvas utilizadas para o sistema de câmera
 */
export interface CameraDimensions {
    width: number;
    height: number;
}

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
    createCamera?: (mode: CameraMode, size: CameraDimensions) => Camera;

    /**
     * Dimensões do canvas para calculo da câmera
     */
    canvasSize?: CameraDimensions;
}

/**
 * Provedor de câmera ativa
 */
export interface CameraSystemProvider {
    /**
     * Retorna a câmera ativa
     */
    getCamera(): Camera;

    /**
     * Retorna o modo da câmera ativa
     */
    getMode(): CameraMode;

    /**
     * Define o modo da câmera
     */
    setMode(mode: CameraMode): void;

    /**
     * Retorna os gestos habilitados
     */
    getGestures(): Set<CameraGesture>;

    /**
     * Inicia um gesto de câmera
     */
    startGesture(gesture: CameraGesture): void;

    /**
     * Finaliza um gesto de câmera
     */
    endGesture(gesture: CameraGesture): void;

    /**
     * Verifica se um gesto de câmera está ativo
     */
    isGestureActive(gesture: CameraGesture): boolean;

    /**
     * Define se os controles estão habilitados
     */
    toggleControls(): void;

    /**
     * Verifica se os controles estão habilitados
     */
    isControlsEnabled(): boolean;

    /**
     * Injeta uma câmera externa (ex.: R3F) para uso no modo UI.
     */
    setExternalCamera(camera: Camera): void;
}
