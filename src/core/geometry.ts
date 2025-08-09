import { Footprint3D, Vec3 } from "./types";

export function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function rotateFootprint3D(
  fp: Footprint3D,
  rot: { x: number; y: number; z: number },
): Footprint3D {
  // MVP: suportar rotação em Y para box trocando w<->d quando múltiplos de 90
  if (fp.kind === "box") {
    const yaw = ((rot.y % 360) + 360) % 360;
    if (yaw % 180 === 0) return fp;
    return { ...fp, w: fp.d, d: fp.w };
  }
  if (fp.kind === "poly") return fp;
  return fp;
}

export function footprintAABB3D(fp: Footprint3D, pos: Vec3): { min: Vec3; max: Vec3 } {
  if (fp.kind === "box") {
    const min = { x: pos.x, y: pos.y, z: pos.z };
    const max = { x: pos.x + fp.w, y: pos.y + fp.h, z: pos.z + fp.d };
    return { min, max };
  }
  // Poly simplificado: usar bounding box de pontos
  const xs = fp.points.map((p) => p.x + pos.x);
  const ys = fp.points.map((p) => p.y + pos.y);
  const zs = fp.points.map((p) => p.z + pos.z);
  return {
    min: { x: Math.min(...xs), y: Math.min(...ys), z: Math.min(...zs) },
    max: { x: Math.max(...xs), y: Math.max(...ys), z: Math.max(...zs) },
  };
}

export function aabbIntersects(a: { min: Vec3; max: Vec3 }, b: { min: Vec3; max: Vec3 }): boolean {
  return !(
    a.max.x <= b.min.x ||
    a.min.x >= b.max.x ||
    a.max.y <= b.min.y ||
    a.min.y >= b.max.y ||
    a.max.z <= b.min.z ||
    a.min.z >= b.max.z
  );
}
