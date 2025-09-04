import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { ToolHud } from "@presentation/hud/ToolHud";
import { EventBus } from "@core/events/EventBus";
import type { Modifiers } from "@core/types/input";

let eventBus: EventBus;
const toolManager = { setActive: vi.fn() };
const baseModifiers: Modifiers = {
    shift: false,
    ctrl: false,
    alt: false,
    meta: false,
    space: false,
};

vi.mock("@presentation/hooks/useApplication", () => ({
    useApplication: () => ({ eventBus, toolManager }),
}));

describe("ToolHud atalhos de teclado", () => {
    beforeEach(() => {
        eventBus = new EventBus();
    });

    it("alterna modo e ferramenta via InputMapper", () => {
        render(<ToolHud />);

        act(() => {
            eventBus.emit("keyDown", { code: "F2", modifiers: baseModifiers, repeat: false });
        });
        expect(screen.getByLabelText("Buy (modo)")).toHaveAttribute("aria-pressed", "true");

        act(() => {
            eventBus.emit("keyDown", { code: "Digit2", modifiers: baseModifiers, repeat: false });
        });
        expect(screen.getByLabelText("mover")).toHaveAttribute("aria-pressed", "true");
    });
});
