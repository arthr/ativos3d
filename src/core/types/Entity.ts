/**
 * Identificador único para entidades
 */
export type EntityId = string;

/**
 * Interface base para componentes
 */
export interface Component {
    readonly type: string;
}

/**
 * Representa uma entidade no sistema
 */
export interface Entity {
    readonly id: EntityId;
    readonly components: Map<string, Component>;
}

/**
 * Cria uma nova entidade
 */
export function createEntity(id: EntityId): Entity {
    return {
        id,
        components: new Map(),
    };
}

/**
 * Adiciona um componente a uma entidade
 */
export function addComponent(entity: Entity, component: Component): Entity {
    const newComponents = new Map(entity.components);
    newComponents.set(component.type, component);

    return {
        ...entity,
        components: newComponents,
    };
}

/**
 * Remove um componente de uma entidade
 */
export function removeComponent(entity: Entity, componentType: string): Entity {
    const newComponents = new Map(entity.components);
    newComponents.delete(componentType);

    return {
        ...entity,
        components: newComponents,
    };
}

/**
 * Obtém um componente de uma entidade
 */
export function getComponent<T extends Component>(
    entity: Entity,
    componentType: string,
): T | undefined {
    return entity.components.get(componentType) as T | undefined;
}

/**
 * Verifica se uma entidade tem um componente
 */
export function hasComponent(entity: Entity, componentType: string): boolean {
    return entity.components.has(componentType);
}

/**
 * Obtém todos os tipos de componentes de uma entidade
 */
export function getComponentTypes(entity: Entity): string[] {
    return Array.from(entity.components.keys());
}

/**
 * Gera um ID único para entidade
 */
export function generateEntityId(): EntityId {
    return crypto.randomUUID();
}
