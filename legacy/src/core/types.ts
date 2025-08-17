export type Vec3 = { x: number; y: number; z: number };

export type Footprint3D =
  | { kind: "box"; w: number; d: number; h: number; clearance?: number }
  | { kind: "poly"; points: Vec3[]; clearance?: number };

export type Slot3D = {
  id: string;
  type: string;
  localPos: Vec3;
  yawDeg?: 0 | 45 | 90 | 135 | 180 | 225 | 270 | 315;
};

export type CatalogItem3D = {
  id: string;
  name: string;
  price: number;
  category: "seating" | "surface" | "bed" | "decor" | "door" | "window" | "light" | "floor";
  tags: string[];
  variants?: string[];
  footprint?: Footprint3D;
  slots?: Slot3D[];
  art?: { modelUrl?: string; texture?: string; color?: string };
};

export type PlacedObject3D = {
  id: string;
  defId: string;
  pos: Vec3;
  rot: { x: number; y: number; z: number };
  variant?: string;
};

export type WallSegment3D = {
  ax: number;
  ay: number;
  az: number;
  bx: number;
  by: number;
  bz: number;
};

export type FloorTile3D = { x: number; z: number; tex: string };

export type Lot3D = {
  width: number;
  depth: number;
  height: number;
  objects: PlacedObject3D[];
  walls: WallSegment3D[];
  floor: FloorTile3D[];
  budget: { funds: number; spent: number };
  version: number;
};

// Ferramentas e modos de edição/visualização
export type Tool = "place" | "move" | "wall" | "floor" | "bulldoze" | "eyedropper";

export type Mode = "view" | "build" | "buy";
