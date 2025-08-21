import { describe, it, expect, beforeEach } from "vitest";
import { Application } from "@/Application";
import { EventBus } from "@core/events/EventBus";
import { CommandStack } from "@core/commands";
import { EntityManager } from "@domain/entities";

describe("Application", () => {
    beforeEach(() => {
        EntityManager.resetInstance();
    });

    it("deve criar uma instância da aplicação", () => {
        const application = new Application();
        expect(application).toBeDefined();
    });

    it("inicializa sistemas principais sem erros", () => {
        const application = new Application();
        expect(application.resolve("eventBus")).toBeInstanceOf(EventBus);
        expect(application.resolve("commandStack")).toBeInstanceOf(CommandStack);
        expect(application.resolve("entityManager")).toBeInstanceOf(EntityManager);
    });

    it("deve lançar erro se dependência não encontrada", () => {
        const application = new Application();
        // @ts-expect-error - Testando comportamento com chave inválida
        expect(() => application.resolve("invalidDependency")).toThrow(
            "Dependência não encontrada: invalidDependency",
        );
    });

    it("é instanciada em index.ts", async () => {
        const { application } = await import("@/index");
        expect(application).toBeInstanceOf(Application);
    });
});
