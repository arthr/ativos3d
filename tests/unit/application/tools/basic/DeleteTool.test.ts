import { describe, it, expect, vi } from "vitest";
import { ToolManager } from "@application/tools/ToolManager";
import { EventBus } from "@core/events/EventBus";
import { registerBasicTools } from "@application/tools/basic";

/**
 * Testes para DeleteTool
 */
describe("DeleteTool", () => {
    it("emite entityDestroyed ao deletar", () => {
        const eventBus = new EventBus();
        const emit = vi.spyOn(eventBus, "emit");
        const manager = new ToolManager(eventBus);
        registerBasicTools(manager, eventBus);

        manager.activate("delete");
        const entityId = "e1";
        manager.handleInput({ entityId, type: "object" });

        expect(emit).toHaveBeenCalledWith("entityDestroyed", {
            entityId,
            type: "object",
        });
    });
});
