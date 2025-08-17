import type { Vec3 } from "@core/geometry";
import type { EntityId } from "@core/types/Entity";

/**
 * Eventos de validação
 */
export interface ValidationEvents {
    validationRequested: {
        entityId: EntityId;
        position: Vec3;
    };

    validationCompleted: {
        entityId: EntityId;
        position: Vec3;
        valid: boolean;
        errors: string[];
    };
}
