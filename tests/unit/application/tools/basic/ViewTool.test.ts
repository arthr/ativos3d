import { describe, it, expect, vi } from "vitest";
import { ToolManager } from "@application/tools/ToolManager";
import { EventBus } from "@core/events/EventBus";
import { registerBasicTools } from "@application/tools/basic";

/**
 * Testes para ViewTool
 */
describe("ViewTool", () => {
    it("emite modeChanged ao ativar", () => {
        const eventBus = new EventBus();
        const emit = vi.spyOn(eventBus, "emit");
        const manager = new ToolManager(eventBus);
        registerBasicTools(manager, eventBus);

        manager.activate("view");

        expect(emit).toHaveBeenCalledWith("modeChanged", { mode: "view" });
    });
});
