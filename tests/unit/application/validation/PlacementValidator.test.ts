import { describe, it, expect } from "vitest";
import { createPlacementValidator } from "@application/validation/validators/PlacementValidator";
import { Entity } from "@domain/entities";
import { Vec3Factory } from "@core/geometry";
import type { Footprint3D, Vec3 } from "@core/geometry";

/**
 * Testes para PlacementValidator
 */
describe("PlacementValidator", () => {
    const footprint: Footprint3D = { kind: "box", w: 2, d: 2, h: 1 };

    const setup = () => {
        const lot = { width: 10, depth: 10 };
        const footprints = new Map<string, Footprint3D>();
        const transforms = new Map<string, { position: Vec3; rotation: Vec3 }>();
        const entities: Entity[] = [];

        return {
            getLot: (): { width: number; depth: number } => lot,
            getFootprint: (e: Entity): Footprint3D | null => footprints.get(e.id) ?? null,
            getTransform: (e: Entity): { position: Vec3; rotation: Vec3 } | null => transforms.get(e.id) ?? null,
            getExistingEntities: (): Entity[] => entities,
            footprints,
            transforms,
            entities,
        };
    };

    it("retorna erro se fora dos limites e não checa colisão", () => {
        const deps = setup();
        const entity = Entity.create("e1");
        deps.footprints.set(entity.id, footprint);
        const validator = createPlacementValidator({
            ...deps,
            getExistingEntities: () => {
                deps.entities.push(Entity.create("dummy"));
                return deps.entities;
            },
        });
        const result = validator({
            entityId: entity.id,
            position: Vec3Factory.create(9, 0, 9),
            rotation: Vec3Factory.create(0, 0, 0),
            entity,
        });
        expect(result.isValid).toBe(false);
        expect(result.errors).toEqual(["Footprint está fora dos limites do lote"]);
        expect(deps.entities.length).toBe(0);
    });

    it("retorna erro se houver colisão com outra entidade", () => {
        const deps = setup();
        const entity = Entity.create("e1");
        const other = Entity.create("e2");
        deps.footprints.set(entity.id, footprint);
        deps.footprints.set(other.id, footprint);
        deps.transforms.set(other.id, { position: Vec3Factory.create(1, 0, 1), rotation: Vec3Factory.create(0, 0, 0) });
        deps.entities.push(other);
        const validator = createPlacementValidator(deps);
        const result = validator({
            entityId: entity.id,
            position: Vec3Factory.create(0, 0, 0),
            rotation: Vec3Factory.create(0, 0, 0),
            entity,
        });
        expect(result.isValid).toBe(false);
        expect(result.errors).toEqual(["Colisão com outra entidade"]);
    });

    it("retorna válido quando dentro dos limites e sem colisões", () => {
        const deps = setup();
        const entity = Entity.create("e1");
        const other = Entity.create("e2");
        deps.footprints.set(entity.id, footprint);
        deps.footprints.set(other.id, footprint);
        deps.transforms.set(other.id, { position: Vec3Factory.create(5, 0, 5), rotation: Vec3Factory.create(0, 0, 0) });
        deps.entities.push(other);
        const validator = createPlacementValidator(deps);
        const result = validator({
            entityId: entity.id,
            position: Vec3Factory.create(0, 0, 0),
            rotation: Vec3Factory.create(0, 0, 0),
            entity,
        });
        expect(result.isValid).toBe(true);
        expect(result.errors).toEqual([]);
    });
});