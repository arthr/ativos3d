import type { Vec3 } from "../geometry/Vec3";
import type { SnapType } from "../snap/SnapTypes";

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
