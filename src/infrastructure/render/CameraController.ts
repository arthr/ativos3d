import type {
    CameraControllerProvider,
    CameraControllerDependencies,
    CameraControllerConfig,
    CameraMode,
} from "@core/types/camera";
import type { CameraSystemProvider } from "@core/types/camera";
import type { EventBus } from "@core/events/EventBus";
import type { Vec3 } from "@core/geometry";
import type { Camera } from "@react-three/fiber";

/**
 * Controlador básico de câmera
 */
export class CameraController implements CameraControllerProvider {
    private readonly dependencies: CameraControllerDependencies;
    private readonly config: CameraControllerConfig;
    private readonly cameraSystem: CameraSystemProvider;
    private readonly eventBus: EventBus;

    constructor(dependencies: CameraControllerDependencies, config?: CameraControllerConfig) {
        this.dependencies = dependencies;
        this.config = config ?? {};
        this.cameraSystem = this.dependencies.cameraSystem;
        this.eventBus = this.dependencies.eventBus;
        this.eventBus.on("cameraModeChanged", this.handleCameraModeChanged);
    }

    /**
     * Mover a câmera
     */
    pan(delta: Vec3): void {
        if (!delta.x && !delta.y && !delta.z) return;

        this.cameraSystem.getCamera().position.x += delta.x;
        this.cameraSystem.getCamera().position.y += delta.y;
        this.cameraSystem.getCamera().position.z += delta.z;

        this.update();
    }

    /**
     * Rotacionar a câmera
     */
    rotate(delta: Vec3): void {
        if (!delta.x && !delta.y && !delta.z) return;

        this.cameraSystem.getCamera().rotation.x += delta.x;
        this.cameraSystem.getCamera().rotation.y += delta.y;
        this.cameraSystem.getCamera().rotation.z += delta.z;

        this.update();
    }

    /**
     * Aproxima ou afasta a câmera
     */
    zoom(delta: number): void {
        if (delta === 0) return;

        this.cameraSystem.getCamera().position.z += delta;

        this.update();
    }

    /**
     * Remove listeners do controlador
     */
    dispose(): void {
        this.eventBus.off("cameraModeChanged", this.handleCameraModeChanged);
    }

    /**
     * Reemite o evento de atualização quando o modo da câmera é alterado
     */
    private handleCameraModeChanged = ({ camera }: { mode: CameraMode; camera: Camera }): void => {
        this.eventBus.emit("cameraUpdated", {
            camera,
        });
    };

    /**
     * Envia um evento de atualização da câmera
     */
    private update(): void {
        this.eventBus.emit("cameraUpdated", {
            camera: this.cameraSystem.getCamera(),
        });
    }
}
