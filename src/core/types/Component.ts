import type { EntityId } from "./Entity";

/**
 * Interface base para componentes
 */
export interface Component {
    readonly type: string;
    validate: () => ValidationResult;
}

/**
 * Resultado de validação
 */
export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings?: string[];
}

/**
 * Factory para criar componentes
 */
export type ComponentFactory = (data: ComponentData) => Component;

/**
 * Validador para componentes
 */
export type ComponentValidator = (component: Component) => ValidationResult;

/**
 * Dados para criar um componente
 */
export interface ComponentData {
    [key: string]: unknown;
}

/**
 * Configuração para criar um componente
 */
export interface ComponentConfig {
    type: string;
    data: ComponentData;
}

/**
 * Resultado de validação de entidade
 */
export interface EntityValidationResult {
    entityId: EntityId;
    isValid: boolean;
    errors: string[];
    warnings: string[];
    componentCount: number;
}

/**
 * Informações sobre um tipo de componente
 */
export interface ComponentInfo {
    type: string;
    hasFactory: boolean;
    hasValidator: boolean;
    factory: ComponentFactory;
    validator: ComponentValidator | null;
}
