// Exporta o Component System principal
export { ComponentSystem } from "./ComponentSystem";

// Exporta tipos do Component System
export type {
    ComponentFactory,
    ComponentValidator,
    ComponentData,
    ComponentConfig,
    ValidationResult,
    EntityValidationResult,
    ComponentInfo,
} from "./ComponentSystem";

// Exporta componentes base
export { BaseComponent } from "./base/BaseComponent";
export type { ValidationResult as BaseValidationResult } from "./base/BaseComponent";

// Exporta componentes de exemplo
export { TestComponent } from "./examples/TestComponent";
export type { ComponentData as TestComponentData } from "./examples/TestComponent";
