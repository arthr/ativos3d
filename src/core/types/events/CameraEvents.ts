import type { CameraMode, CameraGesture } from "../camera";

/**
 * Eventos de câmera
 */
export interface CameraEvents {
    cameraModeChanged: { mode: CameraMode };
    cameraGestureStarted: { gesture: CameraGesture };
    cameraGestureEnded: { gesture: CameraGesture };
    cameraControlsToggled: { enabled: boolean };
}
