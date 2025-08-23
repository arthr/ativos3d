import type { EntityId } from "../ecs/EntityId";

/**
 * Eventos de seleção
 */
export interface SelectionEvents {
    entitySelected: { entityId: EntityId };
    entityDeselected: { entityId: EntityId };
    entityHovered: { entityId: EntityId };
    entityUnhovered: { entityId: EntityId };
    selectionChanged: { selectedIds: EntityId[] };
}
