import { Html } from "@react-three/drei";
import { useMemo } from "react";
import { useStore } from "../../store/useStore";
import { catalog } from "../../core/catalog";
import type { CatalogItem3D } from "../../core/types";

export function SelectedInspectorGui() {
  const selectedIds = useStore((s) => s.selectedIds);
  const objects = useStore((s) => s.objects);
  const setSelected = useStore((s) => s.setSelected);

  const idToItem = useMemo(() => {
    const map = new Map<string, CatalogItem3D>();
    for (const item of catalog as unknown as CatalogItem3D[]) map.set(item.id, item);
    return map;
  }, []);

  const selected = selectedIds.length ? objects.find((o) => o.id === selectedIds[0]) : undefined;
  if (!selected) return null;

  let w = 1,
    d = 1,
    h = 1;
  const def = idToItem.get(selected.defId);
  if (def?.footprint && def.footprint.kind === "box") {
    w = def.footprint.w;
    d = def.footprint.d;
    h = def.footprint.h;
  }

  const cx = selected.pos.x + w / 2;
  const cy = selected.pos.y + h + 0.15;
  const cz = selected.pos.z + d / 2;

  const onClose = () => setSelected([]);

  return (
    <group position={[cx, cy, cz]} rotation={[0, (selected.rot.y * Math.PI) / 180, 0]}>
      <Html center occlude distanceFactor={8} style={{ pointerEvents: "auto" }} transform>
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
            <div style={{ fontWeight: 800, fontSize: 12 }}>{def?.name ?? selected.defId}</div>
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
          {typeof def?.price === "number" && (
            <div style={{ fontSize: 11, color: "#475569", marginTop: 6 }}>R$ {def.price}</div>
          )}
        </div>
      </Html>
    </group>
  );
}

export default SelectedInspectorGui;
