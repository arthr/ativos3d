/**
 * Caixa delimitadora alinhada aos eixos
 */
import type { Vec3 } from "./Vec3";

export interface AABB {
    readonly min: Vec3;
    readonly max: Vec3;
}
