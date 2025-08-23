import { eventBus } from "@core/events/EventBus";

/**
 * Adaptador genérico para motores de renderização
 */
export interface RenderAdapter {
    render(scene: unknown, camera: unknown): void;
}

/**
 * Dependências necessárias para o RenderSystem
 */
export interface RenderSystemDependencies {
    adapter: RenderAdapter;
    scene: unknown;
    camera: unknown;
    eventBus?: typeof eventBus;
}

/**
 * Configuração do RenderSystem
 */
export interface RenderSystemConfig {
    autoStart?: boolean;
}
