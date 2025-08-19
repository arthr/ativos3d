import type { EntityId } from "../Entity";
import type { Component } from "../Component";

/**
 * Eventos de entidades
 */
export interface EntityEvents {
    entityCreated: { entityId: EntityId; type: string };
    entityDestroyed: { entityId: EntityId; type: string };
    componentAdded: { entityId: EntityId; component: Component };
    componentRemoved: { entityId: EntityId; componentType: string };
    entityUpdated: { entityId: EntityId };
}
