import { describe, it, expect, beforeEach, vi } from "vitest";
import { ComponentSystem, TestComponent } from "@domain/components";
import { Entity } from "@domain/entities";
import { Vec3Factory } from "@core/geometry";

describe("ComponentSystem", () => {
    let componentSystem: ComponentSystem;

    beforeEach(() => {
        // Reset singleton instance
        (ComponentSystem as any).instance = undefined;
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
            const factory = vi
                .fn()
                .mockReturnValue(new TestComponent("test", Vec3Factory.create(0, 0, 0)));

            componentSystem.registerComponentFactory("test", factory);

            expect(componentSystem.isComponentTypeSupported("test")).toBe(true);
        });

        it("deve registrar múltiplas factories", () => {
            const factory1 = vi
                .fn()
                .mockReturnValue(new TestComponent("test1", Vec3Factory.create(0, 0, 0)));
            const factory2 = vi
                .fn()
                .mockReturnValue(new TestComponent("test2", Vec3Factory.create(1, 1, 1)));

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
            const factory = vi
                .fn()
                .mockReturnValue(new TestComponent("test", Vec3Factory.create(0, 0, 0)));
            componentSystem.registerComponentFactory("test", factory);

            const info = componentSystem.getComponentInfo("test");
            expect(info?.hasValidator).toBe(true);
        });

        it("deve registrar factory e validador para o mesmo tipo", () => {
            const factory = vi
                .fn()
                .mockReturnValue(new TestComponent("test", Vec3Factory.create(0, 0, 0)));
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
            const testComponent = new TestComponent("test", Vec3Factory.create(0, 0, 0));
            const factory = vi.fn().mockReturnValue(testComponent);

            componentSystem.registerComponentFactory("test", factory);

            const createdComponent = componentSystem.createComponent<TestComponent>("test", {
                value: "test",
                position: Vec3Factory.create(0, 0, 0),
            });

            expect(createdComponent).toBe(testComponent);
            expect(factory).toHaveBeenCalledWith({
                value: "test",
                position: Vec3Factory.create(0, 0, 0),
            });
        });

        it("deve lançar erro ao criar componente sem factory", () => {
            expect(() => {
                componentSystem.createComponent("inexistent", {});
            }).toThrow("Factory não registrada para componente: inexistent");
        });
    });

    describe("Validação de Componentes", () => {
        it("deve validar componente usando validador registrado", () => {
            const testComponent = new TestComponent("test", Vec3Factory.create(0, 0, 0));
            const validator = vi.fn().mockReturnValue({ isValid: true, errors: [] });

            componentSystem.registerComponentValidator("test", validator);

            const result = componentSystem.validateComponent(testComponent);

            expect(result.isValid).toBe(true);
            expect(validator).toHaveBeenCalledWith(testComponent);
        });

        it("deve retornar válido para componente sem validador", () => {
            const testComponent = new TestComponent("test", Vec3Factory.create(0, 0, 0));

            const result = componentSystem.validateComponent(testComponent);

            expect(result.isValid).toBe(true);
            expect(result.errors).toEqual([]);
        });

        it("deve validar múltiplos componentes", () => {
            const component1 = new TestComponent("test1", Vec3Factory.create(0, 0, 0));
            const component2 = new TestComponent("test2", Vec3Factory.create(1, 1, 1));

            const results = componentSystem.validateComponents([component1, component2]);

            expect(results).toHaveLength(2);
            expect(results[0]?.isValid).toBe(true);
            expect(results[1]?.isValid).toBe(true);
        });
    });

    describe("Gerenciamento de Entidades", () => {
        it("deve criar entidade com componentes", () => {
            const testComponent = new TestComponent("test", Vec3Factory.create(0, 0, 0));
            const factory = vi.fn().mockReturnValue(testComponent);

            componentSystem.registerComponentFactory("test", factory);

            const entity = componentSystem.createEntityWithComponents("test-entity", [
                { type: "test", data: { value: "test", position: Vec3Factory.create(0, 0, 0) } },
            ]);

            expect(entity.id).toBe("test-entity");
            expect(entity.hasComponent("test")).toBe(true);
        });

        it("deve adicionar componente a entidade", () => {
            const testComponent = new TestComponent("test", Vec3Factory.create(0, 0, 0));
            const factory = vi.fn().mockReturnValue(testComponent);
            const entity = Entity.create("test-entity");

            componentSystem.registerComponentFactory("test", factory);

            const newEntity = componentSystem.addComponentToEntity(entity, "test", {
                value: "test",
                position: Vec3Factory.create(0, 0, 0),
            });

            expect(newEntity).not.toBe(entity);
            expect(newEntity.hasComponent("test")).toBe(true);
        });

        it("deve remover componente de entidade", () => {
            const entity = Entity.create("test-entity").addComponent(
                new TestComponent("test", Vec3Factory.create(0, 0, 0)),
            );

            const newEntity = componentSystem.removeComponentFromEntity(entity, "test");

            expect(newEntity).not.toBe(entity);
            expect(newEntity.hasComponent("test")).toBe(false);
        });

        it("deve obter componente de entidade com validação", () => {
            const testComponent = new TestComponent("test", Vec3Factory.create(0, 0, 0));
            const entity = Entity.create("test-entity").addComponent(testComponent);
            const validator = vi.fn().mockReturnValue({ isValid: true, errors: [] });

            componentSystem.registerComponentValidator("test", validator);

            const retrievedComponent = componentSystem.getComponentFromEntity<TestComponent>(
                entity,
                "test",
            );

            expect(retrievedComponent).toBe(testComponent);
            expect(validator).toHaveBeenCalledWith(testComponent);
        });

        it("deve validar entidade completa", () => {
            // Criar componentes com tipos diferentes para que ambos sejam mantidos
            const component1 = new TestComponent("test1", Vec3Factory.create(0, 0, 0));
            const component2 = new TestComponent("test2", Vec3Factory.create(1, 1, 1));

            // Modificar o tipo dos componentes para que sejam únicos
            (component1 as any).type = "test1";
            (component2 as any).type = "test2";

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
            const factory = vi
                .fn()
                .mockReturnValue(new TestComponent("test", Vec3Factory.create(0, 0, 0)));

            expect(componentSystem.isComponentTypeSupported("test")).toBe(false);

            componentSystem.registerComponentFactory("test", factory);

            expect(componentSystem.isComponentTypeSupported("test")).toBe(true);
        });

        it("deve obter tipos de componentes suportados", () => {
            const factory = vi
                .fn()
                .mockReturnValue(new TestComponent("test", Vec3Factory.create(0, 0, 0)));

            componentSystem.registerComponentFactory("test", factory);

            const types = componentSystem.getSupportedComponentTypes();

            expect(types).toContain("test");
        });

        it("deve obter informações de componente", () => {
            const factory = vi
                .fn()
                .mockReturnValue(new TestComponent("test", Vec3Factory.create(0, 0, 0)));
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
            const testComponent = new TestComponent("", Vec3Factory.create(0, 0, 0)); // Valor vazio
            const validator = vi.fn().mockReturnValue({
                isValid: false,
                errors: ["Valor é obrigatório"],
            });

            componentSystem.registerComponentValidator("test", validator);

            const result = componentSystem.validateComponent(testComponent);

            expect(result.isValid).toBe(false);
            expect(result.errors).toContain("Valor é obrigatório");
        });

        it("deve lidar com entidade sem componentes", () => {
            const entity = Entity.create("empty-entity");

            const result = componentSystem.validateEntity(entity);

            expect(result.entityId).toBe("empty-entity");
            expect(result.isValid).toBe(true);
            expect(result.componentCount).toBe(0);
        });

        it("deve lidar com warnings na validação", () => {
            const testComponent = new TestComponent("test", Vec3Factory.create(0, 0, 0));
            const validator = vi.fn().mockReturnValue({
                isValid: true,
                errors: [],
                warnings: ["Componente com configuração não recomendada"],
            });

            componentSystem.registerComponentValidator("test", validator);

            const result = componentSystem.validateComponent(testComponent);

            expect(result.isValid).toBe(true);
            expect(result.warnings).toContain("Componente com configuração não recomendada");
        });
    });
});
