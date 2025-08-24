import { PerspectiveCamera, OrthographicCamera, Camera } from "three";
import type { CameraMode, CameraSystemDependencies, CameraGesture } from "@/core/types/camera";

/**
 * Sistema de gerenciamento de câmera
 */
export class CameraSystem {
    private static instance: CameraSystem | null = null;
    private readonly eventBus: CameraSystemDependencies["eventBus"];
    private readonly cameraFactory: (mode: CameraMode) => Camera;
    private readonly gestures = new Set<CameraGesture>();
    private camera: Camera;
    private mode: CameraMode;
    private controlsEnabled = true;

    private constructor(mode: CameraMode, deps: CameraSystemDependencies) {
        this.eventBus = deps.eventBus;
        this.cameraFactory = deps.createCamera ?? defaultCameraFactory;
        this.mode = mode;
        this.camera = this.cameraFactory(mode);
    }

    /**
     * Obtem a instância singleton do CameraSystem
     */
    public static getInstance(mode: CameraMode, deps: CameraSystemDependencies): CameraSystem {
        if (!CameraSystem.instance) {
            CameraSystem.instance = new CameraSystem(mode, deps);
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
        this.eventBus.emit("cameraModeChanged", { mode });
    }

    /**
     * Ativa um gesto de câmera
     */
    public startGesture(gesture: CameraGesture): void {
        if (this.gestures.has(gesture)) return;
        this.gestures.add(gesture);
        this.eventBus.emit("cameraGestureStarted", { gesture });
    }

    /**
     * Encerra um gesto de câmera
     */
    public endGesture(gesture: CameraGesture): void {
        if (!this.gestures.has(gesture)) return;
        this.gestures.delete(gesture);
        this.eventBus.emit("cameraGestureEnded", { gesture });
    }

    /**
     * Verifica se um gesto está ativo
     */
    public isGestureActive(gesture: CameraGesture): boolean {
        return this.gestures.has(gesture);
    }

    /**
     * Define se os controles estão habilitados
     */
    public setControlsEnabled(enabled: boolean): void {
        if (this.controlsEnabled === enabled) return;
        this.controlsEnabled = enabled;
        this.eventBus.emit("cameraControlsToggled", { enabled });
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
            return new PerspectiveCamera();
        case "ortho":
            return new OrthographicCamera(-1, 1, 1, -1, 0.1, 2000);
        default:
            throw new Error(`Mode de câmera inválido: ${mode}`);
    }
}
