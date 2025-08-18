// Exporta tipos centralizados do core
export type {
    Component,
    ComponentFactory,
    ComponentValidator,
    ComponentData,
    ComponentConfig,
    ValidationResult,
    EntityValidationResult,
    ComponentInfo,
} from "@core/types";

// Exporta o Component System principal
export { ComponentSystem } from "./ComponentSystem";

// Exporta componentes base
export { BaseComponent } from "./BaseComponent";

// Exporta componentes de exemplo
export { TestComponent } from "./examples/TestComponent";
export type { TestComponentData } from "./examples/TestComponent";
