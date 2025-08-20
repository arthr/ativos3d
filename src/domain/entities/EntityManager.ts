import type {
    Entity,
    EntityId,
    Component,
    EntityConfig,
    EntityFilter,
    EntityQueryResult,
    EntityManagerStats,
    EntityManagerConfig,
    EntityInfo,
    EntityManagerDependencies,
} from "@core/types";
import { Entity as EntityImplementation } from "./Entity";
import { ComponentSystem } from "@domain/components";
import { eventBus } from "@core/events/EventBus";

/**
 * EntityManager - Sistema centralizado para gerenciar entidades
 *
 * Este sistema é responsável por:
 * - Criar e destruir entidades
 * - Gerenciar o ciclo de vida das entidades
 * - Fornecer consultas e filtros
 * - Emitir eventos de mudanças
 * - Manter estatísticas do sistema
 */
export class EntityManager {
    private static instance: EntityManager | null = null;
    private entities: Map<EntityId, Entity> = new Map();
    private entityInfo: Map<EntityId, EntityInfo> = new Map();
    private componentSystem: ComponentSystem;
    private eventBus: typeof eventBus;
    private config: EntityManagerConfig;
    private idCounter: number = 0;

    private constructor(
        config: EntityManagerConfig = {},
        dependencies?: EntityManagerDependencies,
    ) {
        this.config = {
            maxEntities: 10000,
            enableStatistics: true,
            enableEvents: true,
            autoCleanup: true,
            ...config,
        };

        this.componentSystem = dependencies?.componentSystem ?? ComponentSystem.getInstance();
        this.eventBus = dependencies?.eventBus ?? eventBus;
    }

    /**
     * Obtém a instância singleton do EntityManager
     */
    public static getInstance(
        config?: EntityManagerConfig,
        dependencies?: EntityManagerDependencies,
    ): EntityManager {
        if (!EntityManager.instance) {
            EntityManager.instance = new EntityManager(config, dependencies);
        }
        return EntityManager.instance;
    }

    /**
     * Reseta a instância singleton (para testes)
     */
    public static resetInstance(): void {
        if (EntityManager.instance) {
            EntityManager.instance.clear();
        }
        EntityManager.instance = null;
    }

    /**
     * Cria uma nova entidade
     */
    public createEntity(config?: EntityConfig): Entity {
        const id = config?.id || this.generateId();

        if (this.entities.has(id)) {
            throw new Error(`Entidade com ID ${id} já existe`);
        }

        if (this.config.maxEntities && this.entities.size >= this.config.maxEntities) {
            throw new Error(`Limite máximo de entidades atingido: ${this.config.maxEntities}`);
        }

        let entity = EntityImplementation.create(id);

        // Adiciona componentes se especificados
        if (config?.components) {
            for (const componentConfig of config.components) {
                const component = this.componentSystem.createComponent(
                    componentConfig.type,
                    componentConfig.data,
                );
                entity = entity.addComponent(component);
            }
        }

        // Armazena a entidade
        this.entities.set(id, entity);

        // Cria informações da entidade
        const info: EntityInfo = {
            id,
            componentCount: entity.getComponentTypes().length,
            componentTypes: entity.getComponentTypes(),
            createdAt: Date.now(),
            lastModified: Date.now(),
        };
        this.entityInfo.set(id, info);

        // Emite evento se habilitado
        if (this.config.enableEvents) {
            this.eventBus.emit("entityCreated", { entityId: id, type: "entity" });
        }

        return entity;
    }

    /**
     * Destrói uma entidade
     */
    public destroyEntity(entityId: EntityId): boolean {
        const entity = this.entities.get(entityId);
        if (!entity) {
            return false;
        }

        this.entities.delete(entityId);
        this.entityInfo.delete(entityId);

        // Emite evento se habilitado
        if (this.config.enableEvents) {
            this.eventBus.emit("entityDestroyed", { entityId, type: "entity" });
        }

        return true;
    }

    /**
     * Obtém uma entidade por ID
     */
    public getEntity(entityId: EntityId): Entity | undefined {
        return this.entities.get(entityId);
    }

    /**
     * Verifica se uma entidade existe
     */
    public hasEntity(entityId: EntityId): boolean {
        return this.entities.has(entityId);
    }

    /**
     * Obtém todas as entidades
     */
    public getAllEntities(): Entity[] {
        return Array.from(this.entities.values());
    }

    /**
     * Obtém IDs de todas as entidades
     */
    public getAllEntityIds(): EntityId[] {
        return Array.from(this.entities.keys());
    }

    /**
     * Adiciona um componente a uma entidade
     */
    public addComponent(entityId: EntityId, component: Component): Entity | undefined {
        const entity = this.entities.get(entityId);
        if (!entity) {
            return undefined;
        }

        const updatedEntity = entity.addComponent(component);
        this.entities.set(entityId, updatedEntity);
        this.updateEntityInfo(entityId, updatedEntity);

        // Emite evento se habilitado
        if (this.config.enableEvents) {
            this.eventBus.emit("componentAdded", { entityId, component });
            this.eventBus.emit("entityUpdated", { entityId });
        }

        return updatedEntity;
    }

    /**
     * Remove um componente de uma entidade
     */
    public removeComponent(entityId: EntityId, componentType: string): Entity | undefined {
        const entity = this.entities.get(entityId);
        if (!entity) {
            return undefined;
        }

        // Verifica se a entidade possui o componente
        if (!entity.hasComponent(componentType)) {
            return entity;
        }

        const updatedEntity = entity.removeComponent(componentType);
        this.entities.set(entityId, updatedEntity);
        this.updateEntityInfo(entityId, updatedEntity);

        // Emite evento se habilitado
        if (this.config.enableEvents) {
            this.eventBus.emit("componentRemoved", { entityId, componentType });
            this.eventBus.emit("entityUpdated", { entityId });
        }

        return updatedEntity;
    }

    /**
     * Consulta entidades com filtros
     */
    public queryEntities(filter?: EntityFilter): EntityQueryResult {
        let entities = this.getAllEntities();

        if (filter) {
            entities = entities.filter((entity) => {
                // Filtro por ID específico
                if (filter.id && entity.id !== filter.id) {
                    return false;
                }

                // Filtro por múltiplos IDs
                if (filter.ids && !filter.ids.includes(entity.id)) {
                    return false;
                }

                // Filtro por tipos de componentes obrigatórios
                if (filter.componentTypes && !entity.hasAllComponents(filter.componentTypes)) {
                    return false;
                }

                // Filtro por tipos de componentes excluídos
                if (
                    filter.excludeComponentTypes &&
                    entity.hasAnyComponent(filter.excludeComponentTypes)
                ) {
                    return false;
                }

                return true;
            });
        }

        return {
            entities,
            count: entities.length,
            totalCount: this.entities.size,
        };
    }

    /**
     * Obtém entidades que possuem um tipo específico de componente
     */
    public getEntitiesWithComponent(componentType: string): Entity[] {
        return this.queryEntities({ componentTypes: [componentType] }).entities;
    }

    /**
     * Obtém entidades que possuem todos os tipos de componentes especificados
     */
    public getEntitiesWithComponents(componentTypes: string[]): Entity[] {
        return this.queryEntities({ componentTypes: componentTypes }).entities;
    }

    /**
     * Obtém estatísticas do sistema
     */
    public getStats(): EntityManagerStats {
        const entitiesByComponentType = new Map<string, number>();
        const componentTypes = new Set<string>();

        for (const entity of this.entities.values()) {
            for (const componentType of entity.getComponentTypes()) {
                componentTypes.add(componentType);
                entitiesByComponentType.set(
                    componentType,
                    (entitiesByComponentType.get(componentType) || 0) + 1,
                );
            }
        }

        return {
            totalEntities: this.entities.size,
            entitiesByComponentType,
            componentTypes: Array.from(componentTypes),
            memoryUsage: this.config.enableStatistics ? this.calculateMemoryUsage() : undefined,
        };
    }

    /**
     * Obtém informações sobre uma entidade específica
     */
    public getEntityInfo(entityId: EntityId): EntityInfo | undefined {
        return this.entityInfo.get(entityId);
    }

    /**
     * Limpa entidades órfãs (sem componentes)
     */
    public cleanup(): number {
        if (!this.config.autoCleanup) {
            return 0;
        }

        const entitiesToRemove: EntityId[] = [];

        for (const [id, entity] of this.entities) {
            if (entity.getComponentTypes().length === 0) {
                entitiesToRemove.push(id);
            }
        }

        for (const id of entitiesToRemove) {
            this.destroyEntity(id);
        }

        return entitiesToRemove.length;
    }

    /**
     * Limpa todas as entidades
     */
    public clear(): void {
        const entityIds = this.getAllEntityIds();
        for (const id of entityIds) {
            this.destroyEntity(id);
        }
    }

    /**
     * Gera um ID único para entidade
     */
    private generateId(): EntityId {
        return `entity_${++this.idCounter}_${Date.now()}`;
    }

    /**
     * Atualiza informações de uma entidade
     */
    private updateEntityInfo(entityId: EntityId, entity: Entity): void {
        const info = this.entityInfo.get(entityId);
        if (info) {
            info.componentCount = entity.getComponentTypes().length;
            info.componentTypes = entity.getComponentTypes();
            info.lastModified = Date.now();
        }
    }

    /**
     * Calcula uso de memória aproximado
     */
    private calculateMemoryUsage(): number {
        // Estimativa simples baseada no número de entidades e componentes
        let totalSize = 0;

        for (const entity of this.entities.values()) {
            // Tamanho base da entidade
            totalSize += 100; // ID + overhead

            // Tamanho dos componentes
            totalSize += entity.getComponentTypes().length * 50;
        }

        return totalSize;
    }
}
