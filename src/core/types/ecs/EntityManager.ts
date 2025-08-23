import type { Entity } from "./Entity";
import type { EntityId } from "./EntityId";
import type { ComponentConfig } from "./Component";
import type { ComponentSystem } from "./ComponentSystem";
import type { EventBus } from "../../events/EventBus";

/**
 * Configuração para criar uma entidade
 */
export interface EntityConfig {
    id?: EntityId;
    components?: ComponentConfig[];
}

/**
 * Dependências do EntityManager
 */
export interface EntityManagerDependencies {
    componentSystem?: ComponentSystem;
    eventBus: EventBus;
}

/**
 * Filtro para consultas de entidades
 */
export interface EntityFilter {
    componentTypes?: string[];
    excludeComponentTypes?: string[];
    id?: EntityId;
    ids?: EntityId[];
}

/**
 * Resultado de uma consulta de entidades
 */
export interface EntityQueryResult {
    entities: Entity[];
    count: number;
    totalCount: number;
}

/**
 * Estatísticas do EntityManager
 */
export interface EntityManagerStats {
    totalEntities: number;
    entitiesByComponentType: Map<string, number>;
    componentTypes: string[];
    memoryUsage: number | undefined;
}

/**
 * Configuração do EntityManager
 */
export interface EntityManagerConfig {
    maxEntities?: number;
    enableStatistics?: boolean;
    enableEvents?: boolean;
    autoCleanup?: boolean;
}

/**
 * Informações sobre uma entidade no sistema
 */
export interface EntityInfo {
    id: EntityId;
    componentCount: number;
    componentTypes: string[];
    createdAt: number;
    lastModified: number;
}
