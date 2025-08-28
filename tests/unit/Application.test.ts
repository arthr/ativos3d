import { describe, it, expect, beforeEach } from "vitest";
import { Application } from "@/Application";
import { EventBus } from "@core/events/EventBus";
import { CommandStack } from "@core/commands";
import { EntityManager } from "@domain/entities";
import { RenderObjectManager, CameraSystem } from "@infrastructure/render";

describe("Application", () => {
    beforeEach(() => {
        EntityManager.resetInstance();
        RenderObjectManager.resetInstance();
        CameraSystem.resetInstance();
    });

    it("deve criar uma instância da aplicação", () => {
        const eventBus = new EventBus();
        const application = new Application(eventBus);
        expect(application).toBeDefined();
    });

    it("inicializa sistemas principais sem erros", () => {
        const eventBus = new EventBus();
        const application = new Application(eventBus);
        expect(application.resolve("eventBus")).toBeInstanceOf(EventBus);
        expect(application.resolve("commandStack")).toBeInstanceOf(CommandStack);
        expect(application.resolve("entityManager")).toBeInstanceOf(EntityManager);
    });

    it("deve lançar erro se dependência não encontrada", () => {
        const eventBus = new EventBus();
        const application = new Application(eventBus);
        // @ts-expect-error - Testando comportamento com chave inválida
        expect(() => application.resolve("invalidDependency")).toThrow(
            "Dependência não encontrada: invalidDependency",
        );
    });

    it("remove listeners no dispose", () => {
        const eventBus = new EventBus();
        const application = new Application(eventBus);
        expect(eventBus.listenerCount("componentAdded")).toBe(0);
        expect(eventBus.listenerCount("componentRemoved")).toBe(0);
        expect(eventBus.listenerCount("entityDestroyed")).toBe(0);
        expect(eventBus.listenerCount("cameraModeChanged")).toBe(1);

        application.dispose();

        expect(eventBus.listenerCount("componentAdded")).toBe(0);
        expect(eventBus.listenerCount("componentRemoved")).toBe(0);
        expect(eventBus.listenerCount("entityDestroyed")).toBe(0);
        expect(eventBus.listenerCount("cameraModeChanged")).toBe(0);
    });
});
