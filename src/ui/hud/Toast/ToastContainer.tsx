import React from "react";
import { useToastStore } from "./store";

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const remove = useToastStore((s) => s.remove);
  return (
    <div
      data-hud="true"
      style={{
        position: "absolute",
        top: 92,
        right: 16,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        pointerEvents: "none",
      }}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            pointerEvents: "auto",
            minWidth: 260,
            maxWidth: 360,
            padding: 12,
            borderRadius: 8,
            background: variantBg(t.variant),
            color: "#111827",
            boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
          }}
          role="status"
          aria-live="polite"
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <strong style={{ flex: 1 }}>{t.title ?? labelFor(t.variant)}</strong>
            <button
              onClick={() => remove(t.id)}
              style={{
                background: "transparent",
                border: 0,
                color: "#374151",
                cursor: "pointer",
                fontSize: 16,
              }}
            >
              ×
            </button>
          </div>
          <div style={{ marginTop: 4, fontSize: 14, color: "#1f2937" }}>{t.message}</div>
        </div>
      ))}
    </div>
  );
}

function variantBg(variant: string | undefined): string {
  switch (variant) {
    case "success":
      return "#d1fae5";
    case "error":
      return "#fee2e2";
    case "warning":
      return "#fef3c7";
    case "info":
    default:
      return "#e5e7eb";
  }
}

function labelFor(variant: string | undefined): string {
  switch (variant) {
    case "success":
      return "Sucesso";
    case "error":
      return "Erro";
    case "warning":
      return "Aviso";
    case "info":
    default:
      return "Info";
  }
}
