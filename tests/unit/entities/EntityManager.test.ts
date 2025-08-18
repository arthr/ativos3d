import { describe, it, expect, beforeEach, vi } from "vitest";
import { EntityManager } from "@domain/entities";

describe("EntityManager", () => {
    let entityManager: EntityManager;

    beforeEach(() => {
        // Reset das instâncias singleton
        vi.resetModules();
        EntityManager.resetInstance();

        // Obtém instâncias
        entityManager = EntityManager.getInstance();
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
            // Reseta a instância para garantir estado limpo
            EntityManager.resetInstance();
            const limitedManager = EntityManager.getInstance({ maxEntities: 2 });

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

    describe("Consultas e Filtros", () => {
        beforeEach(() => {
            // Cria entidades de teste
            entityManager.createEntity({ id: "entity1" });
            entityManager.createEntity({ id: "entity2" });
            entityManager.createEntity({ id: "entity3" });
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
            // Reseta a instância para garantir estado limpo
            EntityManager.resetInstance();
            const noCleanupManager = EntityManager.getInstance({ autoCleanup: false });

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
});
