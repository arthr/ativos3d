import data from "../../catalog.json";
import { z } from "zod";
import type { CatalogItem3D } from "./types";

const Vec3Schema = z.object({
  x: z.number(),
  y: z.number(),
  z: z.number(),
});

const FootprintBoxSchema = z.object({
  kind: z.literal("box"),
  w: z.number(),
  d: z.number(),
  h: z.number(),
  clearance: z.number().optional(),
});

const FootprintPolySchema = z.object({
  kind: z.literal("poly"),
  points: z.array(Vec3Schema).min(3),
  clearance: z.number().optional(),
});

const FootprintSchema = z.union([FootprintBoxSchema, FootprintPolySchema]);

const SlotSchema = z.object({
  id: z.string(),
  type: z.string(),
  localPos: Vec3Schema,
  yawDeg: z
    .union([
      z.literal(0),
      z.literal(45),
      z.literal(90),
      z.literal(135),
      z.literal(180),
      z.literal(225),
      z.literal(270),
      z.literal(315),
    ])
    .optional(),
});

const ArtSchema = z
  .object({
    modelUrl: z.string().url().optional(),
    texture: z.string().optional(),
    color: z.string().optional(),
  })
  .partial();

const CatalogItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  category: z.union([
    z.literal("seating"),
    z.literal("surface"),
    z.literal("bed"),
    z.literal("decor"),
    z.literal("door"),
    z.literal("window"),
    z.literal("light"),
    z.literal("floor"),
  ]),
  tags: z.array(z.string()).default([]),
  variants: z.array(z.string()).optional(),
  footprint: FootprintSchema.optional(),
  slots: z.array(SlotSchema).optional(),
  art: ArtSchema.optional(),
});

const CatalogSchema = z.array(CatalogItemSchema);

// Validar em runtime e exportar tipado
const parsed = CatalogSchema.parse(data);

export const catalog: CatalogItem3D[] = parsed as unknown as CatalogItem3D[];
