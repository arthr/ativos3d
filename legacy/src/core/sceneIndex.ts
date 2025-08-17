import type { SpatialQueryIndex } from "./spatial";
import { createSpatialIndex } from "./spatial";
import { CatalogItem3D, PlacedObject3D } from "./types";
import { rotateFootprint3D, footprintAABB3D } from "./geometry";

export type BuildIndexOptions = {
  ignoreObjectId?: string;
  cellSize?: number;
};

export function buildObjectAabbIndex(
  objects: PlacedObject3D[],
  catalogItems: CatalogItem3D[],
  options: BuildIndexOptions = {},
): SpatialQueryIndex {
  const { ignoreObjectId, cellSize = 1 } = options;
  const index = createSpatialIndex({ cellSize });
  const idToItem = new Map<string, CatalogItem3D>();
  for (const it of catalogItems) idToItem.set(it.id, it);
  for (const obj of objects) {
    if (ignoreObjectId && obj.id === ignoreObjectId) continue;
    const def = idToItem.get(obj.defId);
    const fp = def?.footprint;
    if (!fp) continue;
    const rotated = rotateFootprint3D(fp, obj.rot);
    index.insert(footprintAABB3D(rotated, obj.pos));
  }
  return index;
}
