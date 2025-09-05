import type { Validator, ValidationContext, ValidationResult, Entity } from "@core/types";
import type { Footprint3D, Vec3 } from "@/core/geometry";
import { FootprintOperations, Vec3Factory } from "@/core/geometry";

/**
 * Dependências para o BoundsValidator
 */
export interface BoundsValidatorDependencies {
    getFootprint: (entity: Entity) => Footprint3D | null;
    getLot: () => { width: number; depth: number };
}

/**
 * Valida se o AABB do footprint rotacionado permanece dentro dos limites do lote
 */
export function createBoundsValidator(deps: BoundsValidatorDependencies): Validator {
    return({ entity, position, rotation }: ValidationContext): ValidationResult => {
        if(!entity) return { isValid: false, errors: ["Entidade não encontrada"] };

        const footprint = deps.getFootprint(entity);
        if(!footprint) return { isValid: true, errors: [] };

        const rot: Vec3 = rotation ?? Vec3Factory.create(0, 0, 0);
        const rotated = FootprintOperations.rotateFootprint3D(footprint, rot);
        const aabb = FootprintOperations.footprintAABB3D(rotated, position);
        const lot = deps.getLot();
        if(aabb.min.x < 0 || aabb.min.z < 0 || aabb.max.x > lot.width || aabb.max.z > lot.depth) {
            return { isValid: false, errors: ["Footprint está fora dos limites do lote"] };
        }
        return { isValid: true, errors: [] };
    }
}