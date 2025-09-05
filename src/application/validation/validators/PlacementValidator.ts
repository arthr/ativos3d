import type { Validator, ValidationContext, ValidationResult } from "@core/types";
import { createBoundsValidator, BoundsValidatorDependencies } from "./BoundsValidator";
import { creabObjectsCollisionValidator, ObjectsCollisionValidatorDependencies } from "./ObjectsCollisionValidator";

/**
 * Dependências para o PlacementValidator
 */
export type PlacementValidatorDependencies = BoundsValidatorDependencies & ObjectsCollisionValidatorDependencies;

/**
 * Cria um validator de placement que executa Bounds e Collision em sequência
 */
export function createPlacementValidator(deps: PlacementValidatorDependencies): Validator {
    const validators: Validator[] = [
        createBoundsValidator(deps),
        creabObjectsCollisionValidator(deps),
    ];

    return (context: ValidationContext): ValidationResult => {
        for (const validator of validators) {
            const result = validator(context);
            if(!result.isValid) return result;
        }
        return { isValid: true, errors: [] };
    }
}