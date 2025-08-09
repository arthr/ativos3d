import type { Footprint, Vec2 } from './types';

export function rotateFootprint(fp: Footprint, rot: 0 | 90 | 180 | 270): Footprint {
  if (fp.kind === 'rect') {
    return rot % 180 === 0 ? fp : { ...fp, w: fp.h, h: fp.w };
  }
  const rad = (rot * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return {
    kind: 'poly',
    clearance: fp.clearance,
    points: fp.points.map((p) => ({ x: p.x * cos - p.y * sin, y: p.x * sin + p.y * cos })),
  };
}

export function footprintAABB(fp: Footprint, pos: Vec2): { min: Vec2; max: Vec2 } {
  if (fp.kind === 'rect') {
    return { min: { x: pos.x, y: pos.y }, max: { x: pos.x + fp.w, y: pos.y + fp.h } };
  }
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  for (const pt of fp.points) {
    const x = pos.x + pt.x;
    const y = pos.y + pt.y;
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }
  return { min: { x: minX, y: minY }, max: { x: maxX, y: maxY } };
}

export function intersects(a: Footprint, apos: Vec2, b: Footprint, bpos: Vec2): boolean {
  // Fast AABB rejection
  const aa = footprintAABB(a, apos);
  const bb = footprintAABB(b, bpos);
  if (
    aa.max.x <= bb.min.x ||
    bb.max.x <= aa.min.x ||
    aa.max.y <= bb.min.y ||
    bb.max.y <= aa.min.y
  ) {
    return false;
  }
  // Rect-rect exact
  if (a.kind === 'rect' && b.kind === 'rect') {
    return !(
      apos.x + a.w <= bpos.x ||
      bpos.x + b.w <= apos.x ||
      apos.y + a.h <= bpos.y ||
      bpos.y + b.h <= apos.y
    );
  }
  // Fallback: AABB overlap considered as intersect for MVP
  return true;
}
