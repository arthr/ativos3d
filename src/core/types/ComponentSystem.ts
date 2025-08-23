import type {
    Component,
    ComponentFactory,
    ComponentValidator,
    ComponentData,
    ValidationResult,
    ComponentInfo,
    EntityId,
    Entity,
    ComponentConfig,
    EntityValidationResult,
} from "@core/types";

export interface ComponentSystem {
    instance: ComponentSystem;
    componentFactories: Map<string, ComponentFactory>;
    componentValidators: Map<string, ComponentValidator>;

    // Singleton
    getInstance(): ComponentSystem;
    resetInstance(): void;

    // Component registration
    registerComponentFactory(componentType: string, factory: ComponentFactory): void;
    registerComponentValidator(componentType: string, validator: ComponentValidator): void;

    // Component creation
    registerComponents(
        components: {
            type: string;
            factory: ComponentFactory;
            validator: ComponentValidator;
        }[],
    ): void;
    createComponent<T extends Component>(componentType: string, data: ComponentData): T;

    // Component validation
    validateComponent(component: Component): ValidationResult;
    validateComponents(components: Component[]): ValidationResult[];

    // Component type support
    isComponentTypeSupported(componentType: string): boolean;
    getSupportedComponentTypes(): string[];
    getComponentInfo(componentType: string): ComponentInfo | null;

    // Entity creation
    createEntityWithComponents(id: EntityId, componentConfigs: ComponentConfig[]): Entity;

    // Entity manipulation
    addComponentToEntity(entity: Entity, componentType: string, data: ComponentData): Entity;
    removeComponentFromEntity(entity: Entity, componentType: string): Entity;
    getComponentFromEntity<T extends Component>(
        entity: Entity,
        componentType: string,
    ): T | undefined;

    // Entity validation
    validateEntity(entity: Entity): EntityValidationResult;

    // Default component registration
    registerDefaultComponents(): void;
}
