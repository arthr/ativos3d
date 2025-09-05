import type { Entity, EntityId, ValidationResult } from "@core/types";
import type { Vec3 } from "@core/geometry";
import type { EventBus } from "@core/events/EventBus";
import type { ValidationEvents } from "@core/types/events/ValidationEvents";

/**
 * Função que valida uma entidade em uma posição
 */
export type Validator = (entity: Entity, position: Vec3) => ValidationResult;

/**
 * Sistema responsável por coordenar a validação de entidades
 */
export class ValidationSystem {
    private static instance: ValidationSystem | null = null;
    private readonly validators: Validator[] = [];
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
     * Registra um novo validador
     */
    public registerValidator(validator: Validator): void {
        this.validators.push(validator);
    }

    /**
     * Executa os validadores sequencialmente e para ao encontrar um erro
     */
    public validate(entity: Entity, position: Vec3): ValidationResult {
        const errors: string[] = [];
        const warnings: string[] = [];

        for (const validator of this.validators) {
            const result = validator(entity, position);
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

        const result = this.validate(entity, position);
        this.eventBus.emit("validationCompleted", {
            entityId,
            position,
            valid: result.isValid,
            errors: result.errors,
        });
    };
}
