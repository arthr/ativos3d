import { describe, it, expect, beforeEach, vi } from "vitest";
import { EventBus } from "@core/events/EventBus";
import { HoverSystem } from "@infrastructure/picking";
import { CollisionFactory, Vec3Factory } from "@core/geometry";
import type { CameraSystemProvider } from "@core/types/camera";
import * as THREE from "three";

/**
 * Testes para HoverSystem
 */
describe("HoverSystem", () => {
    let eventBus: EventBus;
    let cameraSystem: CameraSystemProvider;
    let bodies: ReturnType<typeof CollisionFactory.createCollisionBodyFromBox>[];
    let hover: HoverSystem;

    beforeEach(() => {
        eventBus = new EventBus();
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        camera.position.set(0, 0, 5);
        camera.lookAt(0, 0, 0);
        cameraSystem = { getCamera: () => camera } as CameraSystemProvider;
        const body = CollisionFactory.createCollisionBodyFromBox({
            id: "obj1",
            position: Vec3Factory.create(0, 0, 0),
            size: Vec3Factory.create(1, 1, 1),
        });
        bodies = [body];
        hover = new HoverSystem({
            eventBus,
            cameraSystem,
            getCollisionBodies: () => bodies,
        });
    });

    it("emite eventos de hover e unhover", () => {
        const emitSpy = vi.spyOn(eventBus, "emit");
        eventBus.emit("pointerMove", {
            worldPosition: Vec3Factory.create(0, 0, 0),
            screenPosition: { x: 0, y: 0 },
            ndc: { x: 0, y: 0 },
        });
        const hoverCall = emitSpy.mock.calls.find(([t]) => t === "entityHovered");
        expect(hoverCall?.[1]).toEqual({ entityId: "obj1" });
        expect(hover.getHovered()).toBe("obj1");

        bodies.length = 0;
        eventBus.emit("pointerMove", {
            worldPosition: Vec3Factory.create(0, 0, 0),
            screenPosition: { x: 0, y: 0 },
            ndc: { x: 0, y: 0 },
        });
        const unhoverCall = emitSpy.mock.calls.find(([t]) => t === "entityUnhovered");
        expect(unhoverCall?.[1]).toEqual({ entityId: "obj1" });
        expect(hover.getHovered()).toBeNull();
    });

    it("remove listener ao dispose", () => {
        hover.dispose();
        const emitSpy = vi.spyOn(eventBus, "emit");
        eventBus.emit("pointerMove", {
            worldPosition: Vec3Factory.create(0, 0, 0),
            screenPosition: { x: 0, y: 0 },
            ndc: { x: 0, y: 0 },
        });
        const hoverCall = emitSpy.mock.calls.find(([t]) => t === "entityHovered");
        expect(hoverCall).toBeUndefined();
    });
});
