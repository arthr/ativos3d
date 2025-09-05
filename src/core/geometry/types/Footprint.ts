/**
 * Representa a área ocupada por um objeto no espaço 3D.
 * Pode ser um box ou um polígono em 3D.
 */
import type { Vec3 } from "./Vec3";

export type Footprint3D = {
    kind: "box";
    w: number;
    d: number;
    h: number;
    clearance?: number;
} | {
    kind: "poly";
    points: Vec3[];
    clearance?: number;
};