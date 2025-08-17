import type { Vec3 } from "@core/geometry/types/Vec3";
import type { SnapType } from "@core/types/snap/SnapTypes";

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
