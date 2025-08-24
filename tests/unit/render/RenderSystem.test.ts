import { Scene, Camera, PerspectiveCamera, OrthographicCamera } from "three";
import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { RenderSystem, CameraSystem } from "@infrastructure/render";
import { EventBus } from "@core/events/EventBus";

// Helpers para simular requestAnimationFrame
let callbacks: FrameRequestCallback[] = [];
let raf: (cb: FrameRequestCallback) => number;
let caf: (id: number) => void;
let nowTime: number;
let now: () => number;

afterEach(() => {
    RenderSystem.resetInstance();
    CameraSystem.resetInstance();
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
            eventBus: new EventBus(),
            cameraSystem: { getCamera: (): Camera => new Camera() },
        };
        const system1 = RenderSystem.getInstance({}, dependencies);
        const system2 = RenderSystem.getInstance({}, dependencies);
        expect(system1).toBe(system2);
    });

    it("deve retornar as estatísticas corretas do sistema de renderização", () => {
        const renderSystem = RenderSystem.getInstance(
            {},
            {
                raf,
                caf,
                now,
                adapter: { render: vi.fn() },
                scene: new Scene(),
                eventBus: new EventBus(),
                cameraSystem: { getCamera: (): Camera => new Camera() },
            },
        );

        // Estatísticas iniciais
        expect(renderSystem.getStats()).toEqual({
            objectCount: 0,
            renderCount: 0,
            lastRenderTime: 0,
            lastRenderDelta: 0,
            lastRenderFPS: 0,
        });

        // Inicia o sistema
        renderSystem.start();

        // Estatísticas iniciais após o start
        expect(renderSystem.getStats()).toEqual({
            objectCount: 0,
            renderCount: 1,
            lastRenderTime: 0,
            lastRenderDelta: 0,
            lastRenderFPS: 0,
        });

        // Simula um frame
        nowTime = 16;
        callbacks[0]?.(16);

        // Estatísticas após um frame
        expect(renderSystem.getStats()).toEqual({
            objectCount: 0,
            renderCount: 2,
            lastRenderTime: 16,
            lastRenderDelta: 16,
            lastRenderFPS: 62.5,
        });

        // Uma nova chamada sem novo frame não deve alterar as estatísticas
        nowTime = 32;
        expect(renderSystem.getStats()).toEqual({
            objectCount: 0,
            renderCount: 2,
            lastRenderTime: 16,
            lastRenderDelta: 16,
            lastRenderFPS: 62.5,
        });
    });

    it("deve renderizar um frame", () => {
        const renderFn = vi.fn();
        const scene = new Scene();
        const camera = new PerspectiveCamera(75, 1, 0.1, 2000);
        const system = RenderSystem.getInstance(
            {},
            {
                adapter: { render: renderFn },
                scene,
                eventBus: new EventBus(),
                cameraSystem: { getCamera: (): Camera => camera },
            },
        );
        system.renderFrame();
        expect(renderFn).toHaveBeenCalledWith(scene, camera);
    });

    it("deve atualizar a câmera após alterar o modo", () => {
        const eventBus = new EventBus();
        const cameraSystem = CameraSystem.getInstance({}, { eventBus });
        const scene = new Scene();
        const firstCamera = cameraSystem.getCamera();
        const renderFn = vi.fn();
        const renderSystem = RenderSystem.getInstance(
            {},
            { adapter: { render: renderFn }, scene, eventBus, cameraSystem },
        );

        cameraSystem.setMode("ortho");
        const newCamera = cameraSystem.getCamera();

        renderSystem.renderFrame();
        expect(renderFn).toHaveBeenCalledWith(scene, newCamera);
        expect(firstCamera).not.toBe(newCamera);
    });

    it("deve adicionar e remover callbacks de renderização", () => {
        const renderSystem = RenderSystem.getInstance(
            {},
            {
                raf,
                caf,
                now,
                adapter: { render: vi.fn() },
                scene: new Scene(),
                eventBus: new EventBus(),
                cameraSystem: { getCamera: (): Camera => new Camera() },
            },
        );

        const renderCallback = vi.fn();
        renderSystem.addRenderCallback(renderCallback);
        renderSystem.start();

        // Simula um frame
        nowTime = 16;
        callbacks[0]?.(16);

        expect(renderCallback).toHaveBeenCalledWith(16);

        // Remove o callback
        renderSystem.removeRenderCallback(renderCallback);
        nowTime = 32;
        callbacks[0]?.(32);

        // O callback não deve ser chamado novamente
        expect(renderCallback).toHaveBeenCalledTimes(1);
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
        const camera = new PerspectiveCamera(75, 1, 0.1, 2000);
        const system = RenderSystem.getInstance(
            {},
            {
                adapter: { render: renderFn },
                scene,
                cameraSystem: { getCamera: (): Camera => camera },
                eventBus: new EventBus(),
            },
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
                cameraSystem: {
                    getCamera: (): Camera => new OrthographicCamera(-1, 1, 1, -1, 0.1, 2000),
                },
                eventBus: new EventBus(),
            },
        );
        renderSystem.start();
        expect(renderFn).toHaveBeenCalled();
        renderSystem.stop();
        expect(caf).toHaveBeenCalledWith(1);
    });
});
