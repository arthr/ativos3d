import type { Component, EntityId } from "@core/types";
import { Entity } from "@domain/entities";

/**
 * Sistema de Componentes seguindo Domain-Driven Design
 *
 * Este sistema gerencia a criação, validação e manipulação de componentes
 * de forma centralizada e consistente.
 */
export class ComponentSystem {
    private static instance: ComponentSystem;
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
     * Cria um componente usando a factory registrada
     */
    public createComponent<T extends Component>(componentType: string, data: ComponentData): T {
        const factory = this.componentFactories.get(componentType);
        if (!factory) {
            throw new Error(`Factory não registrada para componente: ${componentType}`);
        }

        const component = factory(data);
        this.validateComponent(component);
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
     * Cria uma entidade com componentes usando o sistema
     */
    public createEntityWithComponents(id: EntityId, componentConfigs: ComponentConfig[]): Entity {
        const components: Component[] = [];

        for (const config of componentConfigs) {
            const component = this.createComponent(config.type, config.data);
            components.push(component);
        }

        return Entity.createWithComponents(id, components);
    }

    /**
     * Adiciona um componente a uma entidade usando o sistema
     */
    public addComponentToEntity(
        entity: Entity,
        componentType: string,
        data: ComponentData,
    ): Entity {
        const component = this.createComponent(componentType, data);
        return entity.addComponent(component);
    }

    /**
     * Remove um componente de uma entidade
     */
    public removeComponentFromEntity(entity: Entity, componentType: string): Entity {
        return entity.removeComponent(componentType);
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
        // Componentes básicos serão registrados aqui
        // quando implementarmos os componentes específicos
    }
}

/**
 * Tipos para o Component System
 */

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
    [key: string]: any;
}

/**
 * Configuração para criar um componente
 */
export interface ComponentConfig {
    type: string;
    data: ComponentData;
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
