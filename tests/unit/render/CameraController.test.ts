import { describe, it, expect, beforeEach, vi } from "vitest";
import { CameraController, CameraSystem } from "@infrastructure/render";
import { EventBus } from "@core/events/EventBus";

describe("CameraController", () => {
    let eventBus: EventBus;
    let cameraSystem: CameraSystem;

    beforeEach(() => {
        CameraSystem.resetInstance();
        eventBus = new EventBus();
        cameraSystem = CameraSystem.getInstance({ mode: "persp" }, { eventBus });
    });

    it("deve atualizar a câmera quando o modo muda", () => {
        const controller = new CameraController({ eventBus, cameraSystem });
        const oldCamera = cameraSystem.getCamera();
        cameraSystem.setMode("ortho");
        const newCamera = cameraSystem.getCamera();
        controller.pan({ x: 1, y: 0, z: 0 });
        expect(oldCamera.position.x).toBe(0);
        expect(newCamera.position.x).toBe(1);
    });

    it("deve realizar pan e emitir evento", () => {
        const listener = vi.fn();
        const controller = new CameraController({ eventBus, cameraSystem });
        eventBus.on("cameraUpdated", listener);
        controller.pan({ x: 1, y: 2, z: 3 });
        const camera = cameraSystem.getCamera();
        expect(camera.position.x).toBe(1);
        expect(camera.position.y).toBe(2);
        expect(camera.position.z).toBe(3);
        expect(listener).toHaveBeenCalledWith({ camera });
    });

    it("deve rotacionar e emitir evento", () => {
        const listener = vi.fn();
        const controller = new CameraController({ eventBus, cameraSystem });
        eventBus.on("cameraUpdated", listener);
        controller.rotate({ x: 0.1, y: 0.2, z: 0.3 });
        const camera = cameraSystem.getCamera();
        expect(camera.rotation.x).toBeCloseTo(0.1);
        expect(camera.rotation.y).toBeCloseTo(0.2);
        expect(camera.rotation.z).toBeCloseTo(0.3);
        expect(listener).toHaveBeenCalledWith({ camera });
    });

    it("deve aplicar zoom e emitir evento", () => {
        const listener = vi.fn();
        const controller = new CameraController({ eventBus, cameraSystem });
        eventBus.on("cameraUpdated", listener);
        controller.zoom(5);
        const camera = cameraSystem.getCamera();
        expect(camera.position.z).toBe(5);
        expect(listener).toHaveBeenCalledWith({ camera });
    });

    it("deve remover o listener de modo ao chamar dispose", () => {
        const controller = new CameraController({ eventBus, cameraSystem });
        expect(eventBus.listenerCount("cameraModeChanged")).toBe(1);
        controller.dispose();
        expect(eventBus.listenerCount("cameraModeChanged")).toBe(0);
    });
});
