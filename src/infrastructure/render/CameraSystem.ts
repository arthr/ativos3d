import type { Camera } from "@react-three/fiber";
import type { CameraMode, CameraGesture } from "@core/types/camera";
import type {
    CameraSystemConfig,
    CameraSystemDependencies,
    CameraSystemProvider,
    CameraDimensions,
} from "@core/types/camera/CameraSystem";
import type { EventBus } from "@core/events/EventBus";

import { PerspectiveCamera, OrthographicCamera } from "three";

/**
 * Sistema de gerenciamento de câmera
 */
export class CameraSystem implements CameraSystemProvider {
    private static instance: CameraSystem | null = null;
    private readonly eventBus: EventBus;
    private readonly cameraFactory: (mode: CameraMode, size: CameraDimensions) => Camera;
    private readonly gestures = new Set<CameraGesture>(["pan", "rotate", "zoom"]);
    private camera: Camera;
    private mode: CameraMode;
    private controlsEnabled: boolean;
    private readonly canvasSize: CameraDimensions;

    private constructor(config: CameraSystemConfig, deps: CameraSystemDependencies) {
        this.mode = config.mode ?? "persp";
        this.controlsEnabled = config.controlsEnabled ?? true;
        this.eventBus = deps.eventBus;
        this.canvasSize = deps.canvasSize ?? { width: 1, height: 1 };
        this.cameraFactory = deps.createCamera ?? defaultCameraFactory;
        this.camera = this.cameraFactory(this.mode, this.canvasSize);
    }

    /**
     * Obtem a instância singleton do CameraSystem
     */
    public static getInstance(
        config: CameraSystemConfig = {},
        deps: CameraSystemDependencies,
    ): CameraSystem {
        if (!CameraSystem.instance) {
            CameraSystem.instance = new CameraSystem(config, deps);
        }
        return CameraSystem.instance;
    }

    /**
     * Reseta a instância singleton do CameraSystem
     */
    public static resetInstance(): void {
        CameraSystem.instance = null;
    }

    /**
     * Define uma câmera externa (ex.: fornecida pelo R3F) para ser gerenciada pelo sistema.
     */
    public setExternalCamera(camera: Camera): void {
        this.camera = camera;
        this.eventBus.emit("cameraUpdated", { camera });
    }

    /**
     * Retorna a camera ativa
     */
    public getCamera(): Camera {
        return this.camera;
    }

    /**
     * Retorna o modo da câmera ativa
     */
    public getMode(): CameraMode {
        return this.mode;
    }

    /**
     * Define o modo da câmera
     */
    public setMode(mode: CameraMode): void {
        if (this.mode === mode) return;
        this.mode = mode;
        this.camera = this.cameraFactory(mode, this.canvasSize);
        this.eventBus.emit("cameraModeChanged", { mode, camera: this.camera });
    }

    /**
     * Retorna os gestos habilitados
     */
    public getGestures(): ReadonlySet<CameraGesture> {
        return new Set(this.gestures);
    }

    /**
     * Ativa um gesto de câmera
     */
    public startGesture(gesture: CameraGesture): void {
        if (!this.controlsEnabled) return;
        if (this.gestures.has(gesture)) return;
        this.gestures.add(gesture);
        this.eventBus.emit("cameraGestureStarted", { gesture });
    }

    /**
     * Encerra um gesto de câmera
     */
    public endGesture(gesture: CameraGesture): void {
        if (!this.controlsEnabled) return;
        if (!this.gestures.has(gesture)) return;
        this.gestures.delete(gesture);
        this.eventBus.emit("cameraGestureEnded", { gesture });
    }

    /**
     * Verifica se um gesto está ativo
     * TODO: Checar futuramente se será necessário, pois ainda não está sendo utilizado.
     */
    public isGestureActive(gesture: CameraGesture): boolean {
        return this.gestures.has(gesture);
    }

    /**
     * Define explicitamente se os controles estão habilitados
     */
    public setControlsEnabled(enabled: boolean): void {
        if (this.controlsEnabled === enabled) return;
        this.controlsEnabled = enabled;
        this.eventBus.emit("cameraControlsToggled", { enabled: this.controlsEnabled });
    }

    /**
     * Verifica se os controles estão habilitados
     */
    public isControlsEnabled(): boolean {
        return this.controlsEnabled;
    }
}

/**
 * Cria uma câmera com base nas dimensões do canvas
 */
function defaultCameraFactory(mode: CameraMode, size: CameraDimensions): Camera {
    const aspectRatio = size.width / size.height;
    const orthoHeight = size.height / size.width;
    switch (mode) {
        case "persp":
            return new PerspectiveCamera(75, aspectRatio, 0.1, 2000);
        case "ortho":
            return new OrthographicCamera(
                -aspectRatio,
                aspectRatio,
                orthoHeight,
                -orthoHeight,
                0.1,
                2000,
            );
        default:
            throw new Error(`Mode de câmera inválido: ${mode}`);
    }
}
