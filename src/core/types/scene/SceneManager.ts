import type { Scene } from "three";
import type { EventBus } from "@core/events/EventBus";

/**
 * Identificador único de cena
 */
export type SceneId = string;

/**
 * Configuração do SceneManager
 */
export interface SceneManagerConfig {
    /**
     * Cria uma cena padrão automaticamente
     */
    autoCreateDefault?: boolean;
}

/**
 * Dependências do SceneManager
 */
export interface SceneManagerDependencies {
    /**
     * EventBus para emissão de eventos do sistema
     */
    eventBus: EventBus;

    /**
     * Factory para criação de cenas
     */
    createScene?: () => Scene;
}
