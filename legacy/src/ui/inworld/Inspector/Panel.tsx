import React from "react";
import { PlacedObject3D } from "../../../core/types";
import { catalog } from "../../../core/catalog";
import { Panel } from "../../components/Panel";
import Button from "../../components/Button";

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
    <Panel data-hud="true" style={{ minWidth: 160 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 12 }}>{title}</div>
        <Button
          aria-label="Fechar"
          title="Fechar"
          onClick={onClose}
          style={{ height: 28, minWidth: 28, padding: "0 6px" }}
        >
          x
        </Button>
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
    </Panel>
  );
}

export default SelectedInspectorPanel;
