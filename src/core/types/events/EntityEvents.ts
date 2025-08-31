import type { EntityId } from "@core/types/ecs/EntityId";
import type { Component } from "@core/types/ecs/Component";

/**
 * Eventos de entidades
 */
export interface EntityEvents {
    entityCreated: { entityId: EntityId; type: string };
    entityDestroyed: { entityId: EntityId; type: string };
    componentAdded: { entityId: EntityId; component: Component };
    componentRemoved: { entityId: EntityId; componentType: string };
    componentUpdated: { entityId: EntityId; component: Component };
    entityUpdated: { entityId: EntityId };
}
