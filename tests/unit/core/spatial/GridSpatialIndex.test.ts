import { describe, it, expect } from "vitest";
import { createSpatialIndex } from "@core/spatial";
import { AABBFactory, Vec3Factory } from "@core/geometry";

/**
 * Testes para GridSpatialIndex
 */
describe("GridSpatialIndex", () => {
    it("insere e consulta caixas", () => {
        const index = createSpatialIndex();
        const box = AABBFactory.create(Vec3Factory.create(0, 0, 0), Vec3Factory.create(1, 1, 1));
        index.insert(box);
        const results = index.query(
            AABBFactory.create(Vec3Factory.create(0, 0, 0), Vec3Factory.create(2, 2, 2)),
        );
        expect(results).toContain(box);
    });

    it("consulta retorna apenas caixas relevantes", () => {
        const index = createSpatialIndex();
        const box1 = AABBFactory.create(Vec3Factory.create(0, 0, 0), Vec3Factory.create(1, 1, 1));
        const box2 = AABBFactory.create(Vec3Factory.create(5, 0, 5), Vec3Factory.create(6, 1, 6));
        index.insert(box1);
        index.insert(box2);
        const results = index.query(
            AABBFactory.create(Vec3Factory.create(0, 0, 0), Vec3Factory.create(2, 2, 2)),
        );
        expect(results).toContain(box1);
        expect(results).not.toContain(box2);
    });

    it("limpa todos os elementos", () => {
        const index = createSpatialIndex();
        const box = AABBFactory.create(Vec3Factory.create(0, 0, 0), Vec3Factory.create(1, 1, 1));
        index.insert(box);
        index.clear();
        const results = index.query(
            AABBFactory.create(Vec3Factory.create(0, 0, 0), Vec3Factory.create(2, 2, 2)),
        );
        expect(results).toHaveLength(0);
    });

    it("não retorna duplicatas ao consultar caixas que cobrem várias células", () => {
        const index = createSpatialIndex();
        const box = AABBFactory.create(Vec3Factory.create(0, 0, 0), Vec3Factory.create(2, 1, 2));
        index.insert(box);
        const results = index.query(box);
        expect(results).toHaveLength(1);
        expect(results[0]).toBe(box);
    });
});
