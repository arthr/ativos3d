import { beforeEach, describe, expect, it, vi } from "vitest";
import { CameraController, CameraSystem } from "@infrastructure/render";
import type { EventBus } from "@core/events/EventBus";
import type { Camera } from "@react-three/fiber";

describe("CameraController", () => {
    let emit: ReturnType<typeof vi.fn>;
    let on: ReturnType<typeof vi.fn>;
    let off: ReturnType<typeof vi.fn>;
    let eventBus: EventBus;
    let cameraSystem: CameraSystem;
    let modeHandler: ((payload: { mode: string; camera: Camera }) => void) | undefined;

    beforeEach(() => {
        emit = vi.fn();
        modeHandler = undefined;
        // @ts-expect-error - Mocking eventBus.on
        on = vi.fn((eventType, handler) => {
            if (eventType === "cameraModeChanged") {
                modeHandler = handler as typeof modeHandler;
            }
            return vi.fn();
        });
        off = vi.fn();
        eventBus = { emit, on, off } as unknown as EventBus;
        CameraSystem.resetInstance();
        cameraSystem = CameraSystem.getInstance({ mode: "persp" }, { eventBus });
    });

    it("deve realizar pan e emitir cameraUpdated", () => {
        const controller = new CameraController({ eventBus, cameraSystem });
        controller.pan({ x: 1, y: 2, z: 3 });
        const camera = cameraSystem.getCamera();
        expect(camera.position.x).toBe(1);
        expect(camera.position.y).toBe(2);
        expect(camera.position.z).toBe(3);
        expect(emit).toHaveBeenCalledWith("cameraUpdated", { camera });
    });

    it("deve rotacionar e emitir cameraUpdated", () => {
        const controller = new CameraController({ eventBus, cameraSystem });
        controller.rotate({ x: 0.1, y: 0.2, z: 0.3 });
        const camera = cameraSystem.getCamera();
        expect(camera.rotation.x).toBeCloseTo(0.1);
        expect(camera.rotation.y).toBeCloseTo(0.2);
        expect(camera.rotation.z).toBeCloseTo(0.3);
        expect(emit).toHaveBeenCalledWith("cameraUpdated", { camera });
    });

    it("deve aplicar zoom e emitir cameraUpdated", () => {
        const controller = new CameraController({ eventBus, cameraSystem });
        controller.zoom(5);
        const camera = cameraSystem.getCamera();
        expect(camera.position.z).toBe(5);
        expect(emit).toHaveBeenCalledWith("cameraUpdated", { camera });
    });

    it("deve emitir cameraUpdated ao trocar modo da câmera", () => {
        new CameraController({ eventBus, cameraSystem });
        cameraSystem.setMode("ortho");
        const payload = emit.mock.calls.find(([type]) => type === "cameraModeChanged")![1];
        const callCount = emit.mock.calls.length;
        modeHandler!(payload);
        expect(emit.mock.calls[callCount]).toEqual(["cameraUpdated", { camera: payload.camera }]);
    });
});
