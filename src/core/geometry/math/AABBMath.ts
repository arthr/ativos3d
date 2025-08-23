import type { AABB, Vec3 } from "../types";
import { Vec3Operations } from "../operations";

/**
 * Operações matemáticas para AABB
 */
export class AABBMath {
    /**
     * Calcula o centro da AABB
     */
    static center(box: AABB): Vec3 {
        return Vec3Operations.divide(Vec3Operations.add(box.min, box.max), 2);
    }

    /**
     * Calcula o tamanho da AABB
     */
    static size(box: AABB): Vec3 {
        return Vec3Operations.subtract(box.max, box.min);
    }
}
