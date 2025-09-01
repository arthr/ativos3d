import { describe, it, expect, beforeEach, vi } from "vitest";
import { InputMapper } from "@infrastructure/input";
import { EventBus } from "@core/events/EventBus";
import type { InputMapping } from "@core/types/input";
import type { Modifiers } from "@core/types/input";

/**
 * Testes para InputMapper
 */
describe("InputMapper", () => {
    let eventBus: EventBus;
    let mapper: InputMapper;
    const baseModifiers: Modifiers = {
        shift: false,
        ctrl: false,
        alt: false,
        meta: false,
        space: false,
    };

    beforeEach(() => {
        eventBus = new EventBus();
        mapper = new InputMapper({ eventBus });
    });

    it("dispara ação correspondente ao mapeamento", () => {
        const mapping: InputMapping = { key: "KeyA", action: "select" };
        mapper.registerMapping(mapping);
        let triggered = "";
        eventBus.on("actionTriggered", ({ action }) => {
            triggered = action;
        });
        eventBus.emit("keyDown", { code: "KeyA", modifiers: baseModifiers, repeat: false });
        expect(triggered).toBe("select");
    });

    it("considera modificadores ao comparar mapeamentos", () => {
        const mapping: InputMapping = {
            key: "KeyB",
            action: "move",
            modifiers: { ...baseModifiers, shift: true },
        };
        mapper.registerMapping(mapping);
        let called = false;
        eventBus.on("actionTriggered", () => {
            called = true;
        });
        eventBus.emit("keyDown", { code: "KeyB", modifiers: baseModifiers, repeat: false });
        expect(called).toBe(false);
        eventBus.emit("keyDown", {
            code: "KeyB",
            modifiers: { ...baseModifiers, shift: true },
            repeat: false,
        });
        expect(called).toBe(true);
    });

    it("considera contexto ao disparar ação", () => {
        const mapping: InputMapping = {
            key: "KeyC",
            action: "delete",
            context: "edit",
        };
        mapper.registerMapping(mapping);
        let called = false;
        eventBus.on("actionTriggered", () => {
            called = true;
        });
        eventBus.emit("keyDown", { code: "KeyC", modifiers: baseModifiers, repeat: false });
        expect(called).toBe(false);
        mapper.setContext("edit");
        eventBus.emit("keyDown", { code: "KeyC", modifiers: baseModifiers, repeat: false });
        expect(called).toBe(true);
    });

    it("considera contexto e modificadores simultaneamente", () => {
        const mapping: InputMapping = {
            key: "KeyF",
            action: "special",
            context: "mode",
            modifiers: { ...baseModifiers, ctrl: true },
        };
        mapper.registerMapping(mapping);
        const handler = vi.fn();
        eventBus.on("actionTriggered", handler);
        eventBus.emit("keyDown", { code: "KeyF", modifiers: { ...baseModifiers, ctrl: true }, repeat: false });
        expect(handler).not.toHaveBeenCalled();
        mapper.setContext("mode");
        eventBus.emit("keyDown", { code: "KeyF", modifiers: baseModifiers, repeat: false });
        expect(handler).not.toHaveBeenCalled();
        eventBus.emit("keyDown", {
            code: "KeyF",
            modifiers: { ...baseModifiers, ctrl: true },
            repeat: false,
        });
        expect(handler).toHaveBeenCalledTimes(1);
    });

    it("permite registrar mapeamentos após inicialização", () => {
        const mapping: InputMapping = { key: "KeyD", action: "confirm" };
        mapper.registerMapping(mapping);
        let triggered = false;
        eventBus.on("actionTriggered", () => {
            triggered = true;
        });
        eventBus.emit("keyDown", { code: "KeyD", modifiers: baseModifiers, repeat: false });
        expect(triggered).toBe(true);
    });

    it("permite limpar o contexto ativo", () => {
        const mapping: InputMapping = { key: "KeyE", action: "toggle", context: "mode" };
        mapper.registerMapping(mapping);
        let called = false;
        eventBus.on("actionTriggered", () => {
            called = true;
        });
        mapper.setContext("mode");
        eventBus.emit("keyDown", { code: "KeyE", modifiers: baseModifiers, repeat: false });
        expect(called).toBe(true);
        called = false;
        mapper.setContext();
        eventBus.emit("keyDown", { code: "KeyE", modifiers: baseModifiers, repeat: false });
        expect(called).toBe(false);
    });
});

