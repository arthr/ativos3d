import { describe, it, expect, vi, afterEach } from "vitest";
import { RenderSystem } from "@infrastructure/render";

afterEach(() => {
    RenderSystem.resetInstance();
    vi.restoreAllMocks();
});

describe("RenderSystem", () => {
    it("deve ser singleton", () => {
        const dependencies = {
            adapter: { render: vi.fn() },
            scene: {},
            camera: {},
        };
        const system1 = RenderSystem.getInstance(dependencies);
        const system2 = RenderSystem.getInstance(dependencies);
        expect(system1).toBe(system2);
    });

    it("deve renderizar um frame", () => {
        const renderFn = vi.fn();
        const system = RenderSystem.getInstance({
            adapter: { render: renderFn },
            scene: {},
            camera: {},
        });
        system.render();
        expect(renderFn).toHaveBeenCalledWith({}, {});
    });

    it("deve iniciar e parar o loop de renderização", () => {
        const renderFn = vi.fn();
        const requestSpy = vi
            .spyOn(globalThis, "requestAnimationFrame")
            .mockImplementation(() => 1);
        const cancelSpy = vi
            .spyOn(globalThis, "cancelAnimationFrame")
            .mockImplementation(() => undefined);
        const system = RenderSystem.getInstance({
            adapter: { render: renderFn },
            scene: {},
            camera: {},
        });

        system.start();
        expect(renderFn).toHaveBeenCalled();
        expect(requestSpy).toHaveBeenCalled();

        system.stop();
        expect(cancelSpy).toHaveBeenCalledWith(1);
    });
});
