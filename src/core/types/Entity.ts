/**
 * Tipos fundamentais para o sistema de entidades
 */

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
