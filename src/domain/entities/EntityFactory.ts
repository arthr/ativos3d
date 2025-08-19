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
import { Entity as DomainEntity } from "./Entity";

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
    return DomainEntity.create(id);
};

/**
 * Adiciona um componente a uma entidade
 */
export const addComponent: ComponentAdder = (entity: Entity, component: Component): Entity => {
    return entity.addComponent(component);
};

/**
 * Remove um componente de uma entidade
 */
export const removeComponent: ComponentRemover = (
    entity: Entity,
    componentType: string,
): Entity => {
    return entity.removeComponent(componentType);
};

/**
 * Obtém um componente de uma entidade
 */
export const getComponent: ComponentGetter = <T extends Component>(
    entity: Entity,
    componentType: string,
): T | undefined => {
    return entity.getComponent<T>(componentType);
};

/**
 * Verifica se uma entidade tem um componente
 */
export const hasComponent: ComponentChecker = (entity: Entity, componentType: string): boolean => {
    return entity.hasComponent(componentType);
};

/**
 * Obtém todos os tipos de componentes de uma entidade
 */
export const getComponentTypes: ComponentTypeGetter = (entity: Entity): string[] => {
    return entity.getComponentTypes();
};

/**
 * Gera um ID único para entidade
 */
export const generateEntityId: IdGenerator = (): EntityId => {
    return crypto.randomUUID();
};
