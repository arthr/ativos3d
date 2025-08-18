import { describe, it, expect, beforeEach, vi } from "vitest";
import { EntityManager } from "@domain/entities";
import { ComponentSystem } from "@domain/components";
import { TestComponent } from "@domain/components/examples/TestComponent";
import { EventBus } from "@core/events/EventBus";

describe("EntityManager", () => {
    let entityManager: EntityManager;
    let componentSystem: ComponentSystem;
    let eventBus: EventBus;

    beforeEach(() => {
        // Reset das instâncias singleton
        vi.resetModules();

        // Obtém instâncias
        entityManager = EntityManager.getInstance();
        componentSystem = ComponentSystem.getInstance();
        eventBus = EventBus.getInstance();

        // Registra componente de teste
        componentSystem.registerComponentFactory("TestComponent", (data) => {
            return TestComponent.create(data);
        });

        // Limpa entidades existentes
        entityManager.clear();
    });

    describe("Singleton Pattern", () => {
        it("deve retornar a mesma instância", () => {
            const instance1 = EntityManager.getInstance();
            const instance2 = EntityManager.getInstance();
            expect(instance1).toBe(instance2);
        });
    });

    describe("Criação de Entidades", () => {
        it("deve criar uma entidade vazia", () => {
            const entity = entityManager.createEntity();

            expect(entity).toBeDefined();
            expect(entity.id).toMatch(/^entity_\d+_\d+$/);
            expect(entity.getComponentTypes()).toHaveLength(0);
            expect(entityManager.hasEntity(entity.id)).toBe(true);
        });

        it("deve criar uma entidade com ID específico", () => {
            const entity = entityManager.createEntity({ id: "test-entity" });

            expect(entity.id).toBe("test-entity");
            expect(entityManager.hasEntity("test-entity")).toBe(true);
        });

        it("deve criar uma entidade com componentes", () => {
            const entity = entityManager.createEntity({
                components: [
                    {
                        type: "TestComponent",
                        data: {
                            value: "test-value",
                            position: { x: 0, y: 0, z: 0 },
                            enabled: true,
                        },
                    },
                ],
            });

            expect((entity as any).getComponentTypes()).toContain("TestComponent");
            const component = (entity as any).getComponent<TestComponent>("TestComponent");
            expect(component).toBeDefined();
            expect(component?.value).toBe("test-value");
        });

        it("deve lançar erro ao criar entidade com ID duplicado", () => {
            entityManager.createEntity({ id: "duplicate" });

            expect(() => {
                entityManager.createEntity({ id: "duplicate" });
            }).toThrow("Entidade com ID duplicate já existe");
        });

        it("deve respeitar limite máximo de entidades", () => {
            const limitedManager = EntityManager.getInstance({ maxEntities: 2 });
            limitedManager.clear();

            limitedManager.createEntity({ id: "entity1" });
            limitedManager.createEntity({ id: "entity2" });

            expect(() => {
                limitedManager.createEntity({ id: "entity3" });
            }).toThrow("Limite máximo de entidades atingido: 2");
        });
    });

    describe("Destruição de Entidades", () => {
        it("deve destruir uma entidade existente", () => {
            const entity = entityManager.createEntity({ id: "to-destroy" });
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
        it("deve adicionar componente a uma entidade", () => {
            const entity = entityManager.createEntity({ id: "test" });
            const component = TestComponent.create({
                value: "added-value",
                position: { x: 0, y: 0, z: 0 },
                enabled: true,
            });

            const updatedEntity = entityManager.addComponent("test", component);
            expect(updatedEntity).toBeDefined();
            expect((updatedEntity as any).getComponentTypes()).toContain("TestComponent");
            expect((updatedEntity as any).getComponent<TestComponent>("TestComponent")?.value).toBe(
                "added-value",
            );
        });

        it("deve retornar undefined ao adicionar componente a entidade inexistente", () => {
            const component = new TestComponent({ value: 100, name: "test" });
            const result = entityManager.addComponent("inexistent", component);
            expect(result).toBeUndefined();
        });

        it("deve remover componente de uma entidade", () => {
            const entity = entityManager.createEntity({
                id: "test",
                components: [{ type: "TestComponent", data: { value: 50, name: "test" } }],
            });

            const updatedEntity = entityManager.removeComponent("test", "TestComponent");
            expect(updatedEntity).toBeDefined();
            expect(updatedEntity?.getComponentTypes()).not.toContain("TestComponent");
        });

        it("deve retornar undefined ao remover componente de entidade inexistente", () => {
            const result = entityManager.removeComponent("inexistent", "TestComponent");
            expect(result).toBeUndefined();
        });
    });

    describe("Consultas e Filtros", () => {
        beforeEach(() => {
            // Cria entidades de teste
            entityManager.createEntity({
                id: "entity1",
                components: [{ type: "TestComponent", data: { value: 1, name: "first" } }],
            });

            entityManager.createEntity({
                id: "entity2",
                components: [{ type: "TestComponent", data: { value: 2, name: "second" } }],
            });

            entityManager.createEntity({
                id: "entity3",
                components: [],
            });
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
            expect(result.entities[0].id).toBe("entity1");
        });

        it("deve filtrar por múltiplos IDs", () => {
            const result = entityManager.queryEntities({ ids: ["entity1", "entity2"] });
            expect(result.entities).toHaveLength(2);
            expect(result.entities.map((e) => e.id)).toContain("entity1");
            expect(result.entities.map((e) => e.id)).toContain("entity2");
        });

        it("deve filtrar por tipos de componentes obrigatórios", () => {
            const result = entityManager.queryEntities({ componentTypes: ["TestComponent"] });
            expect(result.entities).toHaveLength(2);
            expect(result.entities.every((e) => e.hasComponent("TestComponent"))).toBe(true);
        });

        it("deve filtrar excluindo tipos de componentes", () => {
            const result = entityManager.queryEntities({
                excludeComponentTypes: ["TestComponent"],
            });
            expect(result.entities).toHaveLength(1);
            expect(result.entities[0].id).toBe("entity3");
        });

        it("deve obter entidades com componente específico", () => {
            const entities = entityManager.getEntitiesWithComponent("TestComponent");
            expect(entities).toHaveLength(2);
            expect(entities.every((e) => e.hasComponent("TestComponent"))).toBe(true);
        });

        it("deve obter entidades com múltiplos componentes", () => {
            const entities = entityManager.getEntitiesWithComponents(["TestComponent"]);
            expect(entities).toHaveLength(2);
            expect(entities.every((e) => e.hasComponent("TestComponent"))).toBe(true);
        });
    });

    describe("Estatísticas", () => {
        beforeEach(() => {
            entityManager.createEntity({
                id: "entity1",
                components: [{ type: "TestComponent", data: { value: 1, name: "first" } }],
            });

            entityManager.createEntity({
                id: "entity2",
                components: [{ type: "TestComponent", data: { value: 2, name: "second" } }],
            });
        });

        it("deve retornar estatísticas corretas", () => {
            const stats = entityManager.getStats();

            expect(stats.totalEntities).toBe(2);
            expect(stats.componentTypes).toContain("TestComponent");
            expect(stats.entitiesByComponentType.get("TestComponent")).toBe(2);
            expect(stats.memoryUsage).toBeGreaterThan(0);
        });

        it("deve retornar informações de entidade específica", () => {
            const info = entityManager.getEntityInfo("entity1");

            expect(info).toBeDefined();
            expect(info?.id).toBe("entity1");
            expect(info?.componentCount).toBe(1);
            expect(info?.componentTypes).toContain("TestComponent");
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
            entityManager.createEntity({
                id: "with-components",
                components: [{ type: "TestComponent", data: { value: 1, name: "test" } }],
            });

            expect(entityManager.getAllEntities()).toHaveLength(2);

            const removedCount = entityManager.cleanup();
            expect(removedCount).toBe(1);
            expect(entityManager.getAllEntities()).toHaveLength(1);
            expect(entityManager.hasEntity("with-components")).toBe(true);
            expect(entityManager.hasEntity("orphan")).toBe(false);
        });

        it("deve não limpar entidades órfãs quando autoCleanup está desabilitado", () => {
            const noCleanupManager = EntityManager.getInstance({ autoCleanup: false });
            noCleanupManager.clear();

            noCleanupManager.createEntity({ id: "orphan" });
            expect(noCleanupManager.getAllEntities()).toHaveLength(1);

            const removedCount = noCleanupManager.cleanup();
            expect(removedCount).toBe(0);
            expect(noCleanupManager.getAllEntities()).toHaveLength(1);
        });
    });

    describe("Eventos", () => {
        it("deve emitir evento entityCreated ao criar entidade", () => {
            const listener = vi.fn();
            eventBus.on("entityCreated", listener);

            const entity = entityManager.createEntity({ id: "test-event" });

            expect(listener).toHaveBeenCalledWith({ entity });
        });

        it("deve emitir evento entityDestroyed ao destruir entidade", () => {
            const entity = entityManager.createEntity({ id: "test-destroy" });
            const listener = vi.fn();
            eventBus.on("entityDestroyed", listener);

            entityManager.destroyEntity("test-destroy");

            expect(listener).toHaveBeenCalledWith({ entityId: "test-destroy" });
        });

        it("deve emitir eventos ao adicionar componente", () => {
            const entity = entityManager.createEntity({ id: "test-component" });
            const component = new TestComponent({ value: 100, name: "test" });

            const createdListener = vi.fn();
            const updatedListener = vi.fn();
            eventBus.on("componentAdded", createdListener);
            eventBus.on("entityUpdated", updatedListener);

            entityManager.addComponent("test-component", component);

            expect(createdListener).toHaveBeenCalledWith({
                entity: expect.any(Object),
                component,
            });
            expect(updatedListener).toHaveBeenCalledWith({
                entity: expect.any(Object),
            });
        });

        it("deve emitir eventos ao remover componente", () => {
            const entity = entityManager.createEntity({
                id: "test-remove",
                components: [{ type: "TestComponent", data: { value: 1, name: "test" } }],
            });

            const removedListener = vi.fn();
            const updatedListener = vi.fn();
            eventBus.on("componentRemoved", removedListener);
            eventBus.on("entityUpdated", updatedListener);

            entityManager.removeComponent("test-remove", "TestComponent");

            expect(removedListener).toHaveBeenCalledWith({
                entity: expect.any(Object),
                componentType: "TestComponent",
            });
            expect(updatedListener).toHaveBeenCalledWith({
                entity: expect.any(Object),
            });
        });

        it("deve não emitir eventos quando eventos estão desabilitados", () => {
            const noEventsManager = EntityManager.getInstance({ enableEvents: false });
            noEventsManager.clear();

            const listener = vi.fn();
            eventBus.on("entityCreated", listener);

            noEventsManager.createEntity({ id: "no-event" });

            expect(listener).not.toHaveBeenCalled();
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

        it("deve lidar com múltiplas operações na mesma entidade", () => {
            const entity = entityManager.createEntity({ id: "multi-op" });
            const component1 = new TestComponent({ value: 1, name: "first" });
            const component2 = new TestComponent({ value: 2, name: "second" });

            entityManager.addComponent("multi-op", component1);
            entityManager.addComponent("multi-op", component2);
            entityManager.removeComponent("multi-op", "TestComponent");

            const finalEntity = entityManager.getEntity("multi-op");
            expect(finalEntity?.getComponentTypes()).toHaveLength(0);
        });

        it("deve manter IDs únicos entre instâncias", () => {
            const entity1 = entityManager.createEntity();
            const entity2 = entityManager.createEntity();

            expect(entity1.id).not.toBe(entity2.id);
        });
    });
});
