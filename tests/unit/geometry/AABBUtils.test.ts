import { describe, it, expect } from "vitest";
import { AABBUtils } from "@core/geometry/utils/AABBUtils";
import { AABBFactory } from "@core/geometry/factories/AABBFactory";
import { Vec3Factory } from "@core/geometry/factories/Vec3Factory";

describe("AABBUtils", () => {
    it("deve converter AABB para string", () => {
        const box = AABBFactory.create(
            Vec3Factory.create(0, 0, 0),
            Vec3Factory.create(1, 1, 1),
        );
        expect(AABBUtils.toString(box)).toBe("[min: (0, 0, 0), max: (1, 1, 1)]");
    });

    it("deve validar objeto AABB", () => {
        const box = AABBFactory.create(
            Vec3Factory.create(0, 0, 0),
            Vec3Factory.create(1, 1, 1),
        );
        expect(AABBUtils.isValid(box)).toBe(true);
        expect(AABBUtils.isValid({})).toBe(false);
    });
});
