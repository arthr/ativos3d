import { describe, it, expect, beforeEach, vi } from "vitest";
import { CameraSystem } from "@infrastructure/render";
import { EventBus } from "@core/events/EventBus";
import { PerspectiveCamera, OrthographicCamera } from "three";

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
        const secondCamera = system.getCamera();
        expect(system.getMode()).toBe("ortho");
        expect(secondCamera).not.toBe(firstCamera);
        expect(listener).toHaveBeenCalledWith({ mode: "ortho", camera: secondCamera });
    });

    it("deve emitir eventos de gestos de câmera", () => {
        const eventBus = new EventBus();
        const startListener = vi.fn();
        const endListener = vi.fn();
        eventBus.on("cameraGestureStarted", startListener);
        eventBus.on("cameraGestureEnded", endListener);
        const system = CameraSystem.getInstance({ mode: "persp" }, { eventBus });
        system.endGesture("pan");
        system.startGesture("pan");
        system.endGesture("pan");
        expect(startListener).toHaveBeenCalledWith({ gesture: "pan" });
        expect(endListener).toHaveBeenCalledWith({ gesture: "pan" });
    });

    it("deve definir explicitamente se os controles estão habilitados", () => {
        const eventBus = new EventBus();
        const listener = vi.fn();
        eventBus.on("cameraControlsToggled", listener);
        const system = CameraSystem.getInstance({ mode: "persp" }, { eventBus });
        system.setControlsEnabled(false);
        expect(system.isControlsEnabled()).toBe(false);
        system.setControlsEnabled(true);
        expect(system.isControlsEnabled()).toBe(true);
        expect(listener).toHaveBeenNthCalledWith(1, { enabled: false });
        expect(listener).toHaveBeenNthCalledWith(2, { enabled: true });
    });

    it("deve iniciar com controles desabilitados e impedir gestos", () => {
        const eventBus = new EventBus();
        const startListener = vi.fn();
        const endListener = vi.fn();
        eventBus.on("cameraGestureStarted", startListener);
        eventBus.on("cameraGestureEnded", endListener);
        const system = CameraSystem.getInstance(
            { mode: "persp", controlsEnabled: false },
            { eventBus },
        );
        expect(system.isControlsEnabled()).toBe(false);
        system.startGesture("pan");
        system.endGesture("pan");
        expect(startListener).not.toHaveBeenCalled();
        expect(endListener).not.toHaveBeenCalled();
    });

    it("deve indicar corretamente o estado de um gesto", () => {
        const eventBus = new EventBus();
        const system = CameraSystem.getInstance({ mode: "persp" }, { eventBus });
        system.startGesture("pan");
        expect(system.isGestureActive("pan")).toBe(true);
        system.endGesture("pan");
        expect(system.isGestureActive("pan")).toBe(false);
    });

    it("deve calcular aspect ratio e bounds baseado nas dimensões", () => {
        const eventBus = new EventBus();
        const size = { width: 1920, height: 1080 };
        const system = CameraSystem.getInstance(
            { mode: "persp" },
            {
                eventBus,
                canvasSize: size,
            },
        );
        const persp = system.getCamera() as PerspectiveCamera;
        expect(persp.aspect).toBeCloseTo(1920 / 1080);
        system.setMode("ortho");
        const ortho = system.getCamera() as OrthographicCamera;
        const aspect = 1920 / 1080;
        expect(ortho.left).toBeCloseTo(-aspect);
        expect(ortho.right).toBeCloseTo(aspect);
    });

    it("deve ajustar a câmera ao redimensionar", () => {
        const eventBus = new EventBus();
        const listener = vi.fn();
        eventBus.on("cameraUpdated", listener);
        const system = CameraSystem.getInstance(
            { mode: "persp" },
            { eventBus, canvasSize: { width: 100, height: 100 } },
        );
        const firstCamera = system.getCamera() as PerspectiveCamera;
        system.resize({ width: 200, height: 150 });
        const secondCamera = system.getCamera() as PerspectiveCamera;
        expect(secondCamera).toBe(firstCamera);
        expect(secondCamera.aspect).toBeCloseTo(200 / 150);
        expect(listener).toHaveBeenCalledWith({ camera: secondCamera });
    });

    it("não deve substituir câmera externa ao redimensionar", () => {
        const eventBus = new EventBus();
        const listener = vi.fn();
        eventBus.on("cameraUpdated", listener);
        const system = CameraSystem.getInstance({ mode: "persp" }, { eventBus });
        const externalCamera = new PerspectiveCamera();
        system.setExternalCamera(externalCamera);
        system.resize({ width: 300, height: 100 });
        expect(system.getCamera()).toBe(externalCamera);
        expect(externalCamera.aspect).toBeCloseTo(3);
        expect(listener).toHaveBeenCalledWith({ camera: externalCamera });
    });
});
