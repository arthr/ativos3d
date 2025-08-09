export type Vec2 = { x: number; y: number };

export type Footprint =
  | { kind: 'rect'; w: number; h: number; clearance?: number }
  | { kind: 'poly'; points: Vec2[]; clearance?: number };

export type Slot = {
  id: string;
  type: string;
  localPos: Vec2;
  face?: 0 | 90 | 180 | 270;
};

export type CatalogItem = {
  id: string;
  name: string;
  price: number;
  category: 'seating' | 'surface' | 'bed' | 'decor' | 'door' | 'window' | 'light' | 'floor';
  tags: string[];
  variants?: string[];
  footprint?: Footprint;
  slots?: Slot[];
  art: { atlasFrame: string };
};

export type PlacedObject = {
  id: string;
  defId: string;
  pos: { x: number; y: number };
  rot: 0 | 90 | 180 | 270;
  variant?: string;
};

export type WallSegment = { ax: number; ay: number; bx: number; by: number };
export type FloorTile = { x: number; y: number; tex: string };

export type Lot = {
  width: number;
  height: number;
  objects: PlacedObject[];
  walls: WallSegment[];
  floor: FloorTile[];
  budget: { funds: number; spent: number };
  version: number;
};

export type ValidationResult = { ok: boolean; reason?: string; warnings?: string[] };
