import { describe, it, expect } from "vitest";
import { AABBFactory } from "@core/geometry/factories/AABBFactory";
import { Vec3Factory } from "@core/geometry/factories/Vec3Factory";

describe("AABBFactory", () => {
    it("deve criar AABB a partir de min e max", () => {
        const min = Vec3Factory.create(0, 0, 0);
        const max = Vec3Factory.create(1, 1, 1);
        const box = AABBFactory.create(min, max);
        expect(box).toEqual({ min, max });
    });

    it("deve criar AABB a partir do centro e tamanho", () => {
        const center = Vec3Factory.zero();
        const size = Vec3Factory.create(2, 2, 2);
        const box = AABBFactory.fromCenterSize(center, size);
        expect(box).toEqual({
            min: { x: -1, y: -1, z: -1 },
            max: { x: 1, y: 1, z: 1 },
        });
    });

    it("deve criar um AABB vazio", () => {
        const box = AABBFactory.empty();
        expect(box).toEqual({ min: Vec3Factory.zero(), max: Vec3Factory.zero() });
    });
});
