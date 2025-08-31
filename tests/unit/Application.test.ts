import { describe, it, expect, vi, beforeEach } from "vitest";
import { Application } from "@/Application";
import { EventBus } from "@core/events/EventBus";
import { CameraSystem } from "@infrastructure/render/CameraSystem";
import { EntityManager } from "@domain/entities";

describe("Application", () => {
    beforeEach(() => {
        CameraSystem.resetInstance();
        EntityManager.resetInstance();
    });

    it("deve atualizar sistemas no resize e limpar recursos no dispose", () => {
        const eventBus = new EventBus();
        const addSpy = vi.spyOn(window, "addEventListener");
        const removeSpy = vi.spyOn(window, "removeEventListener");

        const app = new Application(eventBus, { width: 100, height: 100 }, window);
        const cameraUpdated = vi.fn();
        eventBus.on("cameraUpdated", cameraUpdated);

        const entityManager = app.resolve("entityManager");
        entityManager.createEntity();
        expect(entityManager.getStats().totalEntities).toBe(1);

        const resizeHandler = addSpy.mock.calls.find(call => call[0] === "resize")?.[1] as () => void;
        resizeHandler?.();
        expect(cameraUpdated).toHaveBeenCalled();

        app.dispose();

        expect(entityManager.getStats().totalEntities).toBe(0);
        expect(eventBus.getEventTypes()).toHaveLength(0);
        expect(removeSpy).toHaveBeenCalledWith("resize", resizeHandler);
    });
});
