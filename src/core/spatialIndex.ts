import type { PlacedObject, Vec2 } from './types';
import { footprintAABB, rotateFootprint } from './geometry';
import type { CatalogItem } from './types';

export type AABB = { min: Vec2; max: Vec2 };

export type IndexedEntry = {
  id: string;
  aabb: AABB;
  obj: PlacedObject;
};

export class SpatialIndex {
  private entries: IndexedEntry[] = [];

  clear() {
    this.entries.length = 0;
  }

  insertObject(obj: PlacedObject, def: CatalogItem) {
    if (!def.footprint) return;
    const rot = rotateFootprint(def.footprint, obj.rot);
    const aabb = footprintAABB(rot, obj.pos);
    this.entries.push({ id: obj.id, aabb, obj });
  }

  queryAABB(aabb: AABB): IndexedEntry[] {
    // MVP: linear scan; consider quadtree later if perf needed
    return this.entries.filter(
      (e) =>
        !(
          e.aabb.max.x <= aabb.min.x ||
          aabb.max.x <= e.aabb.min.x ||
          e.aabb.max.y <= aabb.min.y ||
          aabb.max.y <= e.aabb.min.y
        ),
    );
  }
}
