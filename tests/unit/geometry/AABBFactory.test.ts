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

    it("deve criar AABB a partir do centro e meia-extensão", () => {
        const center = Vec3Factory.create(1, 1, 1);
        const half = Vec3Factory.create(1, 1, 1);
        const box = AABBFactory.fromCenter(center, half);
        expect(box).toEqual({
            min: { x: 0, y: 0, z: 0 },
            max: { x: 2, y: 2, z: 2 },
        });
    });
});
