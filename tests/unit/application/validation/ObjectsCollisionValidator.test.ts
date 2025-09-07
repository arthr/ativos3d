import { describe, it, expect } from "vitest";
import { createObjectsCollisionValidator } from "@application/validation/validators/ObjectsCollisionValidator";
import { Entity } from "@domain/entities";
import { Vec3Factory } from "@core/geometry";
import type { Footprint3D, Vec3 } from "@core/geometry";
import { createSpatialIndex } from "@core/spatial";

/**
 * Testes para ObjectsCollisionValidator
 */
describe("ObjectsCollisionValidator", () => {
    const footprint: Footprint3D = { kind: "box", w: 2, d: 2, h: 1 };

    const setup = () => {
        const footprints = new Map<string, Footprint3D>();
        const transforms = new Map<string, { position: Vec3; rotation: Vec3 }>();
        const entities: Entity[] = [];
        const spatialIndex = createSpatialIndex();

        return {
            getExistingEntities: (): Entity[] => entities,
            getFootprint: (e: Entity): Footprint3D | null => footprints.get(e.id) ?? null,
            getTransform: (e: Entity): { position: Vec3; rotation: Vec3 } | null =>
                transforms.get(e.id) ?? null,
            spatialIndex,
            footprints,
            transforms,
            entities,
        };
    };

    it("retorna erro se entidade não encontrada", () => {
        const deps = setup();
        const validator = createObjectsCollisionValidator(deps);
        const result = validator({
            entityId: "missing",
            position: Vec3Factory.create(0, 0, 0),
        });
        expect(result.isValid).toBe(false);
        expect(result.errors).toEqual(["Entidade não encontrada"]);
    });

    it("retorna válido se entidade não possui footprint", () => {
        const deps = setup();
        const entity = Entity.create("e1");
        const validator = createObjectsCollisionValidator(deps);
        const result = validator({
            entityId: entity.id,
            position: Vec3Factory.create(0, 0, 0),
            entity,
        });
        expect(result.isValid).toBe(true);
        expect(result.errors).toEqual([]);
    });

    it("retorna erro se houver colisão com outra entidade", () => {
        const deps = setup();
        const entity = Entity.create("e1");
        const other = Entity.create("e2");
        const noFoot = Entity.create("e3");
        const noTransform = Entity.create("e4");
        deps.entities.push(entity, noFoot, noTransform, other);
        deps.footprints.set(entity.id, footprint);
        deps.footprints.set(other.id, footprint);
        deps.footprints.set(noTransform.id, footprint);
        deps.transforms.set(other.id, {
            position: Vec3Factory.create(1, 0, 1),
            rotation: Vec3Factory.create(0, 0, 0),
        });
        const validator = createObjectsCollisionValidator(deps);
        const result = validator({
            entityId: entity.id,
            position: Vec3Factory.create(0, 0, 0),
            rotation: Vec3Factory.create(0, 0, 0),
            entity,
        });
        expect(result.isValid).toBe(false);
        expect(result.errors).toEqual(["Colisão com outra entidade"]);
    });

    it("retorna válido quando não há colisão com outras entidades", () => {
        const deps = setup();
        const entity = Entity.create("e1");
        const other = Entity.create("e2");
        const noFoot = Entity.create("e3");
        const noTransform = Entity.create("e4");
        deps.entities.push(entity, noFoot, noTransform, other);
        deps.footprints.set(entity.id, footprint);
        deps.footprints.set(other.id, footprint);
        deps.footprints.set(noTransform.id, footprint);
        deps.transforms.set(other.id, {
            position: Vec3Factory.create(5, 0, 5),
            rotation: Vec3Factory.create(0, 0, 0),
        });
        const validator = createObjectsCollisionValidator(deps);
        const result = validator({
            entityId: entity.id,
            position: Vec3Factory.create(0, 0, 0),
            entity,
        });
        expect(result.isValid).toBe(true);
        expect(result.errors).toEqual([]);
    });
});
