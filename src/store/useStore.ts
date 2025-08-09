import { create } from "zustand";
import { FloorTile3D, PlacedObject3D, WallSegment3D } from "../core/types";

export type Tool = "place" | "move" | "wall" | "floor" | "bulldoze" | "eyedropper";

export interface Command {
  execute: () => void;
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
  activeTool: Tool;
  cameraControlsEnabled: boolean;
  undo: Command[];
  redo: Command[];
  objects: PlacedObject3D[];
  walls: WallSegment3D[];
  floor: FloorTile3D[];
  selectedIds: string[];
  hoverId?: string;
  selectedCatalogId?: string;
  setTool: (t: Tool) => void;
  setCameraControlsEnabled: (enabled: boolean) => void;
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
  activeTool: "place",
  cameraControlsEnabled: true,
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
  setTool: (t) => set({ activeTool: t }),
  setCameraControlsEnabled: (enabled) => set({ cameraControlsEnabled: enabled }),
  pushCommand: (c) => set((s) => ({ undo: [...s.undo, c], redo: [] })),
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
