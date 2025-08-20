import { describe, it, expect, beforeEach, vi } from "vitest";
import { EntityManager } from "@domain/entities";
import { EventBus } from "@core/events/EventBus";
import { ComponentSystem } from "@domain/components";
import type { Component } from "@core/types";

class TestComponent implements Component {
    constructor(public readonly type: string = "test") {}
}

class OtherComponent implements Component {
    constructor(public readonly type: string = "other") {}
}

describe("EntityManager", () => {
    let entityManager: EntityManager;
    let mockEventBus: EventBus;

    beforeEach(() => {
        // Reset das instâncias singleton
        vi.resetModules();
        EntityManager.resetInstance();
        mockEventBus = new EventBus();
        mockEventBus.clearAll();

        // Obtém instâncias
        entityManager = EntityManager.getInstance(undefined, {
            eventBus: mockEventBus,
            componentSystem: ComponentSystem.getInstance(),
        });
    });

    describe("Singleton Pattern", () => {
        it("deve retornar a mesma instância", () => {
            const instance1 = EntityManager.getInstance(undefined, {
                eventBus: mockEventBus,
                componentSystem: ComponentSystem.getInstance(),
            });
            const instance2 = EntityManager.getInstance(undefined, {
                eventBus: mockEventBus,
                componentSystem: ComponentSystem.getInstance(),
            });
            expect(instance1).toBe(instance2);
        });
    });

    describe("Criação de Entidades", () => {
        it("deve criar uma entidade vazia", () => {
            const entity = entityManager.createEntity();

            expect(entity).toBeDefined();
            expect(entity.id).toMatch(/^entity_\d+_\d+$/);
            expect(entityManager.hasEntity(entity.id)).toBe(true);
        });

        it("deve criar uma entidade com ID específico", () => {
            const entity = entityManager.createEntity({ id: "test-entity" });

            expect(entity.id).toBe("test-entity");
            expect(entityManager.hasEntity("test-entity")).toBe(true);
        });

        it("deve lançar erro ao criar entidade com ID duplicado", () => {
            entityManager.createEntity({ id: "duplicate" });

            expect(() => {
                entityManager.createEntity({ id: "duplicate" });
            }).toThrow("Entidade com ID duplicate já existe");
        });

        it("deve respeitar limite máximo de entidades", () => {
            // Resetar instância para testar limite máximo de entidades (motivo: singleton)
            EntityManager.resetInstance();
            const customBus = new EventBus();
            const limitedManager = EntityManager.getInstance(
                { maxEntities: 2 },
                {
                    eventBus: customBus,
                    componentSystem: ComponentSystem.getInstance(),
                },
            );

            limitedManager.createEntity({ id: "entity1" });
            limitedManager.createEntity({ id: "entity2" });

            expect(() => {
                limitedManager.createEntity({ id: "entity3" });
            }).toThrow("Limite máximo de entidades atingido: 2");
        });
    });

    describe("Destruição de Entidades", () => {
        it("deve destruir uma entidade existente", () => {
            entityManager.createEntity({ id: "to-destroy" });
            expect(entityManager.hasEntity("to-destroy")).toBe(true);

            const result = entityManager.destroyEntity("to-destroy");
            expect(result).toBe(true);
            expect(entityManager.hasEntity("to-destroy")).toBe(false);
        });

        it("deve retornar false ao tentar destruir entidade inexistente", () => {
            const result = entityManager.destroyEntity("inexistent");
            expect(result).toBe(false);
        });
    });

    describe("Gerenciamento de Componentes", () => {
        it("deve adicionar componente e atualizar estado", () => {
            const entity = entityManager.createEntity({ id: "comp1" });
            const component = new TestComponent();
            const emitSpy = vi.spyOn(mockEventBus, "emit");

            entityManager.addComponent(entity.id, component);

            const updated = entityManager.getEntity(entity.id);
            expect(updated?.hasComponent(component.type)).toBe(true);
            expect(emitSpy).toHaveBeenCalledWith("componentAdded", {
                entityId: entity.id,
                component,
            });
            expect(emitSpy).toHaveBeenCalledWith("entityUpdated", {
                entityId: entity.id,
            });

            emitSpy.mockRestore();
        });

        it("deve remover componente e atualizar estado", () => {
            const entity = entityManager.createEntity({ id: "comp2" });
            const component = new TestComponent();
            entityManager.addComponent(entity.id, component);
            const emitSpy = vi.spyOn(mockEventBus, "emit");

            entityManager.removeComponent(entity.id, component.type);

            const updated = entityManager.getEntity(entity.id);
            expect(updated?.hasComponent(component.type)).toBe(false);
            expect(emitSpy).toHaveBeenCalledWith("componentRemoved", {
                entityId: entity.id,
                componentType: component.type,
            });
            expect(emitSpy).toHaveBeenCalledWith("entityUpdated", {
                entityId: entity.id,
            });

            emitSpy.mockRestore();
        });
    });

    describe("Consultas e Filtros", () => {
        beforeEach(() => {
            // Cria entidades de teste
            const e1 = entityManager.createEntity({ id: "entity1" });
            entityManager.addComponent(e1.id, new TestComponent());
            entityManager.addComponent(e1.id, new OtherComponent());

            const e2 = entityManager.createEntity({ id: "entity2" });
            entityManager.addComponent(e2.id, new TestComponent());

            const e3 = entityManager.createEntity({ id: "entity3" });
            entityManager.addComponent(e3.id, new OtherComponent());
        });

        it("deve retornar todas as entidades", () => {
            const result = entityManager.queryEntities();
            expect(result.entities).toHaveLength(3);
            expect(result.count).toBe(3);
            expect(result.totalCount).toBe(3);
        });

        it("deve filtrar por ID específico", () => {
            const result = entityManager.queryEntities({ id: "entity1" });
            expect(result.entities).toHaveLength(1);
            expect(result.entities[0]?.id).toBe("entity1");
        });

        it("deve filtrar por múltiplos IDs", () => {
            const result = entityManager.queryEntities({ ids: ["entity1", "entity2"] });
            expect(result.entities).toHaveLength(2);
            expect(result.entities.map((e) => e.id)).toContain("entity1");
            expect(result.entities.map((e) => e.id)).toContain("entity2");
        });

        it("deve filtra por tipos de componentes", () => {
            const result = entityManager.queryEntities({ componentTypes: ["test"] });
            expect(result.entities.map((e) => e.id)).toContain("entity1");
            expect(result.entities.map((e) => e.id)).toContain("entity2");
            expect(result.count).toBe(2);
        });

        it("deve filtrar por múltiplos tipos de componentes", () => {
            const result = entityManager.queryEntities({ componentTypes: ["test", "other"] });
            expect(result.entities).toHaveLength(1);
            expect(result.entities[0]?.id).toBe("entity1");
        });

        it("deve excluir tipos de componentes específicos", () => {
            const result = entityManager.queryEntities({ excludeComponentTypes: ["other"] });
            expect(result.entities).toHaveLength(1);
            expect(result.entities[0]?.id).toBe("entity2");
        });
    });

    describe("Estatísticas", () => {
        beforeEach(() => {
            entityManager.createEntity({ id: "entity1" });
            entityManager.createEntity({ id: "entity2" });
        });

        it("deve retornar estatísticas corretas", () => {
            const stats = entityManager.getStats();

            expect(stats.totalEntities).toBe(2);
            expect(stats.memoryUsage).toBeGreaterThan(0);
        });

        it("deve retornar informações de entidade específica", () => {
            const info = entityManager.getEntityInfo("entity1");

            expect(info).toBeDefined();
            expect(info?.id).toBe("entity1");
            expect(info?.componentCount).toBe(0);
            expect(info?.createdAt).toBeGreaterThan(0);
            expect(info?.lastModified).toBeGreaterThan(0);
        });

        it("deve retornar undefined para entidade inexistente", () => {
            const info = entityManager.getEntityInfo("inexistent");
            expect(info).toBeUndefined();
        });
    });

    describe("Limpeza e Manutenção", () => {
        it("deve limpar todas as entidades", () => {
            entityManager.createEntity({ id: "entity1" });
            entityManager.createEntity({ id: "entity2" });

            expect(entityManager.getAllEntities()).toHaveLength(2);

            entityManager.clear();
            expect(entityManager.getAllEntities()).toHaveLength(0);
        });

        it("deve limpar entidades órfãs (sem componentes)", () => {
            entityManager.createEntity({ id: "orphan" }); // Sem componentes

            expect(entityManager.getAllEntities()).toHaveLength(1);

            const removedCount = entityManager.cleanup();
            expect(removedCount).toBe(1);
            expect(entityManager.getAllEntities()).toHaveLength(0);
        });

        it("deve não limpar entidades órfãs quando autoCleanup está desabilitado", () => {
            // Resetar instância para testar autoCleanup (motivo: singleton)
            EntityManager.resetInstance();
            const customBus = new EventBus();
            const noCleanupManager = EntityManager.getInstance(
                { autoCleanup: false },
                {
                    eventBus: customBus,
                    componentSystem: ComponentSystem.getInstance(),
                },
            );

            noCleanupManager.createEntity({ id: "orphan" });
            expect(noCleanupManager.getAllEntities()).toHaveLength(1);

            const removedCount = noCleanupManager.cleanup();
            expect(removedCount).toBe(0);
            expect(noCleanupManager.getAllEntities()).toHaveLength(1);
        });
    });

    describe("Casos de Borda", () => {
        it("deve lidar com entidades vazias", () => {
            expect(entityManager.getAllEntities()).toHaveLength(0);
            expect(entityManager.getAllEntityIds()).toHaveLength(0);

            const result = entityManager.queryEntities();
            expect(result.entities).toHaveLength(0);
            expect(result.count).toBe(0);
            expect(result.totalCount).toBe(0);
        });

        it("deve lidar com consultas com filtros vazios", () => {
            entityManager.createEntity({ id: "test" });

            const result = entityManager.queryEntities({});
            expect(result.entities).toHaveLength(1);
        });

        it("deve manter IDs únicos entre instâncias", () => {
            const entity1 = entityManager.createEntity();
            const entity2 = entityManager.createEntity();

            expect(entity1.id).not.toBe(entity2.id);
        });
    });

    describe("Eventos", () => {
        it("emite componentAdded e entityUpdated ao adicionar componente", () => {
            const entity = entityManager.createEntity({ id: "e1" });
            const component = new TestComponent();
            const addedSpy = vi.fn();
            const updatedSpy = vi.fn();
            const unsubAdded = mockEventBus.on("componentAdded", addedSpy);
            const unsubUpdated = mockEventBus.on("entityUpdated", updatedSpy);

            entityManager.addComponent(entity.id, component);

            expect(addedSpy).toHaveBeenCalledWith({ entityId: entity.id, component });
            expect(updatedSpy).toHaveBeenCalledWith({ entityId: entity.id });

            unsubAdded();
            unsubUpdated();
        });

        it("emite componentRemoved e entityUpdated ao remover componente", () => {
            const entity = entityManager.createEntity({ id: "e2" });
            const component = new TestComponent();
            entityManager.addComponent(entity.id, component);
            const removedSpy = vi.fn();
            const updatedSpy = vi.fn();
            const unsubRemoved = mockEventBus.on("componentRemoved", removedSpy);
            const unsubUpdated = mockEventBus.on("entityUpdated", updatedSpy);

            entityManager.removeComponent(entity.id, component.type);

            expect(removedSpy).toHaveBeenCalledWith({
                entityId: entity.id,
                componentType: component.type,
            });
            expect(updatedSpy).toHaveBeenCalledWith({ entityId: entity.id });

            unsubRemoved();
            unsubUpdated();
        });
    });
});
