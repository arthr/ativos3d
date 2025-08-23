import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { EventBus } from "@core/events/EventBus";
import type { Component } from "@core/types/ecs/Component";
import { RenderComponent } from "@domain/components";
import { RenderObjectManager, RenderSync } from "@infrastructure/render";

let eventBus: EventBus;
let manager: RenderObjectManager;
let sync: RenderSync;

beforeEach(() => {
    eventBus = new EventBus();
    RenderObjectManager.resetInstance();
    manager = RenderObjectManager.getInstance(eventBus);
    sync = new RenderSync(eventBus, manager);
});

afterEach(() => {
    sync.dispose();
});

describe("RenderSync", () => {
    it("registra o objeto quando RenderComponent é adicionado", () => {
        const component = new RenderComponent();
        eventBus.emit("componentAdded", { entityId: "entity", component });
        expect(manager.hasObject("entity")).toBe(true);
    });

    it("ignora componentes que não são de renderização", () => {
        const other: Component = {
            type: "OtherComponent",
            validate: () => ({ isValid: true, errors: [] }),
        };
        eventBus.emit("componentAdded", { entityId: "otherEntity", component: other });
        expect(manager.hasObject("otherEntity")).toBe(false);
    });

    it("remove o objeto quando RenderComponent é removido", () => {
        const component = new RenderComponent();
        manager.registerObject("entity", component);
        eventBus.emit("componentRemoved", { entityId: "entity", componentType: "RenderComponent" });
        expect(manager.hasObject("entity")).toBe(false);
    });

    it("ignora remoção de componentes que não são de renderização", () => {
        const component = new RenderComponent();
        manager.registerObject("entity", component);
        eventBus.emit("componentRemoved", { entityId: "entity", componentType: "OtherComponent" });
        expect(manager.hasObject("entity")).toBe(true);
    });

    it("remove o objeto quando a entidade é destruída", () => {
        const component = new RenderComponent();
        manager.registerObject("entity", component);
        eventBus.emit("entityDestroyed", { entityId: "entity", type: "Any" });
        expect(manager.hasObject("entity")).toBe(false);
    });
});
