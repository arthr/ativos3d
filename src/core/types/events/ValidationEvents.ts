import type { Vec3 } from "../../geometry/types/Vec3";
import type { EntityId } from "../ecs/EntityId";

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
