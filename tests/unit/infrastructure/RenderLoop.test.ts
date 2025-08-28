import { describe, it, expect, vi } from "vitest";
import { RenderLoop } from "@infrastructure/render";

describe("RenderLoop", () => {
    it("chama callbacks e atualiza métricas", () => {
        const loop = new RenderLoop();
        const cb = vi.fn();
        loop.addCallback(cb);

        loop.tick(0.016);

        expect(cb).toHaveBeenCalledTimes(1);
        expect(cb).toHaveBeenCalledWith(0.016);
        const stats = loop.getStats();
        expect(stats.renderCount).toBe(1);
        expect(stats.lastRenderDelta).toBeCloseTo(0.016, 5);
        expect(stats.lastRenderFPS).toBeGreaterThan(60 - 5);
    });

    it("remove callback e não chama novamente", () => {
        const loop = new RenderLoop();
        const cb = vi.fn();
        loop.addCallback(cb);
        loop.removeCallback(cb);

        loop.tick(0.02);

        expect(cb).not.toHaveBeenCalled();
        const stats = loop.getStats();
        expect(stats.renderCount).toBe(1);
    });
});

