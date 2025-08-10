import { CatalogItem3D, PlacedObject3D, WallSegment3D, Vec3 } from "./types";
import { aabbIntersects, footprintAABB3D, rotateFootprint3D } from "./geometry";

export type ValidationResult = {
  ok: boolean;
  reason?: string;
  warnings?: string[];
};

export function validatePlacement(
  item: CatalogItem3D,
  pos: Vec3,
  rot: { x: number; y: number; z: number },
  existing: PlacedObject3D[],
  walls: WallSegment3D[],
  lot: { width: number; depth: number },
  catalogItems: CatalogItem3D[],
): ValidationResult {
  // Snap: tratado fora. Aqui validamos AABB e bounds simples do lote.
  // TODO: clearance, needs_wall, slots, portas/janelas, paredes.
  if (!item.footprint) return { ok: true };

  const rotatedFp = rotateFootprint3D(item.footprint, rot);
  const aabb = footprintAABB3D(rotatedFp, pos);
  if (aabb.min.x < 0 || aabb.min.z < 0 || aabb.max.x > lot.width || aabb.max.z > lot.depth)
    return { ok: false, reason: "fora_dos_limites" };

  const idToItem = new Map<string, CatalogItem3D>();
  for (const it of catalogItems) idToItem.set(it.id, it);

  for (const obj of existing) {
    const def = idToItem.get(obj.defId);
    const fp = def?.footprint;
    if (!fp) continue;
    const other = footprintAABB3D(rotateFootprint3D(fp, obj.rot), obj.pos);
    if (aabbIntersects(aabb, other)) return { ok: false, reason: "colisao_objetos" };
  }

  void walls;
  return { ok: true };
}
