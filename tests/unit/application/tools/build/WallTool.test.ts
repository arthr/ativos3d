import { describe, it, expect, vi, beforeEach } from "vitest";
import { EventBus } from "@core/events/EventBus";
import { EntityManager } from "@domain/entities";
import { ToolManager } from "@application/tools/ToolManager";
import { WallTool } from "@application/tools/build/WallTool";
import { Vec3Factory } from "@core/geometry";

/**
 * Testes para WallTool
 */
describe("WallTool", () => {
    beforeEach(() => {
        EntityManager.resetInstance();
    });

    it("emite componentAdded ao criar parede", () => {
        const eventBus = new EventBus();
        const entityManager = EntityManager.getInstance({}, { eventBus });
        const emit = vi.spyOn(eventBus, "emit");
        const manager = new ToolManager(eventBus);
        manager.register("wall", new WallTool(eventBus, entityManager));

        manager.activate("wall");
        const start = Vec3Factory.create(0, 0, 0);
        const end = Vec3Factory.create(1, 0, 0);
        const height = 2.5;
        const thickness = 0.2;
        manager.handleInput({ start, end, height, thickness });

        expect(emit).toHaveBeenCalledWith(
            "componentAdded",
            expect.objectContaining({
                component: expect.objectContaining({ type: "WallComponent", height, thickness }),
            }),
        );
    });
});
