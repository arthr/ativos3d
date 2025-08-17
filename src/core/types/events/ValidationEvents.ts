import type { Vec3 } from "../Vec3";
import type { EntityId } from "../Entity";

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
