import { aabbIntersects, footprintAABB3D, rotateFootprint3D } from "../geometry";
import type { CatalogItem3D } from "../types";
import type { PlacementContext, PlacementValidator, ValidationResult } from "./types";

export class BoundsValidator implements PlacementValidator {
  validate(ctx: PlacementContext): ValidationResult {
    if (!ctx.item.footprint) return { ok: true };
    const rotatedFp = rotateFootprint3D(ctx.item.footprint, ctx.rot);
    const aabb = footprintAABB3D(rotatedFp, ctx.pos);
    if (
      aabb.min.x < 0 ||
      aabb.min.z < 0 ||
      aabb.max.x > ctx.lot.width ||
      aabb.max.z > ctx.lot.depth
    ) {
      return { ok: false, reason: "fora_dos_limites" };
    }
    return { ok: true };
  }
}

export class ObjectsCollisionValidator implements PlacementValidator {
  validate(ctx: PlacementContext): ValidationResult {
    if (!ctx.item.footprint) return { ok: true };
    const rotatedFp = rotateFootprint3D(ctx.item.footprint, ctx.rot);
    const aabb = footprintAABB3D(rotatedFp, ctx.pos);
    const idToItem = new Map<string, CatalogItem3D>();
    for (const it of ctx.catalogItems) idToItem.set(it.id, it);
    for (const obj of ctx.existing) {
      const def = idToItem.get(obj.defId);
      const fp = def?.footprint;
      if (!fp) continue;
      const other = footprintAABB3D(rotateFootprint3D(fp, obj.rot), obj.pos);
      if (aabbIntersects(aabb, other)) return { ok: false, reason: "colisao_objetos" };
    }
    return { ok: true };
  }
}
