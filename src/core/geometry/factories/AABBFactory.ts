import type { AABB, Vec3 } from "@core/geometry";

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
     * Cria uma AABB a partir do centro e meia-extensão
     */
    static fromCenter(center: Vec3, halfSize: Vec3): AABB {
        return {
            min: {
                x: center.x - halfSize.x,
                y: center.y - halfSize.y,
                z: center.z - halfSize.z,
            },
            max: {
                x: center.x + halfSize.x,
                y: center.y + halfSize.y,
                z: center.z + halfSize.z,
            },
        };
    }
}
