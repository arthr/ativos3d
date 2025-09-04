import { describe, it, expect, vi } from "vitest";
import { ToolManager } from "@application/tools/ToolManager";
import { EventBus } from "@core/events/EventBus";
import type { ToolStrategy } from "@application/tools/strategies/ToolStrategy";

describe("ToolManager", () => {
    it("deve ativar estratégia registrada", () => {
        const eventBus = new EventBus();
        const manager = new ToolManager(eventBus);
        const strategy: ToolStrategy = {
            activate: vi.fn(),
            deactivate: vi.fn(),
            handleInput: vi.fn(),
        };
        manager.register("select", strategy);

        manager.activate("select");

        expect(strategy.activate).toHaveBeenCalled();
    });

    it("deve trocar estratégias", () => {
        const eventBus = new EventBus();
        const manager = new ToolManager(eventBus);
        const selectStrategy: ToolStrategy = {
            activate: vi.fn(),
            deactivate: vi.fn(),
            handleInput: vi.fn(),
        };
        const moveStrategy: ToolStrategy = {
            activate: vi.fn(),
            deactivate: vi.fn(),
            handleInput: vi.fn(),
        };
        manager.register("select", selectStrategy);
        manager.register("move", moveStrategy);

        manager.activate("select");
        manager.activate("move");

        expect(selectStrategy.deactivate).toHaveBeenCalled();
        expect(moveStrategy.activate).toHaveBeenCalled();
    });

    it("deve emitir eventos ao ativar e desativar", () => {
        const eventBus = new EventBus();
        const manager = new ToolManager(eventBus);
        const strategy: ToolStrategy = {
            activate: vi.fn(),
            deactivate: vi.fn(),
            handleInput: vi.fn(),
        };
        const activated = vi.fn();
        const deactivated = vi.fn();
        eventBus.on("toolActivated", activated);
        eventBus.on("toolDeactivated", deactivated);
        manager.register("select", strategy);

        manager.activate("select");
        manager.deactivate();

        expect(activated).toHaveBeenCalledWith({ tool: "select" });
        expect(deactivated).toHaveBeenCalledWith({ tool: "select" });
    });

    it("deve delegar entrada para estratégia ativa", () => {
        const eventBus = new EventBus();
        const manager = new ToolManager(eventBus);
        const strategy: ToolStrategy = {
            activate: vi.fn(),
            deactivate: vi.fn(),
            handleInput: vi.fn(),
        };
        manager.register("select", strategy);
        manager.activate("select");

        const input = { any: "data" };
        manager.handleInput(input);

        expect(strategy.handleInput).toHaveBeenCalledWith(input);
    });
});
