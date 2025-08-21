/**
 * Transformação completa no espaço 3D
 */
import type { Vec3 } from "@core/geometry";

export interface Transform {
    readonly position: Vec3;
    readonly rotation: Vec3;
    readonly scale: Vec3;
}
