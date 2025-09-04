import { describe, it, expect, vi } from "vitest";
import { ToolManager } from "@application/tools/ToolManager";
import { EventBus } from "@core/events/EventBus";
import { registerBasicTools } from "@application/tools/basic";

/**
 * Testes para PlaceTool
 */
describe("PlaceTool", () => {
    it("emite objectPlaced ao posicionar", () => {
        const eventBus = new EventBus();
        const emit = vi.spyOn(eventBus, "emit");
        const manager = new ToolManager(eventBus);
        registerBasicTools(manager, eventBus);

        manager.activate("place");
        const entityId = "e1";
        manager.handleInput({ entityId });

        expect(emit).toHaveBeenCalledWith("objectPlaced", { entityId });
    });
});
