import { CatalogItem3D, PlacedObject3D, WallSegment3D, Vec3 } from "./types";
import { createDefaultPlacementPipeline } from "./placement/pipeline";
import type { ValidationResult } from "./placement/types";

// Fachada compatível: mantém a API pública estável e delega ao pipeline padrão
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
