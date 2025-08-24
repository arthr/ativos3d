import { describe, it, expect, vi, afterEach } from "vitest";
import { RenderObjectManager } from "@infrastructure/render";
import { RenderComponent } from "@domain/components";
import { EventBus } from "@core/events/EventBus";

describe("RenderObjectManager", () => {
    afterEach(() => {
        RenderObjectManager.resetInstance();
    });

    it("deve ser singleton", () => {
        const eventBus = new EventBus();
        const manager1 = RenderObjectManager.getInstance(eventBus);
        const manager2 = RenderObjectManager.getInstance(eventBus);
        expect(manager1).toBe(manager2);
    });

    it("deve registrar um componente de renderização", () => {
        const eventBus = new EventBus();
        const manager = RenderObjectManager.getInstance(eventBus);
        const component = new RenderComponent();
        manager.registerObject("entity", component);
        expect(manager.hasObject("entity")).toBe(true);
        expect(manager.getObjectComponent("entity")).toBe(component);
    });

    it("deve atualizar um componente de renderização", () => {
        const eventBus = new EventBus();
        const manager = RenderObjectManager.getInstance(eventBus);
        const component = new RenderComponent({ color: "red" });
        manager.registerObject("entity", component);
        const updatedComponent = new RenderComponent({ color: "blue" });
        manager.updateObject("entity", updatedComponent);
        expect(manager.getObjectComponent("entity")).toEqual(updatedComponent);
    });

    it("não deve atualizar um componente não registrado e não deve emitir eventos", () => {
        const eventBus = new EventBus();
        const manager = RenderObjectManager.getInstance(eventBus);
        const addListener = vi.fn();
        const updateListener = vi.fn();
        eventBus.on("renderObjectAdded", addListener);
        eventBus.on("renderObjectUpdated", updateListener);

        manager.updateObject("entity", new RenderComponent({ color: "red" }));

        expect(manager.hasObject("entity")).toBe(false);
        expect(addListener).not.toHaveBeenCalled();
        expect(updateListener).not.toHaveBeenCalled();
    });

    it("deve remover um componente de renderização", () => {
        const eventBus = new EventBus();
        const manager = RenderObjectManager.getInstance(eventBus);
        const component = new RenderComponent({ color: "red" });
        manager.registerObject("entity", component);
        manager.removeObject("entity");
        expect(manager.hasObject("entity")).toBe(false);
    });

    it("não deve remover um componente não registrado e não deve emitir eventos", () => {
        const eventBus = new EventBus();
        const manager = RenderObjectManager.getInstance(eventBus);
        const addListener = vi.fn();
        const removeListener = vi.fn();
        eventBus.on("renderObjectAdded", addListener);
        eventBus.on("renderObjectRemoved", removeListener);
        manager.removeObject("entity");
        expect(manager.hasObject("entity")).toBe(false);
        expect(addListener).not.toHaveBeenCalled();
        expect(removeListener).not.toHaveBeenCalled();
    });

    it("deve retornar todos os objetos registrados", () => {
        const eventBus = new EventBus();
        const manager = RenderObjectManager.getInstance(eventBus);
        const components: RenderComponent[] = [];
        for (let i = 0; i < 10; i++) {
            components.push(new RenderComponent({ color: "red" }));
        }
        components.forEach((component, index) => {
            manager.registerObject(`entity${index}`, component);
        });
        expect(manager.getObjects()).toEqual(
            components.map((component, index) => ({
                entityId: `entity${index}`,
                component,
            })),
        );
    });

    it("deve emitir eventos de renderização", () => {
        const eventBus = new EventBus();
        const manager = RenderObjectManager.getInstance(eventBus);
        const addListener = vi.fn();
        const updateListener = vi.fn();
        const removeListener = vi.fn();

        eventBus.on("renderObjectAdded", addListener);
        eventBus.on("renderObjectUpdated", updateListener);
        eventBus.on("renderObjectRemoved", removeListener);

        const component = new RenderComponent({ color: "red" });
        manager.registerObject("entity", component);
        manager.updateObject("entity", new RenderComponent({ color: "blue" }));
        manager.removeObject("entity");

        expect(addListener).toHaveBeenCalledWith({ entityId: "entity" });
        expect(updateListener).toHaveBeenCalledWith({ entityId: "entity" });
        expect(removeListener).toHaveBeenCalledWith({ entityId: "entity" });
    });

    it("deve retornar o número correto de objetos", () => {
        const eventBus = new EventBus();
        const manager = RenderObjectManager.getInstance(eventBus);
        expect(manager.getObjectCount()).toBe(0);

        const component = new RenderComponent({ color: "red" });
        manager.registerObject("entity1", component);
        expect(manager.getObjectCount()).toBe(1);

        manager.registerObject("entity2", component);
        expect(manager.getObjectCount()).toBe(2);

        manager.removeObject("entity1");
        expect(manager.getObjectCount()).toBe(1);
    });

    it("deve limpar todos os objetos", () => {
        const eventBus = new EventBus();
        const manager = RenderObjectManager.getInstance(eventBus);
        const component = new RenderComponent({ color: "red" });
        manager.registerObject("entity1", component);
        manager.registerObject("entity2", component);
        expect(manager.getObjectCount()).toBe(2);

        manager.clearObjects();
        expect(manager.getObjectCount()).toBe(0);
        expect(manager.getObjects()).toEqual([]);
    });

    it("deve emitir eventos de remoção ao limpar todos os objetos", () => {
        const eventBus = new EventBus();
        const manager = RenderObjectManager.getInstance(eventBus);
        const component = new RenderComponent({ color: "red" });
        const removeListener = vi.fn();

        eventBus.on("renderObjectRemoved", removeListener);

        manager.registerObject("entity1", component);
        manager.registerObject("entity2", component);

        manager.clearObjects();

        expect(removeListener).toHaveBeenNthCalledWith(1, { entityId: "entity1" });
        expect(removeListener).toHaveBeenNthCalledWith(2, { entityId: "entity2" });
    });
});
