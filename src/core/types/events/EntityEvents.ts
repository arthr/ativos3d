import type { Vec3 } from "../geometry/Vec3";
import type { EntityId } from "../Entity";

/**
 * Eventos de transformação de entidades
 */
export interface TransformEvents {
    entityTransformed: {
        entityId: EntityId;
        transform: {
            position?: Vec3;
            rotation?: Vec3;
            scale?: Vec3;
        };
    };
}

/**
 * Eventos de criação/destruição de entidades
 */
export interface EntityEvents {
    entityCreated: { entityId: EntityId; type: string };
    entityDestroyed: { entityId: EntityId; type: string };
}
