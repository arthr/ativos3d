// Implementação baseada em grid hashing 2D (XZ)
import type { SpatialQueryIndex, Aabb } from "./types";

type CellKey = string;

function forEachCoveredCell(aabb: Aabb, cell: number, fn: (key: CellKey) => void): void {
  const minCx = Math.floor(aabb.min.x / cell);
  const maxCx = Math.floor((aabb.max.x - 1e-6) / cell);
  const minCz = Math.floor(aabb.min.z / cell);
  const maxCz = Math.floor((aabb.max.z - 1e-6) / cell);
  for (let cx = minCx; cx <= maxCx; cx += 1) {
    for (let cz = minCz; cz <= maxCz; cz += 1) {
      fn(`${cx}:${cz}`);
    }
  }
}

export class GridSpatialIndex implements SpatialQueryIndex {
  private readonly cellSize: number;
  private readonly cells = new Map<CellKey, Aabb[]>();

  constructor(cellSize = 1) {
    this.cellSize = Math.max(0.1, cellSize);
  }

  insert(box: Aabb): void {
    forEachCoveredCell(box, this.cellSize, (key) => {
      const arr = this.cells.get(key) ?? [];
      arr.push(box);
      this.cells.set(key, arr);
    });
  }

  query(box: Aabb): Aabb[] {
    const seen = new Set<Aabb>();
    const results: Aabb[] = [];
    forEachCoveredCell(box, this.cellSize, (key) => {
      const arr = this.cells.get(key);
      if (!arr) return;
      for (const b of arr) {
        if (seen.has(b)) continue;
        seen.add(b);
        results.push(b);
      }
    });
    return results;
  }

  clear(): void {
    this.cells.clear();
  }
}
