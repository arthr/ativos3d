import type { Component, ValidationResult } from "@core/types";

/**
 * Componente base que outros componentes podem estender
 *
 * Fornece funcionalidades comuns como validação básica e metadados
 */
export abstract class BaseComponent implements Component {
    public readonly type: string;
    public readonly createdAt: Date;
    public readonly metadata: Record<string, unknown>;

    constructor(type: string, metadata: Record<string, unknown> = {}) {
        this.type = type;
        this.createdAt = new Date();
        this.metadata = {
            version: "1.0.0",
            ...metadata,
        };
    }

    /**
     * Validação básica do componente
     */
    public validate(): ValidationResult {
        const errors: string[] = [];
        const warnings: string[] = [];

        if (!this.type || this.type.trim() === "") {
            errors.push("Tipo do componente é obrigatório");
        }

        if (this.type.length > 50) {
            warnings.push("Tipo do componente muito longo");
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
     * Converte o componente para string (para debugging)
     */
    public toString(): string {
        return `${this.type}(${this.createdAt.toISOString()})`;
    }

    /**
     * Cria uma cópia do componente
     */
    public abstract clone(): BaseComponent;

    /**
     * Verifica se dois componentes são iguais
     */
    public equals(other: BaseComponent): boolean {
        return this.type === other.type;
    }
}
