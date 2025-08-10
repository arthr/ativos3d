import { CatalogItem3D, PlacedObject3D, WallSegment3D, Vec3 } from "./types";
import { aabbIntersects, footprintAABB3D, rotateFootprint3D } from "./geometry";

export type ValidationResult = {
  ok: boolean;
  reason?: string;
  warnings?: string[];
};

// Chain of Responsibility: contexto e interface de validadores
export type PlacementContext = {
  item: CatalogItem3D;
  pos: Vec3;
  rot: { x: number; y: number; z: number };
  existing: PlacedObject3D[];
  walls: WallSegment3D[];
  lot: { width: number; depth: number };
  catalogItems: CatalogItem3D[];
};

export interface PlacementValidator {
  validate(ctx: PlacementContext): ValidationResult;
}

class BoundsValidator implements PlacementValidator {
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

class ObjectsCollisionValidator implements PlacementValidator {
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

export function createPlacementPipeline(validators: PlacementValidator[]) {
  return (ctx: PlacementContext): ValidationResult => {
    for (const v of validators) {
      const res = v.validate(ctx);
      if (!res.ok) return res;
    }
    return { ok: true };
  };
}

export function createDefaultPlacementPipeline() {
  return createPlacementPipeline([new BoundsValidator(), new ObjectsCollisionValidator()]);
}

// Wrapper compatível com a API anterior, agora usando o pipeline padrão
export function validatePlacement(
  item: CatalogItem3D,
  pos: Vec3,
  rot: { x: number; y: number; z: number },
  existing: PlacedObject3D[],
  walls: WallSegment3D[],
  lot: { width: number; depth: number },
  catalogItems: CatalogItem3D[],
): ValidationResult {
  const pipeline = createDefaultPlacementPipeline();
  return pipeline({ item, pos, rot, existing, walls, lot, catalogItems });
}
