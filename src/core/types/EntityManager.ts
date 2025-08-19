import type { Entity, EntityId, ComponentConfig } from "@core/types";

/**
 * Configuração para criar uma entidade
 */
export interface EntityConfig {
    id?: EntityId;
    components?: ComponentConfig[];
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
