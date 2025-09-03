import { describe, it, expect, beforeEach, vi } from "vitest";
import { EventBus } from "@core/events/EventBus";
import { ObjectSelection } from "@infrastructure/picking";
import { CollisionFactory, Vec3Factory } from "@core/geometry";
import type { CameraSystemProvider } from "@core/types/camera";
import * as THREE from "three";

/**
 * Testes para ObjectSelection
 */
describe("ObjectSelection", () => {
    let eventBus: EventBus;
    let cameraSystem: CameraSystemProvider;
    let bodies: ReturnType<typeof CollisionFactory.createCollisionBodyFromBox>[];
    let selection: ObjectSelection;

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
        selection = new ObjectSelection({
            eventBus,
            cameraSystem,
            getCollisionBodies: () => bodies,
        });
    });

    it("seleciona e desseleciona objetos", () => {
        const emitSpy = vi.spyOn(eventBus, "emit");
        eventBus.emit("pointerDown", {
            worldPosition: Vec3Factory.create(0, 0, 0),
            screenPosition: { x: 0, y: 0 },
            ndc: { x: 0, y: 0 },
            button: 0,
            modifiers: { shift: false, ctrl: false, alt: false, meta: false, space: false },
            hudTarget: false,
        });

        const selectedCall = emitSpy.mock.calls.find(([t]) => t === "entitySelected");
        expect(selectedCall?.[1]).toEqual({ entityId: "obj1" });
        const changeCalls = emitSpy.mock.calls.filter(([t]) => t === "selectionChanged");
        expect(changeCalls[0][1]).toEqual({ selectedIds: ["obj1"] });

        bodies.length = 0;
        eventBus.emit("pointerDown", {
            worldPosition: Vec3Factory.create(0, 0, 0),
            screenPosition: { x: 0, y: 0 },
            ndc: { x: 0, y: 0 },
            button: 0,
            modifiers: { shift: false, ctrl: false, alt: false, meta: false, space: false },
            hudTarget: false,
        });
        const deselectedCall = emitSpy.mock.calls.find(([t]) => t === "entityDeselected");
        expect(deselectedCall?.[1]).toEqual({ entityId: "obj1" });
        const finalChangeCalls = emitSpy.mock.calls.filter(([t]) => t === "selectionChanged");
        expect(finalChangeCalls[1][1]).toEqual({ selectedIds: [] });
    });

    it("remove listener ao dispose", () => {
        selection.dispose();
        const emitSpy = vi.spyOn(eventBus, "emit");
        eventBus.emit("pointerDown", {
            worldPosition: Vec3Factory.create(0, 0, 0),
            screenPosition: { x: 0, y: 0 },
            ndc: { x: 0, y: 0 },
            button: 0,
            modifiers: { shift: false, ctrl: false, alt: false, meta: false, space: false },
            hudTarget: false,
        });
        const selectedCall = emitSpy.mock.calls.find(([t]) => t === "entitySelected");
        expect(selectedCall).toBeUndefined();
    });
});
