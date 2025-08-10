import React from "react";
import { PlacedObject3D } from "../../../core/types";
import { catalog } from "../../../core/catalog";

export type SelectedInspectorPanelProps = {
  id: string;
  selected: PlacedObject3D;
  title: string;
  price?: number;
  onClose: () => void;
};

export function SelectedInspectorPanel({
  id,
  selected,
  title,
  price,
  onClose,
}: SelectedInspectorPanelProps) {
  const { pos, rot } = selected;
  const def = catalog.find((d) => d.id === selected.defId);

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
      <div style={{ fontSize: 11, color: "#475569", marginTop: 6 }}>
        <div>
          <div>ID: {id}</div>
          <div>Tipo: {selected.defId}</div>
          <div>
            Posição: x: {pos.x}, y: {pos.y}, z: {pos.z}
          </div>
          <div>
            Rotação: x: {rot.x}°, y: {rot.y}°, z: {rot.z}°
          </div>
          <div>Categoria: {def?.category}</div>
          <div>Tags: {def?.tags?.join(", ")}</div>
        </div>
      </div>
    </div>
  );
}

export default SelectedInspectorPanel;
