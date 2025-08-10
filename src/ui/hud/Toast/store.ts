import { create } from "zustand";
import type { Toast } from "./types";

type ToastState = {
  maxToasts: number;
  toasts: Toast[];
  push: (t: Omit<Toast, "id" | "createdAt"> & { id?: string }) => string;
  remove: (id: string) => void;
  softRemove: (id: string) => void;
  clear: () => void;
};

export const useToastStore = create<ToastState>((set, get) => ({
  maxToasts: 5,
  toasts: [],
  push: (t) => {
    const id = t.id ?? crypto.randomUUID();
    const toast: Toast = {
      id,
      createdAt: Date.now(),
      durationMs: 3500,
      variant: "info",
      ...t,
      entering: true,
    };
    set((s) => ({ toasts: [...s.toasts, toast] }));
    // limpar flag entering após pequeno delay para habilitar transição CSS
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.map((x) => (x.id === id ? { ...x, entering: false } : x)) }));
    }, 10);
    // Remover com animação as mais antigas quando exceder o limite
    const { maxToasts } = get();
    const current = get().toasts;
    const active = current.filter((x) => !x.exiting);
    const overflow = Math.max(0, active.length - maxToasts);
    if (overflow > 0) {
      for (let i = 0; i < overflow; i += 1) {
        const candidate = active[i];
        if (candidate) get().softRemove(candidate.id);
      }
    }
    if (toast.durationMs && toast.durationMs > 0) {
      setTimeout(() => get().softRemove(id), toast.durationMs);
    }
    return id;
  },
  remove: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  softRemove: (id) => {
    const delayMs = 200; // duração da animação de saída
    set((s) => ({ toasts: s.toasts.map((t) => (t.id === id ? { ...t, exiting: true } : t)) }));
    setTimeout(() => get().remove(id), delayMs);
  },
  clear: () => set({ toasts: [] }),
}));
