import { describe, it, expect, vi, beforeEach } from "vitest";
import { EventBus } from "@core/events/EventBus";
import { EntityManager } from "@domain/entities";
import { ToolManager } from "@application/tools/ToolManager";
import { FloorTool } from "@application/tools/build/FloorTool";
import { Vec3Factory } from "@core/geometry";

/**
 * Testes para FloorTool
 */
describe("FloorTool", () => {
    beforeEach(() => {
        EntityManager.resetInstance();
    });

    it("emite componentAdded ao criar piso", () => {
        const eventBus = new EventBus();
        const entityManager = EntityManager.getInstance({}, { eventBus });
        const emit = vi.spyOn(eventBus, "emit");
        const manager = new ToolManager(eventBus);
        manager.register("floor", new FloorTool(eventBus, entityManager));

        manager.activate("floor");
        const position = Vec3Factory.create(0, 0, 0);
        const size = Vec3Factory.create(2, 0.1, 2);
        const material = "wood";
        manager.handleInput({ position, size, material });

        expect(emit).toHaveBeenCalledWith(
            "componentAdded",
            expect.objectContaining({
                component: expect.objectContaining({ type: "FloorComponent", material }),
            }),
        );
    });
});
