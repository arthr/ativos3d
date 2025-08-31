import { describe, it, expect, beforeEach, vi } from "vitest";
import { Application } from "@/Application";
import { EventBus } from "@core/events/EventBus";
import { CommandStack } from "@core/commands";
import { EntityManager } from "@domain/entities";
import { CameraSystem } from "@infrastructure/render";
import { InputManager } from "@infrastructure/input";

describe("Application", () => {
    beforeEach(() => {
        EntityManager.resetInstance();
        // RenderObjectManager removido no caminho R3F-only
        CameraSystem.resetInstance();
    });

    it("deve criar uma instância da aplicação", () => {
        const eventBus = new EventBus();
        const application = new Application(eventBus);
        expect(application).toBeDefined();
    });

    it("inicializa sistemas principais sem erros", () => {
        const eventBus = new EventBus();
        const application = new Application(eventBus, { width: 800, height: 600 });
        expect(application.resolve("eventBus")).toBeInstanceOf(EventBus);
        expect(application.resolve("commandStack")).toBeInstanceOf(CommandStack);
        expect(application.resolve("entityManager")).toBeInstanceOf(EntityManager);
        expect(application.resolve("inputManager")).toBeInstanceOf(InputManager);
    });

    it("deve lançar erro se dependência não encontrada", () => {
        const eventBus = new EventBus();
        const application = new Application(eventBus, { width: 800, height: 600 });
        // @ts-expect-error - Testando comportamento com chave inválida
        expect(() => application.resolve("invalidDependency")).toThrow(
            "Dependência não encontrada: invalidDependency",
        );
    });

    it("remove listeners no dispose", () => {
        const eventBus = new EventBus();
        const application = new Application(eventBus, { width: 800, height: 600 });
        expect(eventBus.listenerCount("componentAdded")).toBe(0);
        expect(eventBus.listenerCount("componentRemoved")).toBe(0);
        expect(eventBus.listenerCount("entityDestroyed")).toBe(0);
        expect(eventBus.listenerCount("cameraModeChanged")).toBe(1);

        const inputManager = application.resolve("inputManager");
        const disposeSpy = vi.spyOn(inputManager, "dispose");
        application.dispose();
        expect(disposeSpy).toHaveBeenCalled();
        expect(eventBus.listenerCount("componentAdded")).toBe(0);
        expect(eventBus.listenerCount("componentRemoved")).toBe(0);
        expect(eventBus.listenerCount("entityDestroyed")).toBe(0);
        expect(eventBus.listenerCount("cameraModeChanged")).toBe(0);
    });
});
