import { describe, it, expect, beforeEach, vi } from "vitest";
import { GridSnap } from "@infrastructure/snap";
import { EventBus } from "@core/events/EventBus";
import { Vec3Factory } from "@core/geometry";
import { Vec2Factory } from "@core/geometry";

/**
 * Testes para GridSnap
 */
describe("GridSnap", () => {
    let eventBus: EventBus;
    let gridSnap: GridSnap;
    const gridSize = 1;

    beforeEach(() => {
        eventBus = new EventBus();
        gridSnap = new GridSnap({ eventBus, gridSize });
    });

    it("emite snapPointCalculated com posição arredondada e tipo grid", () => {
        const snapListener = vi.fn();
        eventBus.on("snapPointCalculated", snapListener);
        const worldPosition = Vec3Factory.create(2.3, 1, 3.7);
        eventBus.emit("pointerMove", {
            worldPosition,
            screenPosition: Vec2Factory.create(0, 0),
            ndc: Vec2Factory.create(0, 0),
        });
        expect(snapListener).toHaveBeenCalledTimes(1);
        const payload = snapListener.mock.calls[0][0];
        expect(payload.originalPosition).toEqual(worldPosition);
        expect(payload.snappedPosition).toEqual(Vec3Factory.create(2, 1, 4));
        expect(payload.snapType).toBe("grid");
    });

    it("remove listener ao dispose", () => {
        const snapListener = vi.fn();
        eventBus.on("snapPointCalculated", snapListener);
        gridSnap.dispose();
        eventBus.emit("pointerMove", {
            worldPosition: Vec3Factory.create(0.9, 1, 0.4),
            screenPosition: Vec2Factory.create(0, 0),
            ndc: Vec2Factory.create(0, 0),
        });
        expect(snapListener).not.toHaveBeenCalled();
    });
});
