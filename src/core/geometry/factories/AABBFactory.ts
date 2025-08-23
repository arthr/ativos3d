import type { AABB, Vec3 } from "../types";
import { Vec3Factory } from "../factories/Vec3Factory";
import { Vec3Operations } from "../operations/Vec3Operations";

/**
 * Factory para criar AABB
 */
export class AABBFactory {
    /**
     * Cria uma AABB a partir de min e max
     */
    static create(min: Vec3, max: Vec3): AABB {
        return { min, max };
    }

    /**
     * Cria uma AABB a partir do centro
     */
    static fromCenterSize(center: Vec3, size: Vec3): AABB {
        const halfSize = Vec3Operations.multiply(size, 0.5);

        return {
            min: Vec3Operations.subtract(center, halfSize),
            max: Vec3Operations.add(center, halfSize),
        };
    }

    /**
     * Cria um AABB vazia
     */
    static empty(): AABB {
        const zero = Vec3Factory.zero();
        return { min: zero, max: zero };
    }
}
