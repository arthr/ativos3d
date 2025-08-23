import type { Scene, Camera } from "three";
import type { EventBus } from "@core/events/EventBus";

/**
 * Tipos relacionados ao sistema de renderização
 */

/**
 * Função de callback executada a cada frame de renderização
 */
export type RenderLoopCallback = (delta: number) => void;

/**
 * Configuração do RenderSystem
 */
export interface RenderSystemConfig {
    /**
     * Inicia automaticamente o loop de renderização
     */
    autoStart?: boolean;
}

/**
 * Adaptador genérico para motores de renderização
 */
export interface RenderAdapter {
    render(scene: Scene, camera: Camera): void;
}

/**
 * Estatísticas básicas de renderização
 */
export interface RenderStats {
    readonly objectCount: number;
    readonly renderCount: number;
    readonly lastRenderTime: number;
    readonly lastRenderDelta: number;
    readonly lastRenderFPS: number;
}

/**
 * Dependências necessárias para o RenderSystem
 */
export interface RenderSystemDependencies {
    /**
     * Adaptador de renderização
     */
    adapter: RenderAdapter;

    /**
     * Cena a ser renderizada
     */
    scene: Scene;

    /**
     * Câmera a ser usada para renderização
     */
    camera: Camera;

    /**
     * Função de requestFrameAnimation (injetável para testes)
     */
    readonly raf?: (callback: FrameRequestCallback) => number;

    /**
     * Função de cancelAnimationFrame (injetável para testes)
     */
    readonly caf?: (handle: number) => void;

    /**
     * Função para obter o tempo atual
     */
    readonly now?: () => number;

    /**
     * EventBus a ser usado para emitir eventos
     */
    readonly eventBus?: EventBus;
}
