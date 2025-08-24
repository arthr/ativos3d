import { describe, it, expect, beforeEach, vi } from "vitest";
import { CameraSystem } from "@infrastructure/render";
import { EventBus } from "@core/events/EventBus";

describe("CameraSystem", () => {
    beforeEach(() => {
        CameraSystem.resetInstance();
    });

    it("deve ser singleton", () => {
        const deps = { eventBus: new EventBus() };
        const system1 = CameraSystem.getInstance({ mode: "persp" }, deps);
        const system2 = CameraSystem.getInstance({ mode: "ortho" }, deps);
        expect(system1).toBe(system2);
    });

    it("deve alterar o modo de câmera e emitir evento", () => {
        const eventBus = new EventBus();
        const listener = vi.fn();
        eventBus.on("cameraModeChanged", listener);
        const system = CameraSystem.getInstance({ mode: "persp" }, { eventBus });
        const firstCamera = system.getCamera();
        system.setMode("ortho");
        expect(system.getMode()).toBe("ortho");
        expect(system.getCamera()).not.toBe(firstCamera);
        expect(listener).toHaveBeenCalledWith({ mode: "ortho" });
    });

    it("deve emitir eventos de gestos de câmera", () => {
        const eventBus = new EventBus();
        const startListener = vi.fn();
        const endListener = vi.fn();
        eventBus.on("cameraGestureStarted", startListener);
        eventBus.on("cameraGestureEnded", endListener);
        const system = CameraSystem.getInstance({ mode: "persp" }, { eventBus });
        system.startGesture("pan");
        system.endGesture("pan");
        expect(startListener).toHaveBeenCalledWith({ gesture: "pan" });
        expect(endListener).toHaveBeenCalledWith({ gesture: "pan" });
    });

    it("deve alternar controles de câmera", () => {
        const eventBus = new EventBus();
        const listener = vi.fn();
        eventBus.on("cameraControlsToggled", listener);
        const system = CameraSystem.getInstance({ mode: "persp" }, { eventBus });
        system.toggleControls();
        system.toggleControls();
        expect(listener).toHaveBeenNthCalledWith(1, { enabled: false });
        expect(listener).toHaveBeenNthCalledWith(2, { enabled: true });
    });
});
