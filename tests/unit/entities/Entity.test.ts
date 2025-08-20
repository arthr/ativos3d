import { describe, it, expect, beforeEach } from "vitest";
import { Entity } from "@domain/entities";
import { TransformComponent, RenderComponent } from "@domain/components";
import type { Component } from "@core/types";

describe("Entity", () => {
    let entity: Entity;
    let renderComponent: RenderComponent;
    let transformComponent: TransformComponent;

    beforeEach(() => {
        entity = Entity.create("test-entity-1");
        renderComponent = new RenderComponent();
        transformComponent = new TransformComponent();
    });

    describe("Criação", () => {
        it("deve criar uma entidade vazia", () => {
            const newEntity = Entity.create("test-entity-2");

            expect(newEntity.id).toBe("test-entity-2");
            expect(newEntity.components.size).toBe(0);
            expect(newEntity.getComponentTypes()).toEqual([]);
        });

        it("deve criar uma entidade com componentes iniciais", () => {
            const components = [renderComponent, transformComponent];
            const newEntity = Entity.createWithComponents("test-entity-3", components);

            expect(newEntity.id).toBe("test-entity-3");
            expect(newEntity.components.size).toBe(2);
            expect(newEntity.hasComponent("RenderComponent")).toBe(true);
            expect(newEntity.hasComponent("TransformComponent")).toBe(true);
        });

        it("deve criar uma entidade com construtor", () => {
            const componentsMap = new Map();
            componentsMap.set("test", renderComponent);
            const newEntity = new Entity("test-entity-4", componentsMap);

            expect(newEntity.id).toBe("test-entity-4");
            expect(newEntity.hasComponent("test")).toBe(true);
        });
    });

    describe("Gerenciamento de Componentes", () => {
        it("deve adicionar um componente", () => {
            const newEntity = entity.addComponent(renderComponent);

            expect(newEntity).not.toBe(entity); // Imutabilidade
            expect(newEntity.hasComponent("RenderComponent")).toBe(true);
            expect(entity.hasComponent("RenderComponent")).toBe(false); // Original não modificado
        });

        it("deve remover um componente", () => {
            const entityWithComponent = entity.addComponent(renderComponent);
            const entityWithoutComponent = entityWithComponent.removeComponent("RenderComponent");

            expect(entityWithoutComponent).not.toBe(entityWithComponent);
            expect(entityWithoutComponent.hasComponent("RenderComponent")).toBe(false);
            expect(entityWithComponent.hasComponent("RenderComponent")).toBe(true); // Original não modificado
        });

        it("deve obter um componente específico", () => {
            const entityWithComponent = entity.addComponent(renderComponent);
            const retrievedComponent =
                entityWithComponent.getComponent<RenderComponent>("RenderComponent");

            expect(retrievedComponent).toBe(renderComponent);
        });

        it("deve retornar undefined para componente inexistente", () => {
            const retrievedComponent = entity.getComponent<RenderComponent>("inexistent");

            expect(retrievedComponent).toBeUndefined();
        });

        it("deve verificar se possui um componente", () => {
            expect(entity.hasComponent("test")).toBe(false);

            const entityWithComponent = entity.addComponent(renderComponent);
            expect(entityWithComponent.hasComponent("RenderComponent")).toBe(true);
        });

        it("deve obter todos os tipos de componentes", () => {
            const entityWithComponents = entity
                .addComponent(renderComponent)
                .addComponent(transformComponent);

            const componentTypes = entityWithComponents.getComponentTypes();

            expect(componentTypes).toContain("RenderComponent");
            expect(componentTypes).toContain("TransformComponent");
            expect(componentTypes.length).toBe(2);
        });

        it("deve obter todos os componentes", () => {
            const entityWithComponents = entity
                .addComponent(renderComponent)
                .addComponent(transformComponent);

            const allComponents = entityWithComponents.getAllComponents();

            expect(allComponents).toContain(renderComponent);
            expect(allComponents).toContain(transformComponent);
            expect(allComponents.length).toBe(2);
        });
    });

    describe("Verificações de Componentes", () => {
        it("deve verificar se possui todos os componentes especificados", () => {
            const entityWithComponents = entity
                .addComponent(renderComponent)
                .addComponent(transformComponent);

            expect(
                entityWithComponents.hasAllComponents(["RenderComponent", "TransformComponent"]),
            ).toBe(true);
            expect(entityWithComponents.hasAllComponents(["RenderComponent", "inexistent"])).toBe(
                false,
            );
        });

        it("deve verificar se possui pelo menos um dos componentes especificados", () => {
            const entityWithComponent = entity.addComponent(renderComponent);

            expect(
                entityWithComponent.hasAnyComponent(["RenderComponent", "TransformComponent"]),
            ).toBe(true);
            expect(entityWithComponent.hasAnyComponent(["inexistent1", "inexistent2"])).toBe(false);
        });

        it("deve obter múltiplos componentes", () => {
            const entityWithComponents = entity
                .addComponent(renderComponent)
                .addComponent(transformComponent);

            const components = entityWithComponents.getComponents<Component>([
                "RenderComponent",
                "TransformComponent",
            ]);

            expect(components).toContain(renderComponent);
            expect(components).toContain(transformComponent);
            expect(components.length).toBe(2);
        });

        it("deve filtrar componentes inexistentes ao obter múltiplos", () => {
            const entityWithComponent = entity.addComponent(renderComponent);

            const components = entityWithComponent.getComponents<Component>([
                "RenderComponent",
                "inexistent",
            ]);

            expect(components).toContain(renderComponent);
            expect(components.length).toBe(1);
        });
    });

    describe("Imutabilidade", () => {
        it("deve manter imutabilidade ao adicionar componentes", () => {
            const originalEntity = entity;
            const entityWithComponent = entity.addComponent(renderComponent);

            expect(entityWithComponent).not.toBe(originalEntity);
            expect(originalEntity.components.size).toBe(0);
            expect(entityWithComponent.components.size).toBe(1);
        });

        it("deve manter imutabilidade ao remover componentes", () => {
            const entityWithComponent = entity.addComponent(renderComponent);
            const entityWithoutComponent = entityWithComponent.removeComponent("RenderComponent");

            expect(entityWithoutComponent).not.toBe(entityWithComponent);
            expect(entityWithComponent.components.size).toBe(1);
            expect(entityWithoutComponent.components.size).toBe(0);
        });

        it("deve criar cópia profunda dos componentes", () => {
            const entityWithComponent = entity.addComponent(renderComponent);
            const clonedEntity = entityWithComponent.clone();

            expect(clonedEntity).not.toBe(entityWithComponent);
            expect(clonedEntity.components).not.toBe(entityWithComponent.components);
            expect(clonedEntity.hasComponent("RenderComponent")).toBe(true);
        });
    });

    describe("Comparação", () => {
        it("deve verificar igualdade entre entidades", () => {
            const entity1 = Entity.createWithComponents("test-id", [renderComponent]);
            const entity2 = Entity.createWithComponents("test-id", [renderComponent]);

            expect(entity1.equals(entity2)).toBe(true);
        });

        it("deve detectar diferenças de ID", () => {
            const entity1 = Entity.createWithComponents("id-1", [renderComponent]);
            const entity2 = Entity.createWithComponents("id-2", [renderComponent]);

            expect(entity1.equals(entity2)).toBe(false);
        });

        it("deve detectar diferenças de componentes", () => {
            const entity1 = Entity.createWithComponents("test-id", [renderComponent]);
            const entity2 = Entity.createWithComponents("test-id", [transformComponent]);

            expect(entity1.equals(entity2)).toBe(false);
        });

        it("deve detectar diferenças no número de componentes", () => {
            const entity1 = Entity.createWithComponents("test-id", [renderComponent]);
            const entity2 = Entity.createWithComponents("test-id", [
                renderComponent,
                transformComponent,
            ]);

            expect(entity1.equals(entity2)).toBe(false);
        });
    });

    describe("Utilitários", () => {
        it("deve converter para string", () => {
            const entityWithComponents = entity
                .addComponent(renderComponent)
                .addComponent(transformComponent);

            const stringRepresentation = entityWithComponents.toString();

            expect(stringRepresentation).toBe(
                "Entity(test-entity-1)[RenderComponent, TransformComponent]",
            );
        });

        it("deve converter entidade vazia para string", () => {
            const stringRepresentation = entity.toString();

            expect(stringRepresentation).toBe("Entity(test-entity-1)[]");
        });

        it("deve clonar entidade corretamente", () => {
            const entityWithComponents = entity
                .addComponent(renderComponent)
                .addComponent(transformComponent);

            const clonedEntity = entityWithComponents.clone();

            expect(clonedEntity).not.toBe(entityWithComponents);
            expect(clonedEntity.id).toBe(entityWithComponents.id);
            expect(clonedEntity.hasComponent("RenderComponent")).toBe(true);
            expect(clonedEntity.hasComponent("TransformComponent")).toBe(true);
        });
    });

    describe("Casos de Borda", () => {
        it("deve lidar com remoção de componente inexistente", () => {
            const result = entity.removeComponent("inexistent");

            expect(result).not.toBe(entity);
            expect(result.components.size).toBe(0);
        });

        it("deve lidar com adição de componente duplicado", () => {
            const newComponent = new RenderComponent();
            const entityWithComponent = entity.addComponent(renderComponent);
            const entityWithNewComponent = entityWithComponent.addComponent(newComponent);

            expect(entityWithNewComponent.getComponent<RenderComponent>("RenderComponent")).toBe(
                newComponent,
            );
            expect(entityWithComponent.getComponent<RenderComponent>("RenderComponent")).toBe(
                renderComponent,
            );
        });

        it("deve lidar com arrays vazios de tipos de componentes", () => {
            expect(entity.hasAllComponents([])).toBe(true);
            expect(entity.hasAnyComponent([])).toBe(false);
            expect(entity.getComponents([])).toEqual([]);
        });
    });
});
