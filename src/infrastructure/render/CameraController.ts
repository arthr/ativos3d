import type {
    CameraControllerProvider,
    CameraControllerDependencies,
    CameraControllerConfig,
} from "@core/types/camera";
import type { CameraSystemProvider } from "@core/types/camera";
import type { EventBus } from "@core/events/EventBus";
import type { Vec3 } from "@core/geometry";

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
     * Envia um evento de atualização da câmera
     */
    private update(): void {
        this.eventBus.emit("cameraUpdated", {
            camera: this.cameraSystem.getCamera(),
        });
    }
}
