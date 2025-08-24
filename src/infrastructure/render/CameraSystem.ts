import type { Camera } from "@react-three/fiber";
import type { CameraMode, CameraGesture } from "@core/types/camera";
import type { CameraSystemConfig, CameraSystemDependencies } from "@core/types/camera/CameraSystem";
import type { EventBus } from "@core/events/EventBus";

import { PerspectiveCamera, OrthographicCamera } from "three";

/**
 * Sistema de gerenciamento de câmera
 */
export class CameraSystem {
    private static instance: CameraSystem | null = null;
    private readonly eventBus: EventBus;
    private readonly cameraFactory: (mode: CameraMode) => Camera;
    private readonly gestures = new Set<CameraGesture>();
    private camera: Camera;
    private mode: CameraMode;
    private controlsEnabled: boolean;

    private constructor(config: CameraSystemConfig, deps: CameraSystemDependencies) {
        this.mode = config.mode ?? "persp";
        this.controlsEnabled = config.controlsEnabled ?? true;
        this.eventBus = deps.eventBus;
        this.cameraFactory = deps.createCamera ?? defaultCameraFactory;
        this.camera = this.cameraFactory(this.mode);
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
        this.camera = this.cameraFactory(mode);
        this.eventBus.emit("cameraModeChanged", { mode, camera: this.camera });
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
     * Define se os controles estão habilitados
     */
    public toggleControls(): void {
        this.controlsEnabled = !this.controlsEnabled;
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
 * Cria uma câmera
 */
function defaultCameraFactory(mode: CameraMode): Camera {
    switch (mode) {
        case "persp":
            return new PerspectiveCamera(75, 1, 0.1, 2000);
        case "ortho":
            return new OrthographicCamera(-1, 1, 1, -1, 0.1, 2000);
        default:
            throw new Error(`Mode de câmera inválido: ${mode}`);
    }
}
