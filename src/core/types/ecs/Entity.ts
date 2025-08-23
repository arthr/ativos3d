import type { Component } from "./Component";
import type { EntityId } from "./EntityId";

/**
 * Tipos fundamentais para o sistema de entidades
 */

/**
 * Representa uma entidade no sistema
 */
export interface Entity {
    readonly id: EntityId;
    readonly components: Map<string, Component>;
    addComponent(component: Component): Entity;
    removeComponent(componentType: string): Entity;
    getComponent<T extends Component>(componentType: string): T | undefined;
    hasComponent(componentType: string): boolean;
    getComponentTypes(): string[];
    getAllComponents(): Component[];
    hasAllComponents(componentTypes: string[]): boolean;
    hasAnyComponent(componentTypes: string[]): boolean;
    getComponents<T extends Component>(componentTypes: string[]): T[];
    clone(): Entity;
    equals(other: Entity): boolean;
    toString(): string;
}

/**
 * Tipo para função que cria entidades
 */
export type EntityFactory = (id: EntityId) => Entity;

/**
 * Tipo para função que adiciona componentes
 */
export type ComponentAdder = (entity: Entity, component: Component) => Entity;

/**
 * Tipo para função que remove componentes
 */
export type ComponentRemover = (entity: Entity, componentType: string) => Entity;

/**
 * Tipo para função que obtém componentes
 */
export type ComponentGetter = <T extends Component>(
    entity: Entity,
    componentType: string,
) => T | undefined;

/**
 * Tipo para função que verifica componentes
 */
export type ComponentChecker = (entity: Entity, componentType: string) => boolean;

/**
 * Tipo para função que obtém tipos de componentes
 */
export type ComponentTypeGetter = (entity: Entity) => string[];

/**
 * Tipo para função que gera IDs
 */
export type IdGenerator = () => EntityId;
