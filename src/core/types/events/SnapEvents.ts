import type { Vec3 } from "@core/geometry";
import type { SnapType } from "@core/types";

/**
 * Eventos de snap
 */
export interface SnapEvents {
    snapPointCalculated: {
        originalPosition: Vec3;
        snappedPosition: Vec3;
        snapType: SnapType;
    };
}
