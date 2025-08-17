import type { Vec3 } from "../Vec3";
import type { SnapType } from "../Common";

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
