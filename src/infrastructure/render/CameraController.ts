import type {
    CameraControllerProvider,
    CameraControllerDependencies,
    CameraControllerConfig,
    CameraMode,
    CameraGesture,
} from "@core/types/camera";
import type { CameraSystemProvider } from "@core/types/camera";
import type { EventBus } from "@core/events/EventBus";
import type { Vec3 } from "@core/geometry";
import type { Camera } from "@react-three/fiber";
import { OrthographicCamera } from "three";

/**
 * Controlador básico de câmera
 */
export class CameraController implements CameraControllerProvider {
    private readonly dependencies: CameraControllerDependencies;
    private readonly config: CameraControllerConfig;
    private readonly cameraSystem: CameraSystemProvider;
    private readonly eventBus: EventBus;

    private readonly camera: Camera;

    constructor(dependencies: CameraControllerDependencies, config?: CameraControllerConfig) {
        this.dependencies = dependencies;
        this.config = config ?? {
            gestures: ["pan", "rotate", "zoom"],
        };
        this.cameraSystem = this.dependencies.cameraSystem;
        this.eventBus = this.dependencies.eventBus;
        this.eventBus.on("cameraModeChanged", this.handleCameraModeChanged);

        this.camera = this.cameraSystem.getCamera();
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
            camera.updateProjectionMatrix();
        } else {
            this.camera.position.z += delta;
        }

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
            camera: this.camera,
        });
    }

    /**
     * Verifica se pode executar um gesto
     */
    private canDoGesture(gesture: CameraGesture): boolean {
        if (!this.config.controlsEnabled) return false;
        if (this.config.gestures && !this.config.gestures.includes(gesture)) return false;
        return true;
    }
}
