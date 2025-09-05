import type { Vec3 } from "../../geometry/types/Vec3";
import type { Entity } from "../ecs/Entity";
import type { EntityId } from "../ecs/EntityId";
import type { ValidationResult } from "../ecs/Component";

/**
 * Contexto de validação
 */
export interface ValidationContext {
    entityId: EntityId;
    position: Vec3;
    entity?: Entity;
    rotation?: Vec3;
}

/**
 * Função que valida um contexto
 */
export type Validator = (context: ValidationContext) => ValidationResult;

/**
 * Pipeline de validação
 */
export interface ValidationPipeline {
    validate: (context: ValidationContext) => ValidationResult;
    addValidator: (validator: Validator) => void;
    removeValidator: (validator: Validator) => void;
}
