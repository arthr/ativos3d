/**
 * Loop de renderização headless dirigido externamente (ex.: R3F useFrame).
 */
export interface RenderLoopProvider {
    /** Registra um callback chamado a cada tick com delta em segundos. */
    addCallback(cb: (delta: number) => void): void;
    /** Remove um callback previamente registrado. */
    removeCallback(cb: (delta: number) => void): void;
    /** Avança o loop manualmente (normalmente chamado via R3F useFrame). */
    tick(delta: number): void;
    /** Estatísticas simples do loop. */
    getStats(): {
        readonly renderCount: number;
        readonly lastRenderDelta: number;
        readonly lastRenderFPS: number;
    };
}

