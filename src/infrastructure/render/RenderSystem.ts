import { Scene, Camera } from "three";
import type {
    RenderLoopCallback,
    RenderSystemConfig,
    RenderAdapter,
    RenderSystemDependencies,
} from "@core/types/render";
import { eventBus } from "@core/events/EventBus";

/**
 * Sistema básico de renderização
 *
 * Gerencia o loop de renderização e permite registrar callbacks
 * executados a cada frame.
 */
export class RenderSystem {
    private static instance: RenderSystem | null = null;
    private readonly config: RenderSystemConfig;
    private readonly raf: (callback: FrameRequestCallback) => number;
    private readonly caf: (handle: number) => void;
    private readonly now: () => number;
    private eventBus: typeof eventBus; // TODO: Verificar se é necessário
    private callbacks: RenderLoopCallback[] = [];
    private running: boolean = false;
    private frameHandle: number = 0;
    private lastTime: number = 0;

    private adapter: RenderAdapter;
    private scene: Scene;
    private camera: Camera;

    private constructor(
        config: RenderSystemConfig = {},
        dependencies: RenderSystemDependencies = {
            adapter: { render: () => {} },
            scene: new Scene(),
            camera: new Camera(),
        },
    ) {
        this.config = { autoStart: false, ...config };
        this.raf = dependencies.raf ?? ((cb): number => globalThis.requestAnimationFrame(cb));
        this.caf = dependencies.caf ?? ((handle): void => globalThis.cancelAnimationFrame(handle));
        this.now = dependencies.now ?? ((): number => globalThis.performance.now());
        this.eventBus = dependencies.eventBus ?? eventBus;

        this.adapter = dependencies.adapter;
        this.scene = dependencies.scene;
        this.camera = dependencies.camera;

        if (this.config.autoStart) {
            this.start();
        }
    }

    /**
     * Obtém a instância singleton do RenderSystem
     */
    public static getInstance(
        config?: RenderSystemConfig,
        dependencies?: RenderSystemDependencies,
    ): RenderSystem {
        if (!RenderSystem.instance) {
            RenderSystem.instance = new RenderSystem(config, dependencies);
        }
        return RenderSystem.instance;
    }

    /**
     * Reseta a instância singleton (apenas para testes)
     */
    public static resetInstance(): void {
        if (RenderSystem.instance) {
            RenderSystem.instance.stop();
        }
        RenderSystem.instance = null;
    }

    /**
     * Inicia o loop de renderização
     */
    public start(): void {
        if (this.running) return;

        this.running = true;
        this.adapter.render(this.scene, this.camera);
        this.lastTime = this.now();
        this.frameHandle = this.raf(this.loop);
    }

    /**
     * Interrompe o loop de renderização
     */
    public stop(): void {
        if (!this.running) return;
        this.running = false;
        this.caf(this.frameHandle);
    }

    /**
     * Renderiza um único frame
     */
    public onRender(callback: RenderLoopCallback): void {
        this.adapter.render(this.scene, this.camera);
        this.callbacks.push(callback);
    }

    /**
     * Loop de renderização
     */
    private loop = (time: number): void => {
        const delta = time - this.lastTime;
        this.lastTime = time;

        for (const callback of this.callbacks) {
            callback(delta);
        }

        if (this.running) {
            this.frameHandle = this.raf(this.loop);
        }
    };
}
