import type { AABB, Vec3 } from "@core/geometry/types";
import { Vec3Factory } from "@core/geometry/factories";
import { AABBFactory } from "@core/geometry/factories";

export function aabbFromDims(x: number, y: number, z: number): AABB {
    return AABBFactory.create(
        Vec3Factory.create(-x / 2, 0, -z / 2),
        Vec3Factory.create(x / 2, y, z / 2),
    );
}

export function cornerPositions(
    x: number,
    z: number,
    insetX: number,
    insetZ: number,
    y: number,
): Vec3[] {
    const hx = x / 2 - insetX,
        hz = z / 2 - insetZ;
    return [
        Vec3Factory.create(-hx, y, -hz),
        Vec3Factory.create(hx, y, -hz),
        Vec3Factory.create(hx, y, hz),
        Vec3Factory.create(-hx, y, hz),
    ];
}

/** Conveniência: dimensões internas de um “caixote” oco (paredes = t) */
export function innerDims(x: number, y: number, z: number, t: number): Vec3 {
    return Vec3Factory.create(x - 2 * t, y - 2 * t, z - t);
}
