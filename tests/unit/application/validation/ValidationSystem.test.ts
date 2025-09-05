import { describe, it, expect, vi, beforeEach } from "vitest";
import { ValidationSystem, type Validator } from "@application/validation/ValidationSystem";
import { EventBus } from "@core/events/EventBus";
import { Vec3Factory } from "@core/geometry";
import { Entity } from "@domain/entities";

/**
 * Testes para ValidationSystem
 */
describe("ValidationSystem", () => {
    beforeEach(() => {
        ValidationSystem.resetInstance();
    });

    it("para na primeira validação inválida e agrega avisos", () => {
        const eventBus = new EventBus();
        const entity = Entity.create("e1");
        const system = ValidationSystem.getInstance(eventBus, () => entity);

        const first: Validator = () => ({ isValid: true, errors: [], warnings: ["w1"] });
        const second: Validator = () => ({ isValid: false, errors: ["e2"], warnings: ["w2"] });
        const third = vi.fn<ReturnType<Validator>, Parameters<Validator>>(() => ({
            isValid: true,
            errors: [],
        }));

        system.registerValidator(first);
        system.registerValidator(second);
        system.registerValidator(third);

        const result = system.validate(entity, Vec3Factory.create(0, 0, 0));

        expect(result.isValid).toBe(false);
        expect(result.errors).toEqual(["e2"]);
        expect(result.warnings).toEqual(["w1", "w2"]);
        expect(third).not.toHaveBeenCalled();
    });

    it("ouve validationRequested e emite validationCompleted", () => {
        const eventBus = new EventBus();
        const entity = Entity.create("e1");
        const system = ValidationSystem.getInstance(eventBus, () => entity);

        const validator: Validator = () => ({ isValid: true, errors: [], warnings: [] });
        system.registerValidator(validator);

        const listener = vi.fn();
        eventBus.on("validationCompleted", listener);

        const position = Vec3Factory.create(1, 2, 3);
        eventBus.emit("validationRequested", { entityId: entity.id, position });

        expect(listener).toHaveBeenCalledWith({
            entityId: entity.id,
            position,
            valid: true,
            errors: [],
        });
    });
});
