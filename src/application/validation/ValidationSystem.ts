import type {
    Entity,
    EntityId,
    ValidationResult,
    ValidationContext,
    Validator,
    ValidationPipeline,
} from "@core/types";
import type { EventBus } from "@core/events/EventBus";
import type { ValidationEvents } from "@core/types/events/ValidationEvents";

/**
 * Sistema responsável por coordenar a validação de entidades
 */
export class ValidationSystem implements ValidationPipeline {
    private static instance: ValidationSystem | null = null;
    private validators: Validator[] = [];
    private readonly eventBus: EventBus;
    private readonly getEntity: (id: EntityId) => Entity | null;

    private constructor(eventBus: EventBus, getEntity: (id: EntityId) => Entity | null) {
        this.eventBus = eventBus;
        this.getEntity = getEntity;
        this.eventBus.on("validationRequested", this.handleValidationRequested);
    }

    /**
     * Retorna a instância do singleton do sistema de validação
     */
    public static getInstance(
        eventBus: EventBus,
        getEntity: (id: EntityId) => Entity | null,
    ): ValidationSystem {
        if (!ValidationSystem.instance) {
            ValidationSystem.instance = new ValidationSystem(eventBus, getEntity);
        }

        return ValidationSystem.instance;
    }

    /**
     * Reseta a instância do singleton
     */
    public static resetInstance(): void {
        ValidationSystem.instance = null;
    }

    /**
     * Adiciona um novo validador
     */
    public addValidator(validator: Validator): void {
        this.validators.push(validator);
    }

    /**
     * Remove um validador
     */
    public removeValidator(validator: Validator): void {
        this.validators = this.validators.filter((v) => v !== validator);
    }

    /**
     * Executa os validadores sequencialmente e para ao encontrar um erro
     */
    public validate(context: ValidationContext): ValidationResult {
        const errors: string[] = [];
        const warnings: string[] = [];

        for (const validator of this.validators) {
            const result = validator(context);
            if (result.warnings) warnings.push(...result.warnings);
            if (!result.isValid) {
                errors.push(...result.errors);
                return { isValid: false, errors, warnings };
            }
            errors.push(...result.errors);
        }

        return { isValid: errors.length === 0, errors, warnings };
    }

    /**
     * Trata eventos de validação e emite o resultado
     */
    private handleValidationRequested = ({
        entityId,
        position,
    }: ValidationEvents["validationRequested"]): void => {
        const entity = this.getEntity(entityId);
        if (!entity) {
            this.eventBus.emit("validationCompleted", {
                entityId,
                position,
                valid: false,
                errors: ["Entidade não encontrada"],
            });
            return;
        }

        const context: ValidationContext = {
            entityId,
            position,
            entity,
        };
        const result = this.validate(context);
        this.eventBus.emit("validationCompleted", {
            entityId,
            position,
            valid: result.isValid,
            errors: result.errors,
        });
    };
}
