import type { EntityId } from "../Entity";

/**
 * Eventos de renderização
 */
export interface RenderEvents {
    renderObjectAdded: { entityId: EntityId };
    renderObjectRemoved: { entityId: EntityId };
    renderObjectUpdated: { entityId: EntityId };
}
