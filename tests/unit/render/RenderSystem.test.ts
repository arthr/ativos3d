import { Scene, Camera } from "three";
import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { RenderSystem, RenderObjectManager } from "@infrastructure/render";
import { RenderComponent } from "@domain/components";
import { EventBus } from "@core/events/EventBus";

// Helpers para simular requestAnimationFrame
let callbacks: FrameRequestCallback[] = [];
let raf: (cb: FrameRequestCallback) => number;
let caf: (id: number) => void;
let nowTime: number;
let now: () => number;

afterEach(() => {
    RenderSystem.resetInstance();
    vi.restoreAllMocks();
});

describe("RenderSystem", () => {
    beforeEach(() => {
        callbacks = [];
        raf = (cb): number => {
            callbacks.push(cb);
            return callbacks.length;
        };
        caf = vi.fn();
        nowTime = 0;
        now = (): number => nowTime;
    });

    it("deve ser singleton", () => {
        const dependencies = {
            adapter: { render: vi.fn() },
            scene: new Scene(),
            camera: new Camera(),
            eventBus: new EventBus(),
        };
        const system1 = RenderSystem.getInstance({}, dependencies);
        const system2 = RenderSystem.getInstance({}, dependencies);
        expect(system1).toBe(system2);
    });

    it("deve retornar as estatísticas corretas do sistema de renderização", () => {
        const renderSystem = RenderSystem.getInstance(
            {},
            {
                raf,
                caf,
                now,
                adapter: { render: vi.fn() },
                scene: new Scene(),
                camera: new Camera(),
                eventBus: new EventBus(),
            },
        );

        // Estatísticas iniciais
        expect(renderSystem.getStats()).toEqual({
            objectCount: 0,
            renderCount: 0,
            lastRenderTime: 0,
            lastRenderDelta: 0,
            lastRenderFPS: 0,
        });

        // Inicia o sistema
        renderSystem.start();

        // Estatísticas iniciais após o start
        expect(renderSystem.getStats()).toEqual({
            objectCount: 0,
            renderCount: 1,
            lastRenderTime: 0,
            lastRenderDelta: 0,
            lastRenderFPS: 0,
        });

        // Simula um frame
        nowTime = 16;
        callbacks[0]?.(16);

        // Estatísticas após um frame
        expect(renderSystem.getStats()).toEqual({
            objectCount: 0,
            renderCount: 2,
            lastRenderTime: 16,
            lastRenderDelta: 16,
            lastRenderFPS: 62.5,
        });

        // Uma nova chamada sem novo frame não deve alterar as estatísticas
        nowTime = 32;
        expect(renderSystem.getStats()).toEqual({
            objectCount: 0,
            renderCount: 2,
            lastRenderTime: 16,
            lastRenderDelta: 16,
            lastRenderFPS: 62.5,
        });
    });

    it("deve renderizar um frame", () => {
        const renderFn = vi.fn();
        const scene = new Scene();
        const camera = new Camera();
        const system = RenderSystem.getInstance(
            {},
            { adapter: { render: renderFn }, scene, camera, eventBus: new EventBus() },
        );
        system.renderFrame();
        expect(renderFn).toHaveBeenCalledWith(scene, camera);
    });

    it("deve adicionar e remover callbacks de renderização", () => {
        const renderSystem = RenderSystem.getInstance(
            {},
            {
                raf,
                caf,
                now,
                adapter: { render: vi.fn() },
                scene: new Scene(),
                camera: new Camera(),
                eventBus: new EventBus(),
            },
        );

        const renderCallback = vi.fn();
        renderSystem.addRenderCallback(renderCallback);
        renderSystem.start();

        // Simula um frame
        nowTime = 16;
        callbacks[0]?.(16);

        expect(renderCallback).toHaveBeenCalledWith(16);

        // Remove o callback
        renderSystem.removeRenderCallback(renderCallback);
        nowTime = 32;
        callbacks[0]?.(32);

        // O callback não deve ser chamado novamente
        expect(renderCallback).toHaveBeenCalledTimes(1);
    });

    it("deve iniciar e parar o loop de renderização", () => {
        const renderFn = vi.fn();
        const requestSpy = vi
            .spyOn(globalThis, "requestAnimationFrame")
            .mockImplementation(() => 1);
        const cancelSpy = vi
            .spyOn(globalThis, "cancelAnimationFrame")
            .mockImplementation(() => undefined);
        const scene = new Scene();
        const camera = new Camera();
        const system = RenderSystem.getInstance(
            {},
            { adapter: { render: renderFn }, scene, camera, eventBus: new EventBus() },
        );

        system.start();
        expect(renderFn).toHaveBeenCalled();
        expect(requestSpy).toHaveBeenCalled();

        system.stop();
        expect(cancelSpy).toHaveBeenCalledWith(1);
    });

    it("deve parar o loop de renderização", () => {
        const renderFn = vi.fn();
        const renderSystem = RenderSystem.getInstance(
            {},
            {
                raf,
                caf,
                now,
                adapter: { render: renderFn },
                scene: new Scene(),
                camera: new Camera(),
                eventBus: new EventBus(),
            },
        );
        renderSystem.start();
        expect(renderFn).toHaveBeenCalled();
        renderSystem.stop();
        expect(caf).toHaveBeenCalledWith(1);
    });
});

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

    it("deve remover um componente de renderização", () => {
        const eventBus = new EventBus();
        const manager = RenderObjectManager.getInstance(eventBus);
        const component = new RenderComponent({ color: "red" });
        manager.registerObject("entity", component);
        manager.removeObject("entity");
        expect(manager.hasObject("entity")).toBe(false);
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
