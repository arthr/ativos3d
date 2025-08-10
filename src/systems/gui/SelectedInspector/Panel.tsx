import React from "react";

export type SelectedInspectorPanelProps = {
  title: string;
  price?: number;
  onClose: () => void;
};

export function SelectedInspectorPanel({ title, price, onClose }: SelectedInspectorPanelProps) {
  return (
    <div
      data-hud="true"
      style={{
        background: "rgba(255,255,255,0.98)",
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        padding: 8,
        boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
        minWidth: 160,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 12 }}>{title}</div>
        <button
          onClick={onClose}
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 6,
            padding: "2px 6px",
            background: "#fff",
          }}
        >
          x
        </button>
      </div>
      {typeof price === "number" && (
        <div style={{ fontSize: 11, color: "#475569", marginTop: 6 }}>R$ {price}</div>
      )}
    </div>
  );
}

export default SelectedInspectorPanel;
