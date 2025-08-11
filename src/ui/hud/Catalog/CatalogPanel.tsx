import React from "react";
import Panel from "../../components/Panel";
import Button from "../../components/Button";
import { UI_COLORS } from "../../components/tokens";

export type CatalogItemView = { id: string; name: string; price: number };

export type CatalogPanelProps = {
  items: CatalogItemView[];
  selectedId?: string;
  onSelect: (id: string) => void;
};

export function CatalogPanel({ items, selectedId, onSelect }: CatalogPanelProps) {
  return (
    <Panel style={{ background: "rgba(255,255,255,0.95)" }}>
      <div style={{ fontWeight: 700, marginBottom: 6 }}>Catálogo</div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 6,
          maxHeight: 260,
          overflow: "auto",
        }}
      >
        {items.map((item) => (
          <Button
            key={item.id}
            onClick={() => onSelect(item.id)}
            active={selectedId === item.id}
            style={{ textAlign: "left", height: 38, padding: "0 10px" }}
          >
            <div style={{ fontWeight: 600, fontSize: 12 }}>{item.name}</div>
            <div style={{ fontWeight: 400, fontSize: 10, color: UI_COLORS.muted }}>
              {item.price}
            </div>
          </Button>
        ))}
      </div>
    </Panel>
  );
}

export default CatalogPanel;
