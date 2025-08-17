export type ToastVariant = "success" | "error" | "info" | "warning";

export type Toast = {
  id: string;
  message: string;
  title?: string;
  variant?: ToastVariant;
  durationMs?: number;
  createdAt: number;
  entering?: boolean;
  exiting?: boolean;
};
