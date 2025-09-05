import { describe, it, expect } from "vitest";
import { FootprintOperations } from "@core/geometry/operations/FootprintOperations";
import { AABBOperations } from "@core/geometry/operations/AABBOperations";
import { AABBFactory } from "@core/geometry/factories/AABBFactory";
import { Vec3Factory } from "@core/geometry/factories/Vec3Factory";
import type { Footprint3D } from "@core/geometry/types";

describe("FootprintOperations", () => {
    describe("rotateFootprint3D", () => {
        it("deve trocar largura e profundidade em 90 graus", () => {
            const fp: Footprint3D = { kind: "box", w: 2, d: 1, h: 3 };
            const rot = Vec3Factory.create(0, 90, 0);
            const result = FootprintOperations.rotateFootprint3D(fp, rot);
            expect(result.w).toBe(1);
            expect(result.d).toBe(2);
        });

        it("deve retornar o mesmo footprint para polígonos", () => {
            const fp: Footprint3D = { kind: "poly", points: [] };
            const rot = Vec3Factory.zero();
            expect(FootprintOperations.rotateFootprint3D(fp, rot)).toBe(fp);
        });
    });

    describe("footprintAABB3D", () => {
        it("deve calcular AABB para box", () => {
            const fp: Footprint3D = { kind: "box", w: 2, d: 3, h: 1 };
            const pos = Vec3Factory.create(1, 2, 3);
            const box = FootprintOperations.footprintAABB3D(fp, pos);
            const expected = AABBFactory.create(
                Vec3Factory.create(1, 2, 3),
                Vec3Factory.create(3, 3, 6),
            );
            expect(box).toEqual(expected);
        });

        it("deve calcular AABB para polígono", () => {
            const fp: Footprint3D = {
                kind: "poly",
                points: [
                    Vec3Factory.create(0, 0, 0),
                    Vec3Factory.create(1, 2, 1),
                    Vec3Factory.create(-1, -1, 2),
                ],
            };
            const pos = Vec3Factory.create(1, 1, 1);
            const box = FootprintOperations.footprintAABB3D(fp, pos);
            expect(AABBOperations.isValid(box)).toBe(true);
            expect(box.min).toEqual(Vec3Factory.create(0, 0, 1));
            expect(box.max).toEqual(Vec3Factory.create(2, 3, 3));
        });

        it("deve retornar AABB vazio para polígono sem pontos", () => {
            const fp: Footprint3D = { kind: "poly", points: [] };
            const pos = Vec3Factory.zero();
            const box = FootprintOperations.footprintAABB3D(fp, pos);
            expect(box).toEqual(AABBFactory.empty());
        });
    });
});