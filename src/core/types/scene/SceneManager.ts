import type { Scene } from "three";
import type { EventBus } from "@core/events/EventBus";

/**
 * Identificador único de cena
 */
export type SceneId = string;

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
