export * from "./types";
export * from "./GridSpatialIndex";

export type SpatialIndexFactoryOptions = { cellSize?: number };

import { GridSpatialIndex } from "./GridSpatialIndex";
import type { SpatialQueryIndex } from "./types";

export function createSpatialIndex(options: SpatialIndexFactoryOptions = {}): SpatialQueryIndex {
  const { cellSize = 1 } = options;
  return new GridSpatialIndex(cellSize);
}
