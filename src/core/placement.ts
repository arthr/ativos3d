import { CatalogItem3D, PlacedObject3D, WallSegment3D, Vec3 } from "./types";
import { aabbIntersects, footprintAABB3D } from "./geometry";

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
): ValidationResult {
  // Snap: tratado fora (caller). Aqui validamos colisão de AABB básico e bounds do lote.
  // TODO: clearance, needs_wall, slots, portas/janelas.
  const lot = { width: 1e9, depth: 1e9 }; // TODO: receber lot via argumento
  if (item.footprint) {
    const aabb = footprintAABB3D(item.footprint, pos);
    // Bounds do lote (placeholder grande até integrar lot real)
    if (aabb.min.x < 0 || aabb.min.z < 0 || aabb.max.x > lot.width || aabb.max.z > lot.depth)
      return { ok: false, reason: "fora_dos_limites" };

    // Colisão simples com objetos existentes (AABB aproximado)
    for (const obj of existing) {
      // TODO: buscar footprint do defId
      void obj;
    }
    void walls;
  }
  return { ok: true };
}
