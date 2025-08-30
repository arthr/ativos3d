import { beforeEach, describe, expect, it, vi } from "vitest";
import { CameraController, CameraSystem } from "@infrastructure/render";
import type { Unsubscribe } from "@core/types/Events";
import type { EventBus } from "@core/events/EventBus";
import type { Camera } from "@react-three/fiber";
import type { OrthographicCamera } from "three";

describe("CameraController", () => {
    let emit: ReturnType<typeof vi.fn>;
    let on: ReturnType<typeof vi.fn>;
    let off: ReturnType<typeof vi.fn>;
    let eventBus: EventBus;
    let cameraSystem: CameraSystem;
    let modeHandler: ((payload: { mode: string; camera: Camera }) => void) | undefined;
    let controlsHandler: ((payload: { enabled: boolean }) => void) | undefined;
    let unsubscribe: Unsubscribe;

    beforeEach(() => {
        emit = vi.fn();
        modeHandler = undefined;
        controlsHandler = undefined;
        unsubscribe = vi.fn();
        // @ts-expect-error - Mocking eventBus.on
        on = vi.fn((eventType, handler) => {
            if (eventType === "cameraModeChanged") {
                modeHandler = handler as typeof modeHandler;
            }
            if (eventType === "cameraControlsToggled") {
                controlsHandler = handler as typeof controlsHandler;
            }
            return unsubscribe;
        });
        off = vi.fn();
        eventBus = { emit, on, off } as unknown as EventBus;
        CameraSystem.resetInstance();
        cameraSystem = CameraSystem.getInstance({ mode: "persp" }, { eventBus });
    });

    describe("pan", () => {
        it("deve realizar pan e emitir cameraUpdated", () => {
            const controller = new CameraController(
                { eventBus, cameraSystem },
                { gestures: ["pan"] },
            );
            controller.pan({ x: 1, y: 2, z: 3 });
            const camera = cameraSystem.getCamera();
            expect(camera.position.x).toBe(1);
            expect(camera.position.y).toBe(2);
            expect(camera.position.z).toBe(3);
            expect(emit).toHaveBeenCalledWith("cameraUpdated", { camera });
        });

        it("deve não realizar pan se o gesto não estiver habilitado", () => {
            const controller = new CameraController(
                { eventBus, cameraSystem },
                { gestures: ["rotate"] },
            );
            controller.pan({ x: 1, y: 2, z: 3 });
            const camera = cameraSystem.getCamera();
            expect(camera.position.x).toBe(0);
            expect(camera.position.y).toBe(0);
            expect(camera.position.z).toBe(0);
            expect(emit).not.toHaveBeenCalled();
        });
    });

    describe("rotate", () => {
        it("deve rotacionar e emitir cameraUpdated", () => {
            const controller = new CameraController(
                { eventBus, cameraSystem },
                { gestures: ["rotate"] },
            );
            controller.rotate({ x: 0.1, y: 0.2, z: 0.3 });
            const camera = cameraSystem.getCamera();
            expect(camera.rotation.x).toBeCloseTo(0.1);
            expect(camera.rotation.y).toBeCloseTo(0.2);
            expect(camera.rotation.z).toBeCloseTo(0.3);
            expect(emit).toHaveBeenCalledWith("cameraUpdated", { camera });
        });

        it("deve não realizar rotate se o gesto não estiver habilitado", () => {
            const controller = new CameraController(
                { eventBus, cameraSystem },
                { gestures: ["pan"] },
            );
            controller.rotate({ x: 0.1, y: 0.2, z: 0.3 });
            const camera = cameraSystem.getCamera();
            expect(camera.rotation.x).toBe(0);
            expect(camera.rotation.y).toBe(0);
            expect(camera.rotation.z).toBe(0);
            expect(emit).not.toHaveBeenCalled();
        });

        it("deve ignorar rotate em modo ortho", () => {
            CameraSystem.resetInstance();
            cameraSystem = CameraSystem.getInstance({ mode: "ortho" }, { eventBus });
            const controller = new CameraController(
                { eventBus, cameraSystem },
                { gestures: ["rotate"] },
            );
            controller.rotate({ x: 0.1, y: 0, z: 0 });
            const camera = cameraSystem.getCamera();
            expect(camera.rotation.x).toBe(0);
            expect(emit).not.toHaveBeenCalled();
        });
    });

    describe("zoom", () => {
        it("deve aplicar zoom e emitir cameraUpdated", () => {
            const controller = new CameraController(
                { eventBus, cameraSystem },
                { gestures: ["zoom"] },
            );
            controller.zoom(5);
            const camera = cameraSystem.getCamera();
            expect(camera.position.z).toBe(5);
            expect(emit).toHaveBeenCalledWith("cameraUpdated", { camera });
        });

        it("deve aplicar zoom em modo ortho e emitir cameraUpdated", () => {
            CameraSystem.resetInstance();
            cameraSystem = CameraSystem.getInstance({ mode: "ortho" }, { eventBus });
            const controller = new CameraController(
                { eventBus, cameraSystem },
                { gestures: ["zoom"] },
            );
            const camera = cameraSystem.getCamera() as OrthographicCamera;
            const spy = vi.spyOn(camera, "updateProjectionMatrix");
            controller.zoom(5);
            expect(camera.zoom).toBe(6);
            expect(spy).toHaveBeenCalled();
            expect(emit).toHaveBeenCalledWith("cameraUpdated", { camera });
        });

        it("deve não realizar zoom se o gesto não estiver habilitado", () => {
            const controller = new CameraController(
                { eventBus, cameraSystem },
                { gestures: ["pan"] },
            );
            controller.zoom(5);
            const camera = cameraSystem.getCamera();
            expect(camera.position.z).toBe(0);
            expect(emit).not.toHaveBeenCalled();
        });
    });

    describe("cameraModeChanged", () => {
        it("deve emitir cameraUpdated ao trocar modo da câmera", () => {
            new CameraController({ eventBus, cameraSystem });
            cameraSystem.setMode("ortho");
            const payload = emit.mock.calls.find(([type]) => type === "cameraModeChanged")![1];
            const callCount = emit.mock.calls.length;
            modeHandler!(payload);
            expect(emit.mock.calls[callCount]).toEqual([
                "cameraUpdated",
                { camera: payload.camera },
            ]);
        });

        it("deve atualizar a câmera interna ao trocar modo", () => {
            const controller = new CameraController({ eventBus, cameraSystem });
            const oldCamera = cameraSystem.getCamera();
            cameraSystem.setMode("ortho");
            const payload = emit.mock.calls.find(([type]) => type === "cameraModeChanged")![1];
            modeHandler!(payload);
            emit.mockClear();
            controller.pan({ x: 1, y: 0, z: 0 });
            expect(oldCamera.position.x).toBe(0);
            expect(payload.camera.position.x).toBe(1);
            expect(emit).toHaveBeenCalledWith("cameraUpdated", { camera: payload.camera });
        });
    });

    describe("cameraControlsToggled", () => {
        it("deve ignorar gestos quando controles estiverem desabilitados", () => {
            const controller = new CameraController(
                { eventBus, cameraSystem },
                { gestures: ["pan"] },
            );
            cameraSystem.toggleControls();
            controlsHandler!({ enabled: false });
            emit.mockClear();
            controller.pan({ x: 1, y: 0, z: 0 });
            const camera = cameraSystem.getCamera();
            expect(camera.position.x).toBe(0);
            expect(emit).not.toHaveBeenCalled();
        });
    });

    describe("dispose", () => {
        it("deve remover listener cameraModeChanged", () => {
            const controller = new CameraController({ eventBus, cameraSystem });
            controller.dispose();
            expect(unsubscribe).toHaveBeenCalled();
            expect(off).not.toHaveBeenCalled();
        });
    });
});
