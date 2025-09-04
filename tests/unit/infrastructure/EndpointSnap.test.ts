import { describe, it, expect, beforeEach, vi } from "vitest";
import { EndpointSnap } from "@infrastructure/snap";
import { EventBus } from "@core/events/EventBus";
import { Vec3Factory, Vec2Factory } from "@core/geometry";
import type { Vec3 } from "@core/geometry/types/Vec3";

/**
 * Testes para EndpointSnap
 */
describe("EndpointSnap", () => {
    let eventBus: EventBus;
    let endpoints: ReturnType<typeof Vec3Factory.create>[];
    let endpointSnap: EndpointSnap;

    beforeEach(() => {
        eventBus = new EventBus();
        endpoints = [Vec3Factory.create(1, 0, 1)];
        endpointSnap = new EndpointSnap({
            eventBus,
            getEndpoints: (): Vec3[] => endpoints,
        });
    });

    it("emite snapPointCalculated com ponto mais próximo e tipo endpoint", () => {
        const snapListener = vi.fn();
        eventBus.on("snapPointCalculated", snapListener);
        const worldPosition = Vec3Factory.create(1.1, 0, 1.1);
        eventBus.emit("pointerMove", {
            worldPosition,
            screenPosition: Vec2Factory.create(0, 0),
            ndc: Vec2Factory.create(0, 0),
        });
        expect(snapListener).toHaveBeenCalledTimes(1);
        const payload = snapListener.mock.calls[0][0];
        expect(payload.originalPosition).toEqual(worldPosition);
        expect(payload.snappedPosition).toEqual(endpoints[0]);
        expect(payload.snapType).toBe("endpoint");
    });

    it("não emite snapPointCalculated quando ponto está distante", () => {
        const snapListener = vi.fn();
        eventBus.on("snapPointCalculated", snapListener);
        const worldPosition = Vec3Factory.create(5, 0, 5);
        eventBus.emit("pointerMove", {
            worldPosition,
            screenPosition: Vec2Factory.create(0, 0),
            ndc: Vec2Factory.create(0, 0),
        });
        expect(snapListener).not.toHaveBeenCalled();
    });

    it("não emite snapPointCalculated quando não há pontos", () => {
        const snapListener = vi.fn();
        eventBus.on("snapPointCalculated", snapListener);
        endpoints.length = 0;
        eventBus.emit("pointerMove", {
            worldPosition: Vec3Factory.create(1, 0, 1),
            screenPosition: Vec2Factory.create(0, 0),
            ndc: Vec2Factory.create(0, 0),
        });
        expect(snapListener).not.toHaveBeenCalled();
    });

    it("remove listener ao dispose", () => {
        const snapListener = vi.fn();
        eventBus.on("snapPointCalculated", snapListener);
        endpointSnap.dispose();
        eventBus.emit("pointerMove", {
            worldPosition: Vec3Factory.create(1.1, 0, 1.1),
            screenPosition: Vec2Factory.create(0, 0),
            ndc: Vec2Factory.create(0, 0),
        });
        expect(snapListener).not.toHaveBeenCalled();
    });
});
