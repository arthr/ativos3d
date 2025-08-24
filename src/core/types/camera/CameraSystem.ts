import type { Camera } from "three";
import type { CameraMode, CameraGesture } from "./CameraTypes";

/**
 * Dependências do CameraSystem
 */
export interface CameraSystemDependencies {
    /**
     * EventBus para emissão de eventos de câmera
     */
    eventBus: CameraEventEmitter;

    /**
     * Função opcional para criação de câmera
     */
    createCamera?: (mode: CameraMode) => Camera;
}

/**
 * Emissor de eventos de câmera
 */
export interface CameraEventEmitter {
    emit(event: "cameraModeChanged", payload: { mode: CameraMode }): void;
    emit(event: "cameraGestureStarted", payload: { gesture: CameraGesture }): void;
    emit(event: "cameraGestureEnded", payload: { gesture: CameraGesture }): void;
    emit(event: "cameraControlsToggled", payload: { enabled: boolean }): void;
}
