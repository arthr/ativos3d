export type Aabb = {
  min: { x: number; y: number; z: number };
  max: { x: number; y: number; z: number };
};

export interface SpatialQueryIndex {
  insert(box: Aabb): void;
  query(box: Aabb): Aabb[];
  clear(): void;
}
