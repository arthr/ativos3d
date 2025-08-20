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

// Exporta componentes específicos
export { TransformComponent } from "./TransformComponent";
export type { TransformComponentData } from "@core/types/components/TransformComponent";

export { RenderComponent } from "./RenderComponent";
export type { RenderComponentData, MaterialConfig } from "@core/types/components/RenderComponent";

export { PhysicsComponent } from "./PhysicsComponent";
export type { PhysicsComponentData } from "@core/types/components/PhysicsComponent";

export { ToolComponent } from "./ToolComponent";
export type { ToolComponentData } from "@core/types/components/ToolComponent";
