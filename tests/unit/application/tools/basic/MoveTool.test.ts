import { describe, it, expect, vi } from "vitest";
import { ToolManager } from "@application/tools/ToolManager";
import { EventBus } from "@core/events/EventBus";
import { registerBasicTools } from "@application/tools/basic";

/**
 * Testes para MoveTool
 */
describe("MoveTool", () => {
    it("emite entityMoved ao mover", () => {
        const eventBus = new EventBus();
        const emit = vi.spyOn(eventBus, "emit");
        const manager = new ToolManager(eventBus);
        registerBasicTools(manager, eventBus);

        manager.activate("move");
        const entityId = "e1";
        manager.handleInput({ entityId });

        expect(emit).toHaveBeenCalledWith("entityMoved", { entityId });
    });
});
