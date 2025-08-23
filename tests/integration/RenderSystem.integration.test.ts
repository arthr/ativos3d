import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { EventBus } from "@core/events/EventBus";

describe("RenderSystem integration", () => {
    beforeEach(() => {
        vi.resetModules();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("inicializa com adaptador real", async () => {
        const renderFn = vi.fn();
        vi.doMock("three", async () => {
            const actual = await vi.importActual<typeof import("three")>("three");
            return { ...actual, WebGLRenderer: vi.fn(() => ({ render: renderFn })) };
        });

        const { Application } = await import("@/Application");
        const { RenderSystem } = await import("@infrastructure/render");
        RenderSystem.resetInstance();

        const eventBus = new EventBus();
        const app = new Application(eventBus);
        const renderSystem = app.resolve("renderSystem");

        renderSystem.renderFrame();
        expect(renderFn).toHaveBeenCalled();
    });
});
