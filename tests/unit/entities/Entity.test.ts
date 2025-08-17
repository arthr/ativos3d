import { describe, it, expect, beforeEach } from "vitest";
import { Entity } from "@domain/entities";
import type { Component } from "@core/types";

// Componentes de teste
class TestComponent implements Component {
    constructor(
        public readonly type: string,
        public readonly value: string,
    ) {}
}

class TransformComponent implements Component {
    constructor(
        public readonly type: string = "transform",
        public readonly x: number = 0,
        public readonly y: number = 0,
        public readonly z: number = 0,
    ) {}
}

describe("Entity", () => {
    let entity: Entity;
    let testComponent: TestComponent;
    let transformComponent: TransformComponent;

    beforeEach(() => {
        entity = Entity.create("test-entity-1");
        testComponent = new TestComponent("test", "value");
        transformComponent = new TransformComponent("transform", 10, 20, 30);
    });

    describe("Criação", () => {
        it("deve criar uma entidade vazia", () => {
            const newEntity = Entity.create("test-entity-2");

            expect(newEntity.id).toBe("test-entity-2");
            expect(newEntity.components.size).toBe(0);
            expect(newEntity.getComponentTypes()).toEqual([]);
        });

        it("deve criar uma entidade com componentes iniciais", () => {
            const components = [testComponent, transformComponent];
            const newEntity = Entity.createWithComponents("test-entity-3", components);

            expect(newEntity.id).toBe("test-entity-3");
            expect(newEntity.components.size).toBe(2);
            expect(newEntity.hasComponent("test")).toBe(true);
            expect(newEntity.hasComponent("transform")).toBe(true);
        });

        it("deve criar uma entidade com construtor", () => {
            const componentsMap = new Map();
            componentsMap.set("test", testComponent);
            const newEntity = new Entity("test-entity-4", componentsMap);

            expect(newEntity.id).toBe("test-entity-4");
            expect(newEntity.hasComponent("test")).toBe(true);
        });
    });

    describe("Gerenciamento de Componentes", () => {
        it("deve adicionar um componente", () => {
            const newEntity = entity.addComponent(testComponent);

            expect(newEntity).not.toBe(entity); // Imutabilidade
            expect(newEntity.hasComponent("test")).toBe(true);
            expect(entity.hasComponent("test")).toBe(false); // Original não modificado
        });

        it("deve remover um componente", () => {
            const entityWithComponent = entity.addComponent(testComponent);
            const entityWithoutComponent = entityWithComponent.removeComponent("test");

            expect(entityWithoutComponent).not.toBe(entityWithComponent);
            expect(entityWithoutComponent.hasComponent("test")).toBe(false);
            expect(entityWithComponent.hasComponent("test")).toBe(true); // Original não modificado
        });

        it("deve obter um componente específico", () => {
            const entityWithComponent = entity.addComponent(testComponent);
            const retrievedComponent = entityWithComponent.getComponent<TestComponent>("test");

            expect(retrievedComponent).toBe(testComponent);
            expect(retrievedComponent?.value).toBe("value");
        });

        it("deve retornar undefined para componente inexistente", () => {
            const retrievedComponent = entity.getComponent<TestComponent>("inexistent");

            expect(retrievedComponent).toBeUndefined();
        });

        it("deve verificar se possui um componente", () => {
            expect(entity.hasComponent("test")).toBe(false);

            const entityWithComponent = entity.addComponent(testComponent);
            expect(entityWithComponent.hasComponent("test")).toBe(true);
        });

        it("deve obter todos os tipos de componentes", () => {
            const entityWithComponents = entity
                .addComponent(testComponent)
                .addComponent(transformComponent);

            const componentTypes = entityWithComponents.getComponentTypes();

            expect(componentTypes).toContain("test");
            expect(componentTypes).toContain("transform");
            expect(componentTypes.length).toBe(2);
        });

        it("deve obter todos os componentes", () => {
            const entityWithComponents = entity
                .addComponent(testComponent)
                .addComponent(transformComponent);

            const allComponents = entityWithComponents.getAllComponents();

            expect(allComponents).toContain(testComponent);
            expect(allComponents).toContain(transformComponent);
            expect(allComponents.length).toBe(2);
        });
    });

    describe("Verificações de Componentes", () => {
        it("deve verificar se possui todos os componentes especificados", () => {
            const entityWithComponents = entity
                .addComponent(testComponent)
                .addComponent(transformComponent);

            expect(entityWithComponents.hasAllComponents(["test", "transform"])).toBe(true);
            expect(entityWithComponents.hasAllComponents(["test", "inexistent"])).toBe(false);
        });

        it("deve verificar se possui pelo menos um dos componentes especificados", () => {
            const entityWithComponent = entity.addComponent(testComponent);

            expect(entityWithComponent.hasAnyComponent(["test", "transform"])).toBe(true);
            expect(entityWithComponent.hasAnyComponent(["inexistent1", "inexistent2"])).toBe(false);
        });

        it("deve obter múltiplos componentes", () => {
            const entityWithComponents = entity
                .addComponent(testComponent)
                .addComponent(transformComponent);

            const components = entityWithComponents.getComponents<Component>(["test", "transform"]);

            expect(components).toContain(testComponent);
            expect(components).toContain(transformComponent);
            expect(components.length).toBe(2);
        });

        it("deve filtrar componentes inexistentes ao obter múltiplos", () => {
            const entityWithComponent = entity.addComponent(testComponent);

            const components = entityWithComponent.getComponents<Component>(["test", "inexistent"]);

            expect(components).toContain(testComponent);
            expect(components.length).toBe(1);
        });
    });

    describe("Imutabilidade", () => {
        it("deve manter imutabilidade ao adicionar componentes", () => {
            const originalEntity = entity;
            const entityWithComponent = entity.addComponent(testComponent);

            expect(entityWithComponent).not.toBe(originalEntity);
            expect(originalEntity.components.size).toBe(0);
            expect(entityWithComponent.components.size).toBe(1);
        });

        it("deve manter imutabilidade ao remover componentes", () => {
            const entityWithComponent = entity.addComponent(testComponent);
            const entityWithoutComponent = entityWithComponent.removeComponent("test");

            expect(entityWithoutComponent).not.toBe(entityWithComponent);
            expect(entityWithComponent.components.size).toBe(1);
            expect(entityWithoutComponent.components.size).toBe(0);
        });

        it("deve criar cópia profunda dos componentes", () => {
            const entityWithComponent = entity.addComponent(testComponent);
            const clonedEntity = entityWithComponent.clone();

            expect(clonedEntity).not.toBe(entityWithComponent);
            expect(clonedEntity.components).not.toBe(entityWithComponent.components);
            expect(clonedEntity.hasComponent("test")).toBe(true);
        });
    });

    describe("Comparação", () => {
        it("deve verificar igualdade entre entidades", () => {
            const entity1 = Entity.createWithComponents("test-id", [testComponent]);
            const entity2 = Entity.createWithComponents("test-id", [testComponent]);

            expect(entity1.equals(entity2)).toBe(true);
        });

        it("deve detectar diferenças de ID", () => {
            const entity1 = Entity.createWithComponents("id-1", [testComponent]);
            const entity2 = Entity.createWithComponents("id-2", [testComponent]);

            expect(entity1.equals(entity2)).toBe(false);
        });

        it("deve detectar diferenças de componentes", () => {
            const entity1 = Entity.createWithComponents("test-id", [testComponent]);
            const entity2 = Entity.createWithComponents("test-id", [transformComponent]);

            expect(entity1.equals(entity2)).toBe(false);
        });

        it("deve detectar diferenças no número de componentes", () => {
            const entity1 = Entity.createWithComponents("test-id", [testComponent]);
            const entity2 = Entity.createWithComponents("test-id", [
                testComponent,
                transformComponent,
            ]);

            expect(entity1.equals(entity2)).toBe(false);
        });
    });

    describe("Utilitários", () => {
        it("deve converter para string", () => {
            const entityWithComponents = entity
                .addComponent(testComponent)
                .addComponent(transformComponent);

            const stringRepresentation = entityWithComponents.toString();

            expect(stringRepresentation).toBe("Entity(test-entity-1)[test, transform]");
        });

        it("deve converter entidade vazia para string", () => {
            const stringRepresentation = entity.toString();

            expect(stringRepresentation).toBe("Entity(test-entity-1)[]");
        });

        it("deve clonar entidade corretamente", () => {
            const entityWithComponents = entity
                .addComponent(testComponent)
                .addComponent(transformComponent);

            const clonedEntity = entityWithComponents.clone();

            expect(clonedEntity).not.toBe(entityWithComponents);
            expect(clonedEntity.id).toBe(entityWithComponents.id);
            expect(clonedEntity.hasComponent("test")).toBe(true);
            expect(clonedEntity.hasComponent("transform")).toBe(true);
        });
    });

    describe("Casos de Borda", () => {
        it("deve lidar com remoção de componente inexistente", () => {
            const result = entity.removeComponent("inexistent");

            expect(result).not.toBe(entity);
            expect(result.components.size).toBe(0);
        });

        it("deve lidar com adição de componente duplicado", () => {
            const newComponent = new TestComponent("test", "new-value");
            const entityWithComponent = entity.addComponent(testComponent);
            const entityWithNewComponent = entityWithComponent.addComponent(newComponent);

            expect(entityWithNewComponent.getComponent<TestComponent>("test")).toBe(newComponent);
            expect(entityWithComponent.getComponent<TestComponent>("test")).toBe(testComponent);
        });

        it("deve lidar com arrays vazios de tipos de componentes", () => {
            expect(entity.hasAllComponents([])).toBe(true);
            expect(entity.hasAnyComponent([])).toBe(false);
            expect(entity.getComponents([])).toEqual([]);
        });
    });
});
