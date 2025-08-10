import { create } from "zustand";
import { FloorTile3D, PlacedObject3D, WallSegment3D, Mode, Tool } from "../core/types";
import { isToolAllowedInMode, modeToTools } from "../core/modeMachine";

// Tool agora vem de core/types

export interface Command {
  // execute pode retornar false para sinalizar falha e impedir push no histórico
  execute: () => boolean | void;
  undo: () => void;
  description: string;
}

export interface Lot3DState {
  width: number;
  depth: number;
  height: number;
}

export interface BudgetState {
  funds: number;
  spent: number;
}

export interface AppState {
  lot: Lot3DState;
  budget: BudgetState;
  mode: Mode;
  activeTool: Tool;
  cameraMode: "persp" | "ortho";
  cameraControlsEnabled: boolean;
  cameraGestureActive: boolean;
  input: {
    pointerNdc: { x: number; y: number };
    groundPoint: { x: number; y: number; z: number } | null;
    keysDown: Record<string, boolean>;
  };
  undo: Command[];
  redo: Command[];
  objects: PlacedObject3D[];
  walls: WallSegment3D[];
  floor: FloorTile3D[];
  selectedIds: string[];
  hoverId?: string;
  selectedCatalogId?: string;
  setTool: (t: Tool) => void;
  setMode: (m: Mode) => void;
  setCameraMode: (m: "persp" | "ortho") => void;
  setCameraControlsEnabled: (enabled: boolean) => void;
  setCameraGestureActive: (active: boolean) => void;
  setPointerNdc: (x: number, y: number) => void;
  setGroundPoint: (gp: { x: number; y: number; z: number } | null) => void;
  setKeyDown: (code: string, down: boolean) => void;
  pushCommand: (c: Command) => void;
  undoOnce: () => void;
  redoOnce: () => void;
  setHover: (id?: string) => void;
  setSelected: (ids: string[]) => void;
  setSelectedCatalogId: (id?: string) => void;
}

export const useStore = create<AppState>((set, get) => ({
  lot: { width: 30, depth: 50, height: 3 },
  budget: { funds: 10000, spent: 0 },
  mode: "buy",
  activeTool: "place",
  cameraMode: "persp",
  cameraControlsEnabled: true,
  cameraGestureActive: false,
  input: { pointerNdc: { x: 0, y: 0 }, groundPoint: null, keysDown: {} },
  undo: [],
  redo: [],
  objects: [
    {
      id: "seed-table",
      defId: "table_small",
      pos: { x: 10, y: 0, z: 10 },
      rot: { x: 0, y: 0, z: 0 },
    },
    {
      id: "seed-chair-n",
      defId: "chair_basic",
      pos: { x: 10, y: 0, z: 9 },
      rot: { x: 0, y: 0, z: 0 },
    },
    {
      id: "seed-chair-s",
      defId: "chair_basic",
      pos: { x: 10, y: 0, z: 12 },
      rot: { x: 0, y: 180, z: 0 },
    },
    {
      id: "seed-sofa",
      defId: "sofa_basic",
      pos: { x: 5, y: 0, z: 5 },
      rot: { x: 0, y: 90, z: 0 },
    },
    {
      id: "seed-lamp",
      defId: "lamp_floor",
      pos: { x: 7, y: 0, z: 5 },
      rot: { x: 0, y: 0, z: 0 },
    },
    {
      id: "seed-bed",
      defId: "bed_single",
      pos: { x: 15, y: 0, z: 5 },
      rot: { x: 0, y: 270, z: 0 },
    },
  ],
  walls: [],
  floor: [],
  selectedIds: [],
  setTool: (t) => set({ activeTool: t, mode: t === "wall" || t === "floor" ? "build" : "buy" }),
  setMode: (m) =>
    set((s) => {
      if (m === "view") return { mode: m };
      const keepTool = isToolAllowedInMode(s.activeTool, m);
      const fallbackTool = modeToTools[m][0];
      return { mode: m, activeTool: keepTool ? s.activeTool : fallbackTool };
    }),
  setCameraMode: (m) => set({ cameraMode: m }),
  setCameraControlsEnabled: (enabled) => set({ cameraControlsEnabled: enabled }),
  setCameraGestureActive: (active) => set({ cameraGestureActive: active }),
  setPointerNdc: (x, y) => set((s) => ({ input: { ...s.input, pointerNdc: { x, y } } })),
  setGroundPoint: (gp) => set((s) => ({ input: { ...s.input, groundPoint: gp } })),
  setKeyDown: (code, down) =>
    set((s) => ({ input: { ...s.input, keysDown: { ...s.input.keysDown, [code]: down } } })),
  pushCommand: (c) =>
    set((s) => {
      const MAX = 100;
      const nextUndo = [...s.undo, c];
      if (nextUndo.length > MAX) nextUndo.splice(0, nextUndo.length - MAX);
      return { undo: nextUndo, redo: [] };
    }),
  undoOnce: () => {
    const { undo, redo } = get();
    const cmd = undo[undo.length - 1];
    if (!cmd) return;
    cmd.undo();
    set({ undo: undo.slice(0, -1), redo: [...redo, cmd] });
  },
  redoOnce: () => {
    const { undo, redo } = get();
    const cmd = redo[redo.length - 1];
    if (!cmd) return;
    cmd.execute();
    set({ redo: redo.slice(0, -1), undo: [...undo, cmd] });
  },
  setHover: (id) => set({ hoverId: id }),
  setSelected: (ids) => set({ selectedIds: ids }),
  setSelectedCatalogId: (id) => set({ selectedCatalogId: id }),
}));
