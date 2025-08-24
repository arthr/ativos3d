import { describe, it, expect, beforeEach, vi } from "vitest";
import { SceneManager } from "@infrastructure/render";
import { EventBus } from "@core/events/EventBus";

describe("SceneManager", () => {
    beforeEach(() => {
        SceneManager.resetInstance();
    });

    it("deve ser singleton", () => {
        const deps = { eventBus: new EventBus() };
        const manager1 = SceneManager.getInstance(deps);
        const manager2 = SceneManager.getInstance(deps);
        expect(manager1).toBe(manager2);
    });

    it("deve criar e definir cena ativa", () => {
        const eventBus = new EventBus();
        const listener = vi.fn();
        eventBus.on("sceneStateChanged", listener);
        const manager = SceneManager.getInstance({ eventBus });

        const scene = manager.createScene("scene1");
        expect(scene).toBeDefined();
        expect(manager.getActiveScene()).toBe(scene);
        expect(listener).toHaveBeenCalledWith({ action: "loaded", sceneId: "scene1" });
    });

    it("deve alternar cena ativa", () => {
        const eventBus = new EventBus();
        const listener = vi.fn();
        eventBus.on("sceneStateChanged", listener);
        const manager = SceneManager.getInstance({ eventBus });

        const scene1 = manager.createScene("scene1");
        const scene2 = manager.createScene("scene2");
        manager.setActiveScene("scene1");
        expect(manager.getActiveScene()).toBe(scene1);
        manager.setActiveScene("scene2");
        expect(manager.getActiveScene()).toBe(scene2);
        expect(listener).toHaveBeenCalledTimes(4); // createScene emite 2 vezes + 2 chamadas de setActiveScene
    });

    it("deve remover cena", () => {
        const manager = SceneManager.getInstance({ eventBus: new EventBus() });
        manager.createScene("scene1");
        expect(manager.removeScene("scene1")).toBe(true);
        expect(manager.hasScene("scene1")).toBe(false);
    });

    it("deve limpar todas as cenas", () => {
        const manager = SceneManager.getInstance({ eventBus: new EventBus() });
        manager.createScene("scene1");
        manager.createScene("scene2");
        expect(manager.getSceneCount()).toBe(2);
        manager.clearScenes();
        expect(manager.getSceneCount()).toBe(0);
        expect(manager.getActiveScene()).toBeUndefined();
    });
});
