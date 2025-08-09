import { footprintAABB, intersects, rotateFootprint } from './geometry';
import type { CatalogItem, Lot, PlacedObject, ValidationResult, Vec2 } from './types';

export type SceneLike = {
  lot: Lot;
  defById: Map<string, CatalogItem>;
};

function occupiedKey(x: number, y: number): string {
  return `${x},${y}`;
}

export function buildOccupiedTiles(lot: Lot, defById: Map<string, CatalogItem>): Set<string> {
  const occ = new Set<string>();
  for (const o of lot.objects) {
    const def = defById.get(o.defId);
    if (!def?.footprint) continue;
    const fp = rotateFootprint(def.footprint, o.rot);
    const aabb = footprintAABB(fp, o.pos);
    for (let y = Math.floor(aabb.min.y); y < Math.ceil(aabb.max.y); y++) {
      for (let x = Math.floor(aabb.min.x); x < Math.ceil(aabb.max.x); x++) {
        occ.add(occupiedKey(x, y));
      }
    }
  }
  return occ;
}

export function hasWallBehind(obj: PlacedObject, walls: Lot['walls']): boolean {
  // MVP: verifica se há parede colinear atrás baseado em rot (0: norte, 90:leste, 180:sul, 270:oeste)
  const dir: Record<typeof obj.rot, Vec2> = {
    0: { x: 0, y: -1 },
    90: { x: 1, y: 0 },
    180: { x: 0, y: 1 },
    270: { x: -1, y: 0 },
  } as const;
  const back = { x: obj.pos.x - dir[obj.rot].x, y: obj.pos.y - dir[obj.rot].y };
  return walls.some(
    (w) =>
      (w.ay === w.by &&
        w.ay === back.y &&
        ((w.ax <= back.x && back.x < w.bx) || (w.bx <= back.x && back.x < w.ax))) ||
      (w.ax === w.bx &&
        w.ax === back.x &&
        ((w.ay <= back.y && back.y < w.by) || (w.by <= back.y && back.y < w.ay))),
  );
}

export function findSnapSlot(
  item: CatalogItem,
  pos: Vec2,
  rot: number,
  scene: SceneLike,
): { slotPos: Vec2; rot: number } | null {
  // MVP: não implementado (cadeiras em borda de mesa). Retornar null por ora.
  return null;
}

export function validatePlacement(
  item: CatalogItem,
  pos: Vec2,
  rot: 0 | 90 | 180 | 270,
  scene: SceneLike,
): ValidationResult {
  // 1) Snap (MVP: apenas grid snapping já feito externamente)

  // 2) Colisão footprint vs objetos
  if (item.footprint) {
    const fp = rotateFootprint(item.footprint, rot);
    const testAABB = footprintAABB(fp, pos);
    for (const other of scene.lot.objects) {
      const otherDef = scene.defById.get(other.defId);
      if (!otherDef?.footprint) continue;
      const otherFP = rotateFootprint(otherDef.footprint, other.rot);
      if (intersects(fp, pos, otherFP, other.pos)) {
        // AABB já filtra grosso modo
        const otherAABB = footprintAABB(otherFP, other.pos);
        const overlap = !(
          testAABB.max.x <= otherAABB.min.x ||
          otherAABB.max.x <= testAABB.min.x ||
          testAABB.max.y <= otherAABB.min.y ||
          otherAABB.max.y <= testAABB.min.y
        );
        if (overlap) return { ok: false, reason: 'collision' };
      }
    }
  }

  // 3) Clearance
  const clearance = item.footprint?.clearance ?? 0;
  if (clearance > 0 && item.footprint) {
    const fp = rotateFootprint(item.footprint, rot);
    const aabb = footprintAABB(fp, pos);
    const minx = Math.floor(aabb.min.x) - clearance;
    const maxx = Math.ceil(aabb.max.x) + clearance - 1;
    const miny = Math.floor(aabb.min.y) - clearance;
    const maxy = Math.ceil(aabb.max.y) + clearance - 1;
    for (let y = miny; y <= maxy; y++) {
      for (let x = minx; x <= maxx; x++) {
        // fora da própria área interna do footprint, mas simples no MVP
        const occupied = scene.lot.objects.some((o) => o.pos.x === x && o.pos.y === y);
        if (occupied) return { ok: false, reason: 'clearance' };
      }
    }
  }

  // 4) Requisitos
  if (item.tags.includes('needs_wall')) {
    const probe: PlacedObject = { id: 'probe', defId: item.id, pos, rot };
    if (!hasWallBehind(probe, scene.lot.walls)) return { ok: false, reason: 'needs_wall' };
  }

  // portas/janelas no MVP: impedir se não houver parede; permitir se houver
  if (item.category === 'door' || item.category === 'window') {
    const probe: PlacedObject = { id: 'probe', defId: item.id, pos, rot };
    if (!hasWallBehind(probe, scene.lot.walls)) return { ok: false, reason: 'needs_wall' };
  }

  return { ok: true };
}
