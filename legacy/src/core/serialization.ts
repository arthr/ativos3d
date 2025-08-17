import { z } from "zod";

const Vec3Schema = z.object({ x: z.number(), y: z.number(), z: z.number() });

const PlacedObject3DSchema = z.object({
  id: z.string(),
  defId: z.string(),
  pos: Vec3Schema,
  rot: Vec3Schema,
  variant: z.string().optional(),
});

const WallSegment3DSchema = z.object({
  ax: z.number(),
  ay: z.number(),
  az: z.number(),
  bx: z.number(),
  by: z.number(),
  bz: z.number(),
});

const FloorTile3DSchema = z.object({
  x: z.number(),
  z: z.number(),
  tex: z.string(),
});

const BudgetSchema = z.object({ funds: z.number(), spent: z.number() });

export const Lot3DSchema = z.object({
  width: z.number(),
  depth: z.number(),
  height: z.number(),
  objects: z.array(PlacedObject3DSchema),
  walls: z.array(WallSegment3DSchema),
  floor: z.array(FloorTile3DSchema),
  budget: BudgetSchema,
  version: z.number(),
});

export function exportLot(lot: z.infer<typeof Lot3DSchema>, version: number = 1): string {
  return JSON.stringify({ version, lot }, null, 2);
}

export function importLot(json: string): { version: number; lot: unknown } {
  const parsed = JSON.parse(json);
  if (typeof parsed.version !== "number") throw new Error("Versão inválida");
  return parsed;
}
