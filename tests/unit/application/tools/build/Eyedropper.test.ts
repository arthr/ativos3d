import { describe, it, expect, vi, beforeEach } from "vitest";
import { EventBus } from "@core/events/EventBus";
import { EntityManager } from "@domain/entities";
import { ToolManager } from "@application/tools/ToolManager";
import { EyedropperTool } from "@application/tools/build/EyedropperTool";
import { FloorComponent } from "@domain/components/FloorComponent";
import { Vec3Factory } from "@core/geometry";

/**
 * Testes para EyedropperTool
 */
describe("EyedropperTool", () => {
    beforeEach(() => {
        EntityManager.resetInstance();
    });

    it("emite eyedropperSampled ao capturar componente", () => {
        const eventBus = new EventBus();
        const entityManager = EntityManager.getInstance({}, { eventBus });
        const entity = entityManager.createEntity();
        const floor = FloorComponent.create({
            position: Vec3Factory.create(0, 0, 0),
            size: Vec3Factory.create(1, 1, 1),
            material: "stone",
        });
        entityManager.addComponent(entity.id, floor);
        const emit = vi.spyOn(eventBus, "emit");
        const manager = new ToolManager(eventBus);
        manager.register("eyedropper", new EyedropperTool(eventBus, entityManager));

        manager.activate("eyedropper");
        manager.handleInput({ entityId: entity.id, componentType: "FloorComponent" });

        expect(emit).toHaveBeenCalledWith(
            "eyedropperSampled",
            expect.objectContaining({
                entityId: entity.id,
                component: expect.objectContaining({ type: "FloorComponent" }),
            }),
        );
    });
});
