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
	walls: WallSegment3D[]
): ValidationResult {
	// Snap (MVP: snap a grid; slots/parede depois)
	// Colisão (AABB simplificado)
	if (item.footprint) {
		const aabb = footprintAABB3D(item.footprint, pos);
		for (const obj of existing) {
			// assumir mesmo footprint do def? MVP ignora
			void obj;
		}
		void walls;
		void aabb;
	}
	return { ok: true };
}
