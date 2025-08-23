import { Scene, Camera } from "three";
import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { RenderSystem } from "@infrastructure/render";

// Helpers para simular requestAnimationFrame
let callbacks: FrameRequestCallback[] = [];
let raf: (cb: FrameRequestCallback) => number;
let caf: (id: number) => void;
let nowTime: number;
let now: () => number;

afterEach(() => {
    RenderSystem.resetInstance();
    vi.restoreAllMocks();
});

describe("RenderSystem", () => {
    beforeEach(() => {
        callbacks = [];
        raf = (cb): number => {
            callbacks.push(cb);
            return callbacks.length;
        };
        caf = vi.fn();
        nowTime = 0;
        now = (): number => nowTime;
    });

    it("deve ser singleton", () => {
        const dependencies = {
            adapter: { render: vi.fn() },
            scene: new Scene(),
            camera: new Camera(),
        };
        const system1 = RenderSystem.getInstance({}, dependencies);
        const system2 = RenderSystem.getInstance({}, dependencies);
        expect(system1).toBe(system2);
    });

    it("deve renderizar um frame", () => {
        const renderFn = vi.fn();
        const scene = new Scene();
        const camera = new Camera();
        const system = RenderSystem.getInstance(
            {},
            { adapter: { render: renderFn }, scene, camera },
        );
        system.onRender(() => {});
        expect(renderFn).toHaveBeenCalledWith(scene, camera);
    });

    it("deve iniciar e executar callbacks de renderização", () => {
        const renderSystem = RenderSystem.getInstance(
            {},
            {
                raf,
                caf,
                now,
                adapter: { render: vi.fn() },
                scene: new Scene(),
                camera: new Camera(),
            },
        );
        const renderCallback = vi.fn();
        renderSystem.onRender(renderCallback);
        renderSystem.start();

        // Simula um frame
        nowTime = 16;
        callbacks[0]?.(16);

        expect(renderCallback).toHaveBeenCalledWith(16);
    });

    it("deve iniciar e parar o loop de renderização", () => {
        const renderFn = vi.fn();
        const requestSpy = vi
            .spyOn(globalThis, "requestAnimationFrame")
            .mockImplementation(() => 1);
        const cancelSpy = vi
            .spyOn(globalThis, "cancelAnimationFrame")
            .mockImplementation(() => undefined);
        const scene = new Scene();
        const camera = new Camera();
        const system = RenderSystem.getInstance(
            {},
            { adapter: { render: renderFn }, scene, camera },
        );

        system.start();
        expect(renderFn).toHaveBeenCalled();
        expect(requestSpy).toHaveBeenCalled();

        system.stop();
        expect(cancelSpy).toHaveBeenCalledWith(1);
    });

    it("deve parar o loop de renderização", () => {
        const renderFn = vi.fn();
        const renderSystem = RenderSystem.getInstance(
            {},
            {
                raf,
                caf,
                now,
                adapter: { render: renderFn },
                scene: new Scene(),
                camera: new Camera(),
            },
        );
        renderSystem.start();
        expect(renderFn).toHaveBeenCalled();
        renderSystem.stop();
        expect(caf).toHaveBeenCalledWith(1);
    });
});
