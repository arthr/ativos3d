import type {
    CameraControllerProvider,
    CameraControllerDependencies,
    CameraControllerConfig,
    CameraMode,
    CameraGesture,
} from "@core/types/camera";
import type { CameraSystemProvider } from "@core/types/camera";
import type { Unsubscribe } from "@core/types/Events";
import type { EventBus } from "@core/events/EventBus";
import type { Vec3 } from "@core/geometry";
import type { Camera } from "@react-three/fiber";
import type { OrthographicCamera, PerspectiveCamera } from "three";

/**
 * Controlador básico de câmera
 */
export class CameraController implements CameraControllerProvider {
    private readonly dependencies: CameraControllerDependencies;
    private readonly config: CameraControllerConfig;
    private readonly cameraSystem: CameraSystemProvider;
    private readonly eventBus: EventBus;

    private camera: Camera;
    private controlsEnabled: boolean;
    private unsubscribeModeChanged: Unsubscribe;
    private unsubscribeControlsToggled: Unsubscribe;

    constructor(dependencies: CameraControllerDependencies, config?: CameraControllerConfig) {
        this.dependencies = dependencies;
        this.cameraSystem = this.dependencies.cameraSystem;
        this.eventBus = this.dependencies.eventBus;
        this.camera = this.cameraSystem.getCamera();
        this.controlsEnabled = this.cameraSystem.isControlsEnabled();
        this.unsubscribeModeChanged = this.eventBus.on(
            "cameraModeChanged",
            this.handleCameraModeChanged,
        );
        this.unsubscribeControlsToggled = this.eventBus.on(
            "cameraControlsToggled",
            this.handleCameraControlsToggled,
        );

        this.config = {
            gestures: ["pan", "rotate", "zoom"],
            maxDistance: this.camera.far,
            minDistance: this.camera.near + 0.01,
            ...config,
        };
    }

    /**
     * Mover a câmera
     */
    pan(delta: Vec3): void {
        if (!this.canDoGesture("pan")) return;
        if (!delta.x && !delta.y && !delta.z) return;

        this.camera.position.x += delta.x;
        this.camera.position.y += delta.y;
        this.camera.position.z += delta.z;

        this.update();
    }

    /**
     * Rotacionar a câmera
     */
    rotate(delta: Vec3): void {
        if (!this.canDoGesture("rotate")) return;
        if (!delta.x && !delta.y && !delta.z) return;

        this.camera.rotation.x += delta.x;
        this.camera.rotation.y += delta.y;
        this.camera.rotation.z += delta.z;

        this.update();
    }

    /**
     * Aproxima ou afasta a câmera
     */
    zoom(delta: number): void {
        if (!this.canDoGesture("zoom")) return;
        if (delta === 0) return;

        if (this.cameraSystem.getMode() === "ortho") {
            const camera = this.camera as OrthographicCamera;
            camera.zoom += delta;
            camera.zoom = Math.max(0.1, camera.zoom); // Previne zoom negativo
            camera.updateProjectionMatrix();
            this.update();
            return;
        }

        const camera = this.camera as PerspectiveCamera;
        const minDistance = this.config.minDistance ?? camera.near + 0.01;
        const maxDistance = this.config.maxDistance ?? Infinity;
        const newDistance = this.camera.position.z + delta;
        if (newDistance < minDistance || newDistance > maxDistance) return;
        this.camera.position.z = newDistance;

        this.update();
    }

    /**
     * Remove listeners do controlador
     */
    dispose(): void {
        this.unsubscribeModeChanged();
        this.unsubscribeControlsToggled();
    }

    /**
     * Reemite o evento de atualização quando o modo da câmera é alterado
     */
    private handleCameraModeChanged = ({ camera }: { mode: CameraMode; camera: Camera }): void => {
        this.camera = camera;
        this.eventBus.emit("cameraUpdated", {
            camera,
        });
    };

    /**
     * Atualiza o estado dos controles da câmera
     */
    private handleCameraControlsToggled = ({ enabled }: { enabled: boolean }): void => {
        this.controlsEnabled = enabled;
    };

    /**
     * Envia um evento de atualização da câmera
     */
    private update(): void {
        this.eventBus.emit("cameraUpdated", {
            camera: this.camera,
        });
    }

    /**
     * Verifica se pode executar um gesto
     */
    private canDoGesture(gesture: CameraGesture): boolean {
        if (!this.controlsEnabled) return false;
        if (this.config.gestures && !this.config.gestures.includes(gesture)) return false;
        if (gesture === "rotate" && this.cameraSystem.getMode() !== "persp") return false;
        return true;
    }
}
