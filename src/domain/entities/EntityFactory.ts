import type {
    Entity,
    EntityId,
    Component,
    EntityFactory,
    ComponentAdder,
    ComponentRemover,
    ComponentGetter,
    ComponentChecker,
    ComponentTypeGetter,
    IdGenerator,
} from "@core/types";

/**
 * Implementações das funções de entidade
 *
 * Este módulo contém as implementações das funções relacionadas a entidades,
 * seguindo os princípios de Domain-Driven Design.
 */

/**
 * Cria uma nova entidade
 */
export const createEntity: EntityFactory = (id: EntityId): Entity => {
    return {
        id,
        components: new Map(),
    };
};

/**
 * Adiciona um componente a uma entidade
 */
export const addComponent: ComponentAdder = (entity: Entity, component: Component): Entity => {
    const newComponents = new Map(entity.components);
    newComponents.set(component.type, component);

    return {
        ...entity,
        components: newComponents,
    };
};

/**
 * Remove um componente de uma entidade
 */
export const removeComponent: ComponentRemover = (
    entity: Entity,
    componentType: string,
): Entity => {
    const newComponents = new Map(entity.components);
    newComponents.delete(componentType);

    return {
        ...entity,
        components: newComponents,
    };
};

/**
 * Obtém um componente de uma entidade
 */
export const getComponent: ComponentGetter = <T extends Component>(
    entity: Entity,
    componentType: string,
): T | undefined => {
    return entity.components.get(componentType) as T | undefined;
};

/**
 * Verifica se uma entidade tem um componente
 */
export const hasComponent: ComponentChecker = (entity: Entity, componentType: string): boolean => {
    return entity.components.has(componentType);
};

/**
 * Obtém todos os tipos de componentes de uma entidade
 */
export const getComponentTypes: ComponentTypeGetter = (entity: Entity): string[] => {
    return Array.from(entity.components.keys());
};

/**
 * Gera um ID único para entidade
 */
export const generateEntityId: IdGenerator = (): EntityId => {
    return crypto.randomUUID();
};
