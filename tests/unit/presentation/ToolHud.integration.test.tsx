import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { EventBus } from "@core/events/EventBus";

let eventBus: EventBus;
const toolManager = { setActive: vi.fn() };

vi.mock("@presentation/hooks/useApplication", () => ({
    useApplication: () => ({ eventBus, toolManager }),
}));

import { ToolHud } from "@presentation/hud/ToolHud";

describe("ToolHud integration", () => {
    beforeEach(() => {
        eventBus = new EventBus();
        toolManager.setActive.mockClear();
    });

    it("chama ToolManager.setActive ao selecionar ferramenta", () => {
        render(<ToolHud />);
        fireEvent.click(screen.getByLabelText("Buy (modo)"));
        fireEvent.click(screen.getByLabelText("mover"));
        expect(toolManager.setActive).toHaveBeenCalledWith("move");
    });

    it("atualiza modo ao receber evento modeChanged", () => {
        render(<ToolHud />);
        act(() => {
            eventBus.emit("modeChanged", { mode: "build" });
        });
        expect(screen.getByLabelText("Build (modo)")).toHaveAttribute("aria-pressed", "true");
    });
});
