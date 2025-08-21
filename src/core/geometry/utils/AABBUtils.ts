import type { AABB } from "@core/geometry";
import { Vec3Utils } from "@core/geometry";

/**
 * Utilitários para AABB
 */
export class AABBUtils {
    /**
     * Converte AABB para string
     */
    static toString(box: AABB): string {
        return `[min: ${Vec3Utils.toString(box.min)}, max: ${Vec3Utils.toString(box.max)}]`;
    }

    /**
     * Verifica se um objeto é uma AABB válida
     */
    static isValid(box: unknown): box is AABB {
        return (
            typeof box === "object" &&
            box !== null &&
            "min" in box &&
            "max" in box &&
            Vec3Utils.isValid((box as { min: unknown }).min) &&
            Vec3Utils.isValid((box as { max: unknown }).max)
        );
    }
}
