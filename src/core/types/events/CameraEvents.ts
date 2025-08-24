import type { Camera } from "@react-three/fiber";
import type { CameraMode, CameraGesture } from "../camera/CameraTypes";

/**
 * Eventos de câmera
 */
export interface CameraEvents {
    cameraModeChanged: { mode: CameraMode; camera: Camera };
    cameraGestureStarted: { gesture: CameraGesture };
    cameraGestureEnded: { gesture: CameraGesture };
    cameraControlsToggled: { enabled: boolean };
    cameraUpdated: { camera: Camera };
}
