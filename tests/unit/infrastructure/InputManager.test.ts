import { describe, it, expect, beforeEach, beforeAll, vi } from "vitest";
import { InputManager } from "@infrastructure/input";
import { EventBus } from "@core/events/EventBus";
import type { CameraSystemProvider } from "@core/types/camera";
import * as THREE from "three";

/**
 * Testes para InputManager
 */
describe("InputManager", () => {
    let eventBus: EventBus;
    let cameraSystem: CameraSystemProvider;
    let inputManager: InputManager;
    const width = 800;
    const height = 600;

    beforeAll(() => {
        // @ts-ignore - jsdom não implementa PointerEvent
        if (!window.PointerEvent) {
            class PointerEventPolyfill extends MouseEvent {}
            // @ts-ignore
            window.PointerEvent = PointerEventPolyfill as typeof PointerEvent;
        }
    });

    beforeEach(() => {
        eventBus = new EventBus();
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.set(0, 10, 10);
        camera.lookAt(0, 0, 0);
        cameraSystem = { getCamera: () => camera } as unknown as CameraSystemProvider;
        Object.defineProperty(window, "innerWidth", { value: width, configurable: true });
        Object.defineProperty(window, "innerHeight", { value: height, configurable: true });
        inputManager = new InputManager({ eventBus, cameraSystem, target: window });
    });

    it("publica eventos de ponteiro e teclado", () => {
        const emitSpy = vi.spyOn(eventBus, "emit");
        window.dispatchEvent(new PointerEvent("pointermove", { clientX: 400, clientY: 300 }));
        const moveArgs = emitSpy.mock.calls[0];
        expect(moveArgs[0]).toBe("pointerMove");
        expect(moveArgs[1].screenPosition).toEqual({ x: 400, y: 300 });
        expect(moveArgs[1].ndc.x).toBeCloseTo(0);
        expect(moveArgs[1].ndc.y).toBeCloseTo(0);
        expect(moveArgs[1].worldPosition.y).toBeCloseTo(0);

        window.dispatchEvent(
            new PointerEvent("pointerdown", { clientX: 400, clientY: 300, button: 0 }),
        );
        const downArgs = emitSpy.mock.calls[1];
        expect(downArgs[0]).toBe("pointerDown");
        expect(downArgs[1].button).toBe(0);

        window.dispatchEvent(
            new PointerEvent("pointerup", { clientX: 400, clientY: 300, button: 0 }),
        );
        const upArgs = emitSpy.mock.calls[2];
        expect(upArgs[0]).toBe("pointerUp");

        window.dispatchEvent(
            new MouseEvent("click", { clientX: 400, clientY: 300, button: 0 }),
        );
        const clickArgs = emitSpy.mock.calls[3];
        expect(clickArgs[0]).toBe("click");

        window.dispatchEvent(new KeyboardEvent("keydown", { code: "KeyA" }));
        const keyDownArgs = emitSpy.mock.calls[4];
        expect(keyDownArgs[0]).toBe("keyDown");
        expect(keyDownArgs[1].code).toBe("KeyA");

        window.dispatchEvent(new KeyboardEvent("keyup", { code: "KeyA" }));
        const keyUpArgs = emitSpy.mock.calls[5];
        expect(keyUpArgs[0]).toBe("keyUp");
        expect(keyUpArgs[1].code).toBe("KeyA");
    });

    it("remove listeners ao dispose", () => {
        const emitSpy = vi.spyOn(eventBus, "emit");
        inputManager.dispose();
        window.dispatchEvent(new PointerEvent("pointermove", { clientX: 10, clientY: 10 }));
        expect(emitSpy).not.toHaveBeenCalled();
    });
});
