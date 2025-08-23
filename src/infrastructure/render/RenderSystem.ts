import type {
    RenderLoopCallback,
    RenderSystemConfig,
    RenderAdapter,
    RenderStats,
    RenderSystemDependencies,
} from "@core/types/render";
import type { EventBus } from "@core/events/EventBus";
import { Scene, Camera } from "three";
import { RenderObjectManager } from "./RenderObjectManager";

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
    private readonly eventBus: EventBus;
    private readonly objectManager: RenderObjectManager;
    private callbacks: RenderLoopCallback[] = [];
    private running: boolean = false;
    private frameHandle: number = 0;
    private lastTime: number = 0;
    private frameCount: number = 0;
    private lastRenderTime: number = 0;
    private lastRenderDelta: number = 0;
    private lastRenderFPS: number = 0;

    private adapter: RenderAdapter;
    private scene: Scene;
    private camera: Camera;

    private constructor(config: RenderSystemConfig = {}, dependencies: RenderSystemDependencies) {
        this.config = { autoStart: false, ...config };
        this.raf = dependencies.raf ?? ((cb): number => globalThis.requestAnimationFrame(cb));
        this.caf = dependencies.caf ?? ((handle): void => globalThis.cancelAnimationFrame(handle));
        this.now = dependencies.now ?? ((): number => globalThis.performance.now());
        this.eventBus = dependencies.eventBus;
        this.objectManager = RenderObjectManager.getInstance(this.eventBus);

        this.adapter = dependencies.adapter ?? { render: (): void => {} };
        this.scene = dependencies.scene ?? new Scene();
        this.camera = dependencies.camera ?? new Camera();

        if (this.config.autoStart) {
            this.start();
        }
    }

    /**
     * Obtém a instância singleton do RenderSystem
     */
    public static getInstance(
        config: RenderSystemConfig = {},
        dependencies: RenderSystemDependencies,
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
        RenderObjectManager.resetInstance();
    }

    /**
     * Retorna as estatísticas básicas do sistema de renderização
     */
    public getStats(): RenderStats {
        return {
            objectCount: this.objectManager.getObjectCount(),
            renderCount: this.frameCount,
            lastRenderTime: this.lastRenderTime,
            lastRenderDelta: this.lastRenderDelta,
            lastRenderFPS: this.lastRenderFPS,
        };
    }

    /**
     * Inicia o loop de renderização
     */
    public start(): void {
        if (this.running) return;

        this.running = true;
        this.lastTime = this.now();
        this.frameCount = 0;
        this.lastRenderTime = this.now();
        this.lastRenderDelta = 0;
        this.lastRenderFPS = 0;
        this.adapter.render(this.scene, this.camera);
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
     * Registra um callback para ser executado a cada frame
     */
    public addRenderCallback(callback: RenderLoopCallback): void {
        this.callbacks.push(callback);
    }

    /**
     * Remove um callback do loop de renderização
     */
    public removeRenderCallback(callback: RenderLoopCallback): void {
        const index = this.callbacks.indexOf(callback);
        if (index > -1) {
            this.callbacks.splice(index, 1);
        }
    }

    /**
     * Renderiza um único frame (para testes ou renderização sob demanda)
     */
    public renderFrame(): void {
        this.adapter.render(this.scene, this.camera);
    }

    /**
     * Loop de renderização
     */
    private loop = (time: number): void => {
        const delta = time - this.lastTime;
        this.lastTime = time;
        this.frameCount++;

        this.lastRenderTime = time;
        this.lastRenderDelta = delta;
        this.lastRenderFPS = delta > 0 ? 1000 / delta : 0;

        // Executa callbacks de renderização
        for (const callback of this.callbacks) {
            callback(delta);
        }

        // Renderiza o frame
        this.adapter.render(this.scene, this.camera);

        // Agenda próximo frame se ainda estiver rodando
        if (this.running) {
            this.frameHandle = this.raf(this.loop);
        }
    };
}
