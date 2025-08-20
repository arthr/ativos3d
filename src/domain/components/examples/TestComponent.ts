import { BaseComponent } from "../BaseComponent";
import type { ValidationResult, ComponentData as BaseComponentData } from "@core/types";
import type { Vec3 } from "@core/geometry";

/**
 * Componente de teste para demonstrar o sistema
 */
export class TestComponent extends BaseComponent {
    public readonly value: string;
    public readonly position: Vec3;
    public readonly enabled: boolean;

    constructor(
        value: string,
        position: Vec3,
        enabled: boolean = true,
        metadata: Record<string, unknown> = {},
    ) {
        super("test", metadata);
        this.value = value;
        this.position = position;
        this.enabled = enabled;
    }

    /**
     * Validação específica do TestComponent
     */
    public validate(): ValidationResult {
        const baseValidation = super.validate();
        const errors = [...baseValidation.errors];
        const warnings = [...(baseValidation.warnings || [])];

        if (!this.value || this.value.trim() === "") {
            errors.push("Valor do componente é obrigatório");
        }

        if (this.value.length > 100) {
            warnings.push("Valor do componente muito longo");
        }

        if (!this.position) {
            errors.push("Posição é obrigatória");
        }

        const result: ValidationResult = {
            isValid: errors.length === 0,
            errors,
        };

        if (warnings.length > 0) {
            result.warnings = warnings;
        }

        return result;
    }

    /**
     * Cria uma cópia do componente
     */
    public clone(): TestComponent {
        return new TestComponent(this.value, this.position, this.enabled, { ...this.metadata });
    }

    /**
     * Verifica se dois componentes são iguais
     */
    public equals(other: TestComponent): boolean {
        return (
            super.equals(other) &&
            this.value === other.value &&
            this.position === other.position &&
            this.enabled === other.enabled
        );
    }

    /**
     * Converte o componente para string
     */
    public toString(): string {
        return `TestComponent(${this.value}, ${this.position}, ${this.enabled})`;
    }

    /**
     * Factory para criar TestComponent
     */
    public static create(data: TestComponentData): TestComponent {
        return new TestComponent(
            data.value || "",
            data.position,
            data.enabled !== undefined ? data.enabled : true,
            data.metadata || {},
        );
    }
}

/**
 * Dados específicos para criar um TestComponent
 */
export interface TestComponentData extends BaseComponentData {
    value: string;
    position: Vec3;
    enabled?: boolean;
    metadata?: Record<string, unknown>;
}
