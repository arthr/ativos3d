import { StateCreator } from "zustand";

export interface CameraSlice {
  camera: {
    mode: "persp" | "ortho";
    controlsEnabled: boolean;
    gestureActive: boolean;
    setMode: (m: "persp" | "ortho") => void;
    setControlsEnabled: (enabled: boolean) => void;
    setGestureActive: (active: boolean) => void;
  };
}

export const createCameraSlice: StateCreator<CameraSlice, [], [], CameraSlice> = (set) => ({
  camera: {
    mode: "persp",
    controlsEnabled: true,
    gestureActive: false,
    setMode: (m) => set((s) => ({ camera: { ...s.camera, mode: m } })),
    setControlsEnabled: (enabled) =>
      set((s) => ({ camera: { ...s.camera, controlsEnabled: enabled } })),
    setGestureActive: (active) => set((s) => ({ camera: { ...s.camera, gestureActive: active } })),
  },
});
