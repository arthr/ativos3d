import { describe, it, expect, beforeEach, vi } from "vitest";
import { ComponentSystem, TransformComponent, RenderComponent } from "@domain/components";
import { Entity } from "@domain/entities";
import { Vec3Factory } from "@core/geometry";

describe("ComponentSystem", () => {
    let componentSystem: ComponentSystem;

    beforeEach(() => {
        // Reset singleton instance
        ComponentSystem.resetInstance();
        componentSystem = ComponentSystem.getInstance();
    });

    describe("Singleton Pattern", () => {
        it("deve retornar a mesma instância", () => {
            const instance1 = ComponentSystem.getInstance();
            const instance2 = ComponentSystem.getInstance();

            expect(instance1).toBe(instance2);
        });
    });

    describe("Registro de Factories", () => {
        it("deve registrar uma factory de componente", () => {
            const factory = vi.fn().mockReturnValue(new TransformComponent());

            componentSystem.registerComponentFactory("test", factory);

            expect(componentSystem.isComponentTypeSupported("test")).toBe(true);
        });

        it("deve registrar múltiplas factories", () => {
            const factory1 = vi.fn().mockReturnValue(new TransformComponent());
            const factory2 = vi.fn().mockReturnValue(new RenderComponent());

            componentSystem.registerComponentFactory("test1", factory1);
            componentSystem.registerComponentFactory("test2", factory2);

            expect(componentSystem.getSupportedComponentTypes()).toContain("test1");
            expect(componentSystem.getSupportedComponentTypes()).toContain("test2");
        });
    });

    describe("Registro de Validators", () => {
        it("deve registrar um validador de componente", () => {
            const validator = vi.fn().mockReturnValue({ isValid: true, errors: [] });

            componentSystem.registerComponentValidator("test", validator);

            // Primeiro registra uma factory para que o componente seja reconhecido
            const factory = vi.fn().mockReturnValue(new TransformComponent());
            componentSystem.registerComponentFactory("test", factory);

            const info = componentSystem.getComponentInfo("test");
            expect(info?.hasValidator).toBe(true);
        });

        it("deve registrar factory e validador para o mesmo tipo", () => {
            const factory = vi.fn().mockReturnValue(new TransformComponent());
            const validator = vi.fn().mockReturnValue({ isValid: true, errors: [] });

            componentSystem.registerComponentFactory("test", factory);
            componentSystem.registerComponentValidator("test", validator);

            const info = componentSystem.getComponentInfo("test");
            expect(info?.hasFactory).toBe(true);
            expect(info?.hasValidator).toBe(true);
        });
    });

    describe("Criação de Componentes", () => {
        it("deve criar um componente usando factory registrada", () => {
            const transformComponent = new TransformComponent();
            const factory = vi.fn().mockReturnValue(transformComponent);

            componentSystem.registerComponentFactory("TransformComponent", factory);

            const createdComponent = componentSystem.createComponent<TransformComponent>(
                "TransformComponent",
                {},
            );

            expect(createdComponent).toBe(transformComponent);
            expect(factory).toHaveBeenCalledWith({});
        });

        it("deve lançar erro ao criar componente sem factory", () => {
            expect(() => {
                componentSystem.createComponent("inexistent", {});
            }).toThrow("Factory não registrada para componente: inexistent");
        });

        it("deve lançar erro ao criar componente inválido", () => {
            expect(() => {
                componentSystem.createComponent<TransformComponent>("TransformComponent", {
                    scale: Vec3Factory.create(0, 0, 0),
                });
            }).toThrow("Componente inválido: TransformComponent - Escala não pode ser zero");
        });
    });

    describe("Validação de Componentes", () => {
        it("deve validar componente usando validador registrado", () => {
            const testComponent = new RenderComponent();
            const validator = vi.fn().mockReturnValue({ isValid: true, errors: [] });

            componentSystem.registerComponentValidator("RenderComponent", validator);

            const result = componentSystem.validateComponent(testComponent);

            expect(result.isValid).toBe(true);
            expect(validator).toHaveBeenCalledWith(testComponent);
        });

        it("deve retornar válido para componente sem validador", () => {
            const testComponent = new TransformComponent();

            const result = componentSystem.validateComponent(testComponent);

            expect(result.isValid).toBe(true);
            expect(result.errors).toEqual([]);
        });

        it("deve validar múltiplos componentes", () => {
            const component1 = new TransformComponent();
            const component2 = new RenderComponent();

            const results = componentSystem.validateComponents([component1, component2]);

            expect(results).toHaveLength(2);
            expect(results[0]?.isValid).toBe(true);
            expect(results[1]?.isValid).toBe(true);
        });
    });

    describe("Gerenciamento de Entidades", () => {
        it("deve criar componente para entidade", () => {
            const transformComponent = new TransformComponent();
            const factory = vi.fn().mockReturnValue(transformComponent);

            componentSystem.registerComponentFactory("TransformComponent", factory);

            const component = componentSystem.createComponentForEntity("TransformComponent", {});

            expect(component).toBe(transformComponent);
            expect(component.type).toBe("TransformComponent");
        });

        it("deve criar componente e adicionar a entidade", () => {
            const transformComponent = new TransformComponent();
            const factory = vi.fn().mockReturnValue(transformComponent);
            const entity = Entity.create("test-entity");

            componentSystem.registerComponentFactory("TransformComponent", factory);

            const component = componentSystem.createComponentForEntity("TransformComponent", {});
            const newEntity = entity.addComponent(component);

            expect(newEntity).not.toBe(entity);
            expect(newEntity.hasComponent("TransformComponent")).toBe(true);
        });

        it("deve criar componente e remover de entidade", () => {
            const entity = Entity.create("test-entity").addComponent(new TransformComponent());

            const newEntity = entity.removeComponent("TransformComponent");

            expect(newEntity).not.toBe(entity);
            expect(newEntity.hasComponent("TransformComponent")).toBe(false);
        });

        it("deve obter componente de entidade com validação", () => {
            const transformComponent = new TransformComponent();
            const entity = Entity.create("test-entity").addComponent(transformComponent);
            const validator = vi.fn().mockReturnValue({ isValid: true, errors: [] });

            componentSystem.registerComponentValidator("TransformComponent", validator);

            const retrievedComponent = componentSystem.getComponentFromEntity<TransformComponent>(
                entity,
                "TransformComponent",
            );

            expect(retrievedComponent).toBe(transformComponent);
            expect(validator).toHaveBeenCalledWith(transformComponent);
        });

        it("deve retornar undefined para componente inválido", () => {
            const transformComponent = new TransformComponent();
            const entity = Entity.create("test-entity").addComponent(transformComponent);
            const validator = vi.fn().mockReturnValue({ isValid: false, errors: ["invalid"] });

            componentSystem.registerComponentValidator("TransformComponent", validator);

            const retrievedComponent = componentSystem.getComponentFromEntity<TransformComponent>(
                entity,
                "TransformComponent",
            );

            expect(retrievedComponent).toBeUndefined();
            expect(validator).toHaveBeenCalledWith(transformComponent);
        });

        it("deve validar entidade completa", () => {
            // Criar componentes com tipos diferentes para que ambos sejam mantidos
            const component1 = new TransformComponent({
                position: Vec3Factory.create(0, 0, 0),
                rotation: Vec3Factory.create(0, 0, 0),
                scale: Vec3Factory.create(1, 1, 1),
            });
            const component2 = new RenderComponent({
                color: "#000000",
            });

            const entity = Entity.create("test-entity")
                .addComponent(component1)
                .addComponent(component2);

            const result = componentSystem.validateEntity(entity);

            expect(result.entityId).toBe("test-entity");
            expect(result.isValid).toBe(true);
            expect(result.componentCount).toBe(2);
        });
    });

    describe("Informações do Sistema", () => {
        it("deve verificar se tipo de componente é suportado", () => {
            const factory = vi.fn().mockReturnValue(new TransformComponent());

            expect(componentSystem.isComponentTypeSupported("test")).toBe(false);

            componentSystem.registerComponentFactory("test", factory);

            expect(componentSystem.isComponentTypeSupported("test")).toBe(true);
        });

        it("deve obter tipos de componentes suportados", () => {
            const factory = vi.fn().mockReturnValue(new TransformComponent());

            componentSystem.registerComponentFactory("test", factory);

            const types = componentSystem.getSupportedComponentTypes();

            expect(types).toContain("test");
        });

        it("deve obter informações de componente", () => {
            const factory = vi.fn().mockReturnValue(new TransformComponent());
            const validator = vi.fn().mockReturnValue({ isValid: true, errors: [] });

            componentSystem.registerComponentFactory("test", factory);
            componentSystem.registerComponentValidator("test", validator);

            const info = componentSystem.getComponentInfo("test");

            expect(info).not.toBeNull();
            if (info) {
                expect(info.type).toBe("test");
                expect(info.hasFactory).toBe(true);
                expect(info.hasValidator).toBe(true);
                expect(info.factory).toBe(factory);
                expect(info.validator).toBe(validator);
            }
        });

        it("deve retornar null para componente inexistente", () => {
            const info = componentSystem.getComponentInfo("inexistent");

            expect(info).toBeNull();
        });
    });

    describe("Casos de Borda", () => {
        it("deve lidar com validação de componente inválido", () => {
            const testComponent = new RenderComponent({
                color: "#000000",
            });
            const validator = vi.fn().mockReturnValue({
                isValid: false,
                errors: ["Nome do componente é obrigatório"],
            });

            componentSystem.registerComponentValidator("RenderComponent", validator);

            const result = componentSystem.validateComponent(testComponent);

            expect(result.isValid).toBe(false);
            expect(result.errors).toContain("Nome do componente é obrigatório");
        });

        it("deve lidar com entidade sem componentes", () => {
            const entity = Entity.create("empty-entity");

            const result = componentSystem.validateEntity(entity);

            expect(result.entityId).toBe("empty-entity");
            expect(result.isValid).toBe(true);
            expect(result.componentCount).toBe(0);
        });

        it("deve lidar com warnings na validação", () => {
            const testComponent = new TransformComponent();
            const validator = vi.fn().mockReturnValue({
                isValid: true,
                errors: [],
                warnings: ["Componente com configuração não recomendada"],
            });

            componentSystem.registerComponentValidator("TransformComponent", validator);

            const result = componentSystem.validateComponent(testComponent);

            expect(result.isValid).toBe(true);
            expect(result.warnings).toContain("Componente com configuração não recomendada");
        });
    });
});
