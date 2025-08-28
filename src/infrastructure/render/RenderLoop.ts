import type { RenderLoopProvider } from "@core/types/render";

/**
 * Implementação simples de um loop de renderização dirigido externamente.
 * Não conhece Three.js nem React; apenas contabiliza métricas e executa callbacks.
 */
export class RenderLoop implements RenderLoopProvider {
    private callbacks: Set<(delta: number) => void> = new Set();
    private renderCount = 0;
    private lastRenderDelta = 0;
    private lastRenderFPS = 0;

    /** Registra um callback a ser chamado a cada tick. */
    public addCallback(cb: (delta: number) => void): void {
        this.callbacks.add(cb);
    }

    /** Remove um callback previamente registrado. */
    public removeCallback(cb: (delta: number) => void): void {
        this.callbacks.delete(cb);
    }

    /** Avança o loop, chamando callbacks e atualizando estatísticas. */
    public tick(delta: number): void {
        this.renderCount++;
        this.lastRenderDelta = delta;
        this.lastRenderFPS = delta > 0 ? 1 / delta : 0;
        for (const cb of this.callbacks) cb(delta);
    }

    /** Retorna métricas básicas do loop. */
    public getStats(): { readonly renderCount: number; readonly lastRenderDelta: number; readonly lastRenderFPS: number } {
        return {
            renderCount: this.renderCount,
            lastRenderDelta: this.lastRenderDelta,
            lastRenderFPS: this.lastRenderFPS,
        };
    }
}

