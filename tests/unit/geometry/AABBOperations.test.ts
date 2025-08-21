import { describe, it, expect } from "vitest";
import { AABBOperations } from "@core/geometry/operations/AABBOperations";
import { AABBFactory } from "@core/geometry/factories/AABBFactory";
import { Vec3Factory } from "@core/geometry/factories/Vec3Factory";

describe("AABBOperations", () => {
    describe("isValid", () => {
        it("deve validar AABB correta", () => {
            const box = AABBFactory.create(
                Vec3Factory.create(0, 0, 0),
                Vec3Factory.create(1, 1, 1),
            );
            expect(AABBOperations.isValid(box)).toBe(true);
        });

        it("deve detectar AABB inválida", () => {
            const box = AABBFactory.create(
                Vec3Factory.create(1, 1, 1),
                Vec3Factory.create(0, 0, 0),
            );
            expect(AABBOperations.isValid(box)).toBe(false);
        });
    });

    describe("getCenter", () => {
        it("deve calcular o centro corretamente", () => {
            const box = AABBFactory.create(
                Vec3Factory.create(0, 0, 0),
                Vec3Factory.create(2, 2, 2),
            );
            expect(AABBOperations.getCenter(box)).toEqual(Vec3Factory.create(1, 1, 1));
        });
    });

    describe("getSize", () => {
        it("deve calcular o tamanho corretamente", () => {
            const box = AABBFactory.create(
                Vec3Factory.create(0, 0, 0),
                Vec3Factory.create(2, 2, 2),
            );
            expect(AABBOperations.getSize(box)).toEqual(Vec3Factory.create(2, 2, 2));
        });
    });

    describe("containsPoint", () => {
        it("deve conter ponto dentro da AABB", () => {
            const box = AABBFactory.create(
                Vec3Factory.create(0, 0, 0),
                Vec3Factory.create(1, 1, 1),
            );
            const point = Vec3Factory.create(0.5, 0.5, 0.5);
            expect(AABBOperations.containsPoint(box, point)).toBe(true);
        });

        it("não deve conter ponto fora da AABB", () => {
            const box = AABBFactory.create(
                Vec3Factory.create(0, 0, 0),
                Vec3Factory.create(1, 1, 1),
            );
            const point = Vec3Factory.create(2, 2, 2);
            expect(AABBOperations.containsPoint(box, point)).toBe(false);
        });
    });

    describe("intersects", () => {
        it("deve detectar interseção", () => {
            const a = AABBFactory.create(Vec3Factory.create(0, 0, 0), Vec3Factory.create(2, 2, 2));
            const b = AABBFactory.create(Vec3Factory.create(1, 1, 1), Vec3Factory.create(3, 3, 3));
            expect(AABBOperations.intersects(a, b)).toBe(true);
        });

        it("não deve detectar interseção", () => {
            const a = AABBFactory.create(Vec3Factory.create(0, 0, 0), Vec3Factory.create(1, 1, 1));
            const b = AABBFactory.create(Vec3Factory.create(2, 2, 2), Vec3Factory.create(3, 3, 3));
            expect(AABBOperations.intersects(a, b)).toBe(false);
        });
    });

    describe("merge", () => {
        it("deve combinar duas AABBs", () => {
            const a = AABBFactory.create(Vec3Factory.create(0, 0, 0), Vec3Factory.create(1, 1, 1));
            const b = AABBFactory.create(Vec3Factory.create(2, 2, 2), Vec3Factory.create(3, 3, 3));
            const result = AABBOperations.merge(a, b);
            expect(result.min).toEqual(Vec3Factory.create(0, 0, 0));
            expect(result.max).toEqual(Vec3Factory.create(3, 3, 3));
        });
    });
});
