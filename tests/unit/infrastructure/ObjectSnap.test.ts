import { describe, it, expect, beforeEach, vi } from "vitest";
import { ObjectSnap } from "@infrastructure/snap";
import { EventBus } from "@core/events/EventBus";
import { Vec3Factory, Vec2Factory, CollisionFactory } from "@core/geometry";
import { PerspectiveCamera } from "three";
import type { CameraSystemProvider } from "@core/types/camera/CameraSystem";

/**
 * Testes para ObjectSnap
 */
describe("ObjectSnap", () => {
    let eventBus: EventBus;
    let cameraSystem: CameraSystemProvider;
    let bodies: ReturnType<typeof CollisionFactory.createCollisionBodyFromBox>[];
    let objectSnap: ObjectSnap;

    beforeEach(() => {
        eventBus = new EventBus();
        const camera = new PerspectiveCamera(75, 1, 0.1, 1000);
        camera.position.set(0, 0, 0);
        camera.lookAt(0, 0, -1);
        camera.updateMatrixWorld();
        cameraSystem = { getCamera: () => camera } as CameraSystemProvider;
        const body = CollisionFactory.createCollisionBodyFromBox({
            id: "1",
            position: Vec3Factory.create(0, 0, -5),
            size: Vec3Factory.unit(),
            isStatic: true,
        });
        bodies = [body];
        objectSnap = new ObjectSnap({
            eventBus,
            cameraSystem,
            getCollisionBodies: () => bodies,
        });
    });

    it("emite snapPointCalculated com centro do corpo e tipo object", () => {
        const snapListener = vi.fn();
        eventBus.on("snapPointCalculated", snapListener);
        const worldPosition = Vec3Factory.create(0, 0, 0);
        eventBus.emit("pointerMove", {
            worldPosition,
            screenPosition: Vec2Factory.create(0, 0),
            ndc: Vec2Factory.create(0, 0),
        });
        expect(snapListener).toHaveBeenCalledTimes(1);
        const payload = snapListener.mock.calls[0][0];
        expect(payload.originalPosition).toEqual(worldPosition);
        expect(payload.snappedPosition).toEqual(Vec3Factory.create(0, 0, -5));
        expect(payload.snapType).toBe("object");
    });

    it("não emite snapPointCalculated quando não há colisão", () => {
        const snapListener = vi.fn();
        eventBus.on("snapPointCalculated", snapListener);
        bodies.length = 0;
        eventBus.emit("pointerMove", {
            worldPosition: Vec3Factory.create(0, 0, 0),
            screenPosition: Vec2Factory.create(0, 0),
            ndc: Vec2Factory.create(0, 0),
        });
        expect(snapListener).not.toHaveBeenCalled();
    });

    it("remove listener ao dispose", () => {
        const snapListener = vi.fn();
        eventBus.on("snapPointCalculated", snapListener);
        objectSnap.dispose();
        eventBus.emit("pointerMove", {
            worldPosition: Vec3Factory.create(0, 0, 0),
            screenPosition: Vec2Factory.create(0, 0),
            ndc: Vec2Factory.create(0, 0),
        });
        expect(snapListener).not.toHaveBeenCalled();
    });
});
