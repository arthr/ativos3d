import { describe, it, expect } from "vitest";
import { AABBMath } from "@core/geometry/math/AABBMath";
import { AABBFactory } from "@core/geometry/factories/AABBFactory";
import { Vec3Factory } from "@core/geometry/factories/Vec3Factory";

describe("AABBMath", () => {
    it("deve calcular centro", () => {
        const box = AABBFactory.create(
            Vec3Factory.create(0, 0, 0),
            Vec3Factory.create(2, 2, 2),
        );
        expect(AABBMath.center(box)).toEqual({ x: 1, y: 1, z: 1 });
    });

    it("deve calcular tamanho", () => {
        const box = AABBFactory.create(
            Vec3Factory.create(0, 0, 0),
            Vec3Factory.create(2, 4, 6),
        );
        expect(AABBMath.size(box)).toEqual({ x: 2, y: 4, z: 6 });
    });
});
