import type {
    Component,
    ComponentFactory,
    ComponentValidator,
    ComponentData,
    ValidationResult,
    EntityValidationResult,
    ComponentInfo,
    Entity,
} from "@core/types/ecs";
import { TransformComponent } from "./TransformComponent";
import { PhysicsComponent } from "./PhysicsComponent";
import { RenderComponent } from "./RenderComponent";
import { WallComponent } from "./WallComponent";
import { FloorComponent } from "./FloorComponent";

/**
 * Sistema de Componentes seguindo Domain-Driven Design
 *
 * Este sistema gerencia a criação, validação e manipulação de componentes
 * de forma centralizada e consistente.
 */
export class ComponentSystem {
    private static instance: ComponentSystem | null = null;
    private componentFactories: Map<string, ComponentFactory> = new Map();
    private componentValidators: Map<string, ComponentValidator> = new Map();

    private constructor() {
        this.registerDefaultComponents();
    }

    /**
     * Obtém a instância singleton do ComponentSystem
     */
    public static getInstance(): ComponentSystem {
        if (!ComponentSystem.instance) {
            ComponentSystem.instance = new ComponentSystem();
        }
        return ComponentSystem.instance;
    }

    /**
     * Reseta a instância singleton (para testes)
     */
    public static resetInstance(): void {
        if (ComponentSystem.instance) {
            ComponentSystem.instance.componentFactories.clear();
            ComponentSystem.instance.componentValidators.clear();
        }
        ComponentSystem.instance = null;
    }

    /**
     * Registra uma factory para criar componentes de um tipo específico
     */
    public registerComponentFactory(componentType: string, factory: ComponentFactory): void {
        this.componentFactories.set(componentType, factory);
    }

    /**
     * Registra um validador para componentes de um tipo específico
     */
    public registerComponentValidator(componentType: string, validator: ComponentValidator): void {
        this.componentValidators.set(componentType, validator);
    }

    /**
     * Registra multiplos componentes
     *
     * @param components { type: string; factory: ComponentFactory; validator: (component: Component) => ValidationResult }[]
     * @returns void
     */
    private registerComponents(
        components: {
            type: string;
            factory: ComponentFactory;
            validator: ComponentValidator;
        }[],
    ): void {
        for (const component of components) {
            this.registerComponentFactory(component.type, component.factory);
            this.registerComponentValidator(component.type, component.validator);
        }
    }

    /**
     * Cria um componente usando a factory registrada
     */
    public createComponent<T extends Component>(componentType: string, data: ComponentData): T {
        const factory = this.componentFactories.get(componentType);
        if (!factory) {
            throw new Error(`Factory não registrada para componente: ${componentType}`);
        }

        const component = factory(data);
        const validation = this.validateComponent(component);
        if (!validation.isValid) {
            throw new Error(
                `Componente inválido: ${componentType} - ${validation.errors.join(", ")}`,
            );
        }
        return component as T;
    }

    /**
     * Valida um componente usando o validador registrado
     */
    public validateComponent(component: Component): ValidationResult {
        const validator = this.componentValidators.get(component.type);
        if (!validator) {
            return { isValid: true, errors: [] };
        }

        return validator(component);
    }

    /**
     * Valida múltiplos componentes
     */
    public validateComponents(components: Component[]): ValidationResult[] {
        return components.map((component) => this.validateComponent(component));
    }

    /**
     * Verifica se um tipo de componente é suportado
     */
    public isComponentTypeSupported(componentType: string): boolean {
        return this.componentFactories.has(componentType);
    }

    /**
     * Obtém todos os tipos de componentes suportados
     */
    public getSupportedComponentTypes(): string[] {
        return Array.from(this.componentFactories.keys());
    }

    /**
     * Obtém informações sobre um tipo de componente
     */
    public getComponentInfo(componentType: string): ComponentInfo | null {
        const factory = this.componentFactories.get(componentType);
        const validator = this.componentValidators.get(componentType);

        if (!factory) {
            return null;
        }

        return {
            type: componentType,
            hasFactory: true,
            hasValidator: !!validator,
            factory: factory,
            validator: validator || null,
        };
    }

    /**
     * Cria um componente para ser adicionado a uma entidade
     */
    public createComponentForEntity(componentType: string, data: ComponentData): Component {
        return this.createComponent(componentType, data);
    }

    /**
     * Obtém um componente de uma entidade com validação
     */
    public getComponentFromEntity<T extends Component>(
        entity: Entity,
        componentType: string,
    ): T | undefined {
        const component = entity.getComponent<T>(componentType);
        if (component) {
            const validation = this.validateComponent(component);
            if (!validation.isValid) {
                console.warn(`Componente inválido encontrado: ${componentType}`, validation.errors);
            }
        }
        return component;
    }

    /**
     * Valida todos os componentes de uma entidade
     */
    public validateEntity(entity: Entity): EntityValidationResult {
        const components = entity.getAllComponents();
        const validations = this.validateComponents(components);
        const errors = validations.flatMap((v) => v.errors);
        const warnings = validations.flatMap((v) => v.warnings || []);

        return {
            entityId: entity.id,
            isValid: errors.length === 0,
            errors,
            warnings,
            componentCount: components.length,
        };
    }

    /**
     * Registra componentes padrão do sistema
     */
    private registerDefaultComponents(): void {
        this.registerComponents([
            {
                type: "TransformComponent",
                factory: (data): TransformComponent => TransformComponent.create(data),
                validator: (component): ValidationResult => component.validate(),
            },
            {
                type: "RenderComponent",
                factory: (data): RenderComponent => RenderComponent.create(data),
                validator: (component): ValidationResult => component.validate(),
            },
            {
                type: "PhysicsComponent",
                factory: (data): PhysicsComponent => PhysicsComponent.create(data),
                validator: (component): ValidationResult => component.validate(),
            },
            {
                type: "WallComponent",
                factory: (data): WallComponent => WallComponent.create(data),
                validator: (component): ValidationResult => component.validate(),
            },
            {
                type: "FloorComponent",
                factory: (data): FloorComponent => FloorComponent.create(data),
                validator: (component): ValidationResult => component.validate(),
            },
        ]);
    }
}
