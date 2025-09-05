import type { Validator, ValidationContext, ValidationResult } from "@core/types";
import type { Footprint3D, Vec3 } from "@core/geometry";
import type { Entity } from "@core/types";
import { FootprintOperations, AABBOperations, Vec3Factory } from "@core/geometry";

/**
 * Dependências para o ObjectsCollisionValidator
 */
export interface ObjectsCollisionValidatorDependencies {
    getExistingEntities: () => Entity[];
    getFootprint: (entity: Entity) => Footprint3D | null;
    getTransform: (entity: Entity) => { position: Vec3; rotation: Vec3 } | null;
}

/**
 * Valida colisão AABB  entre a entidade e outras já existentes
 */
export function creabObjectsCollisionValidator(deps: ObjectsCollisionValidatorDependencies): Validator {
    return ({ entity, position, rotation, entityId }: ValidationContext): ValidationResult => {
        if(!entity) return { isValid: false, errors: ["Entidade não encontrada"] };

        const footprint = deps.getFootprint(entity);
        if(!footprint) return { isValid: true, errors: [] };

        const rot: Vec3 = rotation ?? Vec3Factory.create(0, 0, 0);
        const rotated = FootprintOperations.rotateFootprint3D(footprint, rot);
        const aabb = FootprintOperations.footprintAABB3D(rotated, position);

        for (const other of deps.getExistingEntities()) {
            if(other.id === entityId) continue;
            const otherFp = deps.getFootprint(other);
            if(!otherFp) continue;
            const otherTr = deps.getTransform(other);
            if(!otherTr) continue;
            const otherRotated = FootprintOperations.rotateFootprint3D(otherFp, otherTr.rotation);
            const otherAabb = FootprintOperations.footprintAABB3D(otherRotated, otherTr.position);
            if(AABBOperations.intersects(aabb, otherAabb)) {
                return { isValid: false, errors: ["Colisão com outra entidade"] };
            }
        }

        return { isValid: true, errors: [] };
    }
}