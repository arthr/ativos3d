import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { CommandStack, type Command } from '../core/commandStack';
import { loadCatalog } from '../core/catalog';
import type { CatalogItem, Lot, PlacedObject, Vec2, WallSegment } from '../core/types';
import { validatePlacement } from '../core/placement';

export type Tool =
  | { kind: 'place'; item: CatalogItem | null; rot: 0 | 90 | 180 | 270 }
  | { kind: 'move' }
  | { kind: 'wall' }
  | { kind: 'floor'; item: CatalogItem | null }
  | { kind: 'bulldoze' }
  | { kind: 'eyedropper' };

export type Ephemeral = {
  hover: Vec2 | null;
  previewValid?: boolean;
  previewReason?: string;
  draggingId?: string | null;
  wallDragStart?: Vec2 | null;
};

export type StoreState = {
  lot: Lot;
  catalog: { items: CatalogItem[]; byId: Map<string, CatalogItem> };
  tool: Tool;
  selection: string | null; // object id
  ep: Ephemeral;
  cmd: CommandStack;
  setTool(tool: Tool): void;
  setHover(pos: Vec2 | null): void;
  rotateTool(): void; // R
  clickAt(pos: Vec2): void;
  startDrag(pos: Vec2): void;
  dragTo(pos: Vec2): void;
  endDrag(pos: Vec2): void;
  placeObject(item: CatalogItem, x: number, y: number, rot: 0 | 90 | 180 | 270): void;
  removeObject(id: string): void;
  rotateSelected(): void;
  drawWalls(path: WallSegment[]): void;
  paintFloor(tiles: { x: number; y: number }[], tex: string, pricePer: number): void;
  bulldozeAt(pos: Vec2): void;
  eyedropAt(pos: Vec2): void;
  loadCatalog(): Promise<void>;
};

const initialLot: Lot = {
  width: 20,
  height: 20,
  objects: [],
  walls: [],
  floor: [],
  budget: { funds: 9999, spent: 0 },
  version: 1,
};

function findObjectAt(lot: Lot, catalog: Map<string, CatalogItem>, pos: Vec2): PlacedObject | null {
  for (let i = lot.objects.length - 1; i >= 0; i--) {
    const o = lot.objects[i];
    const def = catalog.get(o.defId);
    if (!def?.footprint || def.footprint.kind !== 'rect') continue;
    const { x, y } = pos;
    if (
      x >= o.pos.x &&
      x < o.pos.x + def.footprint.w &&
      y >= o.pos.y &&
      y < o.pos.y + def.footprint.h
    ) {
      return o;
    }
  }
  return null;
}

export const useStore = create<StoreState>((set, get) => ({
  lot: initialLot,
  catalog: { items: [], byId: new Map() },
  tool: { kind: 'place', item: null, rot: 0 },
  selection: null,
  ep: { hover: null },
  cmd: new CommandStack(),

  setTool(tool) {
    set({ tool });
  },

  setHover(pos) {
    const s = get();
    if (s.tool.kind === 'place' && s.tool.item && pos) {
      const res = validatePlacement(s.tool.item, pos, s.tool.rot, {
        lot: s.lot,
        defById: s.catalog.byId,
      });
      set({ ep: { ...s.ep, hover: pos, previewValid: res.ok, previewReason: res.reason } });
    } else {
      set({ ep: { ...s.ep, hover: pos } });
    }
  },

  rotateTool() {
    set((s) => {
      if (s.tool.kind === 'place')
        return { tool: { ...s.tool, rot: ((s.tool.rot + 90) % 360) as 0 | 90 | 180 | 270 } };
      if (s.selection) {
        const objects = s.lot.objects.map((o) =>
          o.id === s.selection ? { ...o, rot: ((o.rot + 90) % 360) as 0 | 90 | 180 | 270 } : o,
        );
        return { lot: { ...s.lot, objects } };
      }
      return s;
    });
  },

  async loadCatalog() {
    const c = await loadCatalog();
    set({ catalog: { items: c.items, byId: c.byId } });
  },

  clickAt(pos) {
    const s = get();
    const { lot, catalog, tool } = s;
    const tile = { x: Math.floor(pos.x), y: Math.floor(pos.y) };

    if (tool.kind === 'place' && tool.item) {
      const res = validatePlacement(tool.item, tile, tool.rot, { lot, defById: catalog.byId });
      if (!res.ok) return;
      s.placeObject(tool.item, tile.x, tile.y, tool.rot);
      return;
    }

    if (tool.kind === 'bulldoze') {
      s.bulldozeAt(tile);
      return;
    }

    if (tool.kind === 'floor' && tool.item) {
      s.paintFloor([tile], tool.item.art.atlasFrame, tool.item.price);
      return;
    }

    if (tool.kind === 'eyedropper') {
      s.eyedropAt(tile);
      return;
    }

    if (tool.kind === 'move') {
      const hit = findObjectAt(lot, catalog.byId, tile);
      set({ selection: hit?.id ?? null });
    }
  },

  startDrag(pos) {
    const s = get();
    const tile = { x: Math.floor(pos.x), y: Math.floor(pos.y) };
    if (s.tool.kind === 'move') {
      const hit = findObjectAt(s.lot, s.catalog.byId, tile);
      set({ ep: { ...s.ep, draggingId: hit?.id ?? null } });
      return;
    }
    if (s.tool.kind === 'wall') {
      set({ ep: { ...s.ep, wallDragStart: tile } });
    }
    if (s.tool.kind === 'floor' && s.tool.item) {
      s.paintFloor([tile], s.tool.item.art.atlasFrame, s.tool.item.price);
    }
  },

  dragTo(pos) {
    const s = get();
    if (s.tool.kind === 'move' && s.ep.draggingId) {
      const tile = { x: Math.floor(pos.x), y: Math.floor(pos.y) };
      set({
        lot: {
          ...s.lot,
          objects: s.lot.objects.map((o) => (o.id === s.ep.draggingId ? { ...o, pos: tile } : o)),
        },
      });
    }
    if (s.tool.kind === 'floor' && s.tool.item) {
      const tile = { x: Math.floor(pos.x), y: Math.floor(pos.y) };
      s.paintFloor([tile], s.tool.item.art.atlasFrame, s.tool.item.price);
    }
  },

  endDrag(pos) {
    const s = get();
    if (s.tool.kind === 'move') {
      set({ ep: { ...s.ep, draggingId: null } });
    }
    if (s.tool.kind === 'wall' && s.ep.wallDragStart) {
      const a = s.ep.wallDragStart;
      const b = { x: Math.floor(pos.x), y: Math.floor(pos.y) };
      const path: WallSegment[] = [];
      if (a.x === b.x || a.y === b.y) {
        path.push({ ax: a.x, ay: a.y, bx: b.x, by: b.y });
      } else {
        // quebrar em L: horizontal depois vertical
        path.push({ ax: a.x, ay: a.y, bx: b.x, by: a.y });
        path.push({ ax: b.x, ay: a.y, bx: b.x, by: b.y });
      }
      s.drawWalls(path);
      set({ ep: { ...s.ep, wallDragStart: null } });
    }
  },

  placeObject(item, x, y, rot) {
    const cmd: Command = {
      description: `add ${item.name}`,
      execute() {
        set((s) => ({
          lot: {
            ...s.lot,
            objects: [...s.lot.objects, { id: nanoid(), defId: item.id, pos: { x, y }, rot }],
            budget: { ...s.lot.budget, spent: s.lot.budget.spent + item.price },
          },
        }));
      },
      undo() {
        set((s) => {
          const last = [...s.lot.objects]
            .reverse()
            .find((o) => o.defId === item.id && o.pos.x === x && o.pos.y === y && o.rot === rot);
          if (!last) return s;
          return {
            lot: {
              ...s.lot,
              objects: s.lot.objects.filter((o) => o !== last),
              budget: { ...s.lot.budget, spent: s.lot.budget.spent - item.price },
            },
          };
        });
      },
    };
    get().cmd.push(cmd);
  },

  removeObject(id) {
    const s = get();
    const obj = s.lot.objects.find((o) => o.id === id);
    if (!obj) return;
    const def = s.catalog.byId.get(obj.defId);
    const price = def?.price ?? 0;
    const cmd: Command = {
      description: 'delete object',
      execute() {
        set((s2) => ({
          lot: {
            ...s2.lot,
            objects: s2.lot.objects.filter((o) => o.id !== id),
            budget: { ...s2.lot.budget, spent: s2.lot.budget.spent - price },
          },
        }));
      },
      undo() {
        set((s2) => ({
          lot: {
            ...s2.lot,
            objects: [...s2.lot.objects, obj],
            budget: { ...s2.lot.budget, spent: s2.lot.budget.spent + price },
          },
        }));
      },
    };
    s.cmd.push(cmd);
  },

  rotateSelected() {
    set((s) => {
      if (!s.selection) return s;
      const objects = s.lot.objects.map((o) =>
        o.id === s.selection ? { ...o, rot: ((o.rot + 90) % 360) as 0 | 90 | 180 | 270 } : o,
      );
      return { lot: { ...s.lot, objects } };
    });
  },

  drawWalls(path) {
    const cmd: Command = {
      description: 'draw walls',
      execute() {
        set((s) => ({ lot: { ...s.lot, walls: [...s.lot.walls, ...path] } }));
      },
      undo() {
        set((s) => ({
          lot: { ...s.lot, walls: s.lot.walls.slice(0, s.lot.walls.length - path.length) },
        }));
      },
    };
    get().cmd.push(cmd);
  },

  paintFloor(tiles, tex, pricePer) {
    const cmd: Command = {
      description: 'paint floor',
      execute() {
        set((s) => {
          const keyOf = (x: number, y: number) => `${x},${y}` as `${number},${number}`;
          const existing = new Map<`${number},${number}`, { x: number; y: number; tex: string }>(
            s.lot.floor.map((t) => [keyOf(t.x, t.y), t] as const),
          );
          let delta = 0;
          for (const t of tiles) {
            const key = keyOf(t.x, t.y);
            if (!existing.has(key)) {
              existing.set(key, { x: t.x, y: t.y, tex });
              delta += pricePer;
            } else {
              existing.set(key, { x: t.x, y: t.y, tex });
            }
          }
          return {
            lot: {
              ...s.lot,
              floor: [...existing.values()],
              budget: { ...s.lot.budget, spent: s.lot.budget.spent + delta },
            },
          };
        });
      },
      undo() {
        // MVP: não reverte custo de repintura que apenas troca textura
      },
    };
    get().cmd.push(cmd);
  },

  bulldozeAt(pos) {
    const s = get();
    const tile = { x: Math.floor(pos.x), y: Math.floor(pos.y) };
    const hit = findObjectAt(s.lot, s.catalog.byId, tile);
    if (hit) {
      s.removeObject(hit.id);
      return;
    }
    // remover piso
    const before = s.lot.floor.length;
    set((st) => ({
      lot: { ...st.lot, floor: st.lot.floor.filter((t) => !(t.x === tile.x && t.y === tile.y)) },
    }));
    if (before !== get().lot.floor.length) return;
    // remover parede: remove segmentos que passam pelo tile
    set((st) => ({
      lot: {
        ...st.lot,
        walls: st.lot.walls.filter(
          (w) =>
            !(
              (w.ay === w.by &&
                w.ay === tile.y &&
                ((w.ax <= tile.x && tile.x < w.bx) || (w.bx <= tile.x && tile.x < w.ax))) ||
              (w.ax === w.bx &&
                w.ax === tile.x &&
                ((w.ay <= tile.y && tile.y < w.by) || (w.by <= tile.y && tile.y < w.ay)))
            ),
        ),
      },
    }));
  },

  eyedropAt(pos) {
    const s = get();
    const tile = { x: Math.floor(pos.x), y: Math.floor(pos.y) };
    const hit = findObjectAt(s.lot, s.catalog.byId, tile);
    if (hit) {
      const def = s.catalog.byId.get(hit.defId) ?? null;
      set({ tool: { kind: 'place', item: def, rot: hit.rot } });
      return;
    }
    const ft = s.lot.floor.find((t) => t.x === tile.x && t.y === tile.y);
    if (ft) {
      const item =
        s.catalog.items.find((i) => i.category === 'floor' && i.art.atlasFrame === ft.tex) ?? null;
      set({ tool: { kind: 'floor', item } });
    }
  },
}));
