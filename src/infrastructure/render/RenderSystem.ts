import type { RenderAdapter, RenderSystemDependencies } from "@core/types";
import { eventBus } from "@core/events/EventBus";

/**
 * Sistema de renderização base
 */
export class RenderSystem {
    private static instance: RenderSystem | null = null;
    private adapter: RenderAdapter;
    private scene: unknown;
    private camera: unknown;
    private eventBus: typeof eventBus;
    private animationId: number | null = null;

    private constructor(dependencies: RenderSystemDependencies) {
        this.adapter = dependencies.adapter;
        this.scene = dependencies.scene;
        this.camera = dependencies.camera;
        this.eventBus = dependencies.eventBus ?? eventBus;
    }

    /**
     * Obtém a instância singleton do RenderSystem
     */
    public static getInstance(dependencies: RenderSystemDependencies): RenderSystem {
        if (!RenderSystem.instance) {
            RenderSystem.instance = new RenderSystem(dependencies);
        }
        return RenderSystem.instance;
    }

    /**
     * Reseta a instância singleton (apenas para testes)
     */
    public static resetInstance(): void {
        RenderSystem.instance = null;
    }

    /**
     * Renderiza um único frame
     */
    public render(): void {
        this.adapter.render(this.scene, this.camera);
    }

    /**
     * Inicia o loop de renderização
     */
    public start(): void {
        if (this.animationId !== null) return;

        const loop = (): void => {
            this.render();
            this.animationId = globalThis.requestAnimationFrame(loop);
        };

        loop();
    }

    /**
     * Interrompe o loop de renderização
     */
    public stop(): void {
        if (this.animationId === null) return;
        globalThis.cancelAnimationFrame(this.animationId);
        this.animationId = null;
    }
}
