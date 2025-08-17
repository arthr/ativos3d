import { StateCreator } from "zustand";

export interface InputSlice {
  input: {
    pointerNdc: { x: number; y: number };
    groundPoint: { x: number; y: number; z: number } | null;
    keysDown: Record<string, boolean>;
    setPointerNdc: (x: number, y: number) => void;
    setGroundPoint: (gp: { x: number; y: number; z: number } | null) => void;
    setKeyDown: (code: string, down: boolean) => void;
  };
}

export const createInputSlice: StateCreator<InputSlice, [], [], InputSlice> = (set) => ({
  input: {
    pointerNdc: { x: 0, y: 0 },
    groundPoint: null,
    keysDown: {},
    setPointerNdc: (x, y) =>
      set((s) => ({ input: { ...s.input, pointerNdc: { x, y } } })),
    setGroundPoint: (gp) =>
      set((s) => ({ input: { ...s.input, groundPoint: gp } })),
    setKeyDown: (code, down) =>
      set((s) => ({
        input: {
          ...s.input,
          keysDown: { ...s.input.keysDown, [code]: down },
        },
      })),
  },
});

