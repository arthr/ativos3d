import type { AABB, Vec3 } from "@core/geometry";
import { Vec3Factory, Vec3Operations } from "@core/geometry";

/**
 * Operações básicas de AABB
 */
export class AABBOperations {
    /**
     * Verifica se uma AABB é válida
     */
    static isValid(box: AABB): boolean {
        return (
            Vec3Operations.isValid(box.min) &&
            Vec3Operations.isValid(box.max) &&
            box.min.x <= box.max.x &&
            box.min.y <= box.max.y &&
            box.min.z <= box.max.z
        );
    }

    /**
     * Calcula o centro do AABB
     */
    static getCenter(box: AABB): Vec3 {
        return Vec3Operations.divide(Vec3Operations.add(box.min, box.max), 2);
    }

    /**
     * Calcula o tamanho do AABB
     */
    static getSize(box: AABB): Vec3 {
        return Vec3Operations.subtract(box.max, box.min);
    }

    /**
     * Verifica se um ponto está dentro do AABB
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

    /**
     * Combina duas AABBs em uma única AABB
     */
    static merge(a: AABB, b: AABB): AABB {
        return {
            min: Vec3Factory.create(
                Math.min(a.min.x, b.min.x),
                Math.min(a.min.y, b.min.y),
                Math.min(a.min.z, b.min.z),
            ),
            max: Vec3Factory.create(
                Math.max(a.max.x, b.max.x),
                Math.max(a.max.y, b.max.y),
                Math.max(a.max.z, b.max.z),
            ),
        };
    }
}
