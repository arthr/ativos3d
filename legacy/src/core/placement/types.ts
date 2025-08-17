export type ValidationResult = {
  ok: boolean;
  reason?: string;
  warnings?: string[];
};

import type { CatalogItem3D, PlacedObject3D, WallSegment3D, Vec3 } from "../types";

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
