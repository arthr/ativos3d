import type { EntityId } from "@core/types/ecs/EntityId";

/**
 * Eventos de renderização
 */
export interface RenderEvents {
    renderObjectAdded: { entityId: EntityId };
    renderObjectRemoved: { entityId: EntityId };
    renderObjectUpdated: { entityId: EntityId };
}
