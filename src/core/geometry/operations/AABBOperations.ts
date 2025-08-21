import type { AABB, Vec3 } from "@core/geometry";

/**
 * Operações básicas de AABB
 */
export class AABBOperations {
    /**
     * Verifica se uma AABB é válida
     */
    static isValid(box: AABB): boolean {
        return (
            box.min.x <= box.max.x &&
            box.min.y <= box.max.y &&
            box.min.z <= box.max.z
        );
    }

    /**
     * Verifica se a AABB contém um ponto
     */
    static containsPoint(box: AABB, point: Vec3): boolean {
        return (
            point.x >= box.min.x &&
            point.x <= box.max.x &&
            point.y >= box.min.y &&
            point.y <= box.max.y &&
            point.z >= box.min.z &&
            point.z <= box.max.z
        );
    }

    /**
     * Verifica se duas AABBs se intersectam
     */
    static intersects(a: AABB, b: AABB): boolean {
        return !(
            a.max.x < b.min.x ||
            a.min.x > b.max.x ||
            a.max.y < b.min.y ||
            a.min.y > b.max.y ||
            a.max.z < b.min.z ||
            a.min.z > b.max.z
        );
    }
}
