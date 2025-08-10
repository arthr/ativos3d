import { create } from "zustand";
import type { Toast } from "./types";

type ToastState = {
  toasts: Toast[];
  push: (t: Omit<Toast, "id" | "createdAt"> & { id?: string }) => string;
  remove: (id: string) => void;
  clear: () => void;
};

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  push: (t) => {
    const id = t.id ?? crypto.randomUUID();
    const toast: Toast = {
      id,
      createdAt: Date.now(),
      durationMs: 3500,
      variant: "info",
      ...t,
    };
    set((s) => ({ toasts: [...s.toasts, toast] }));
    if (toast.durationMs && toast.durationMs > 0) {
      setTimeout(() => get().remove(id), toast.durationMs);
    }
    return id;
  },
  remove: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  clear: () => set({ toasts: [] }),
}));
