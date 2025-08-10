import { Html } from "@react-three/drei";
import { useMemo } from "react";
import { useStore } from "../../../store/useStore";
import { catalog } from "../../../core/catalog";
import type { CatalogItem3D } from "../../../core/types";
import { SelectedInspectorPanel } from "./Panel";

export function SelectedInspector() {
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
  const cy = selected.pos.y + h + 1.15;
  const cz = selected.pos.z + d / 2;

  return (
    <group position={[cx, cy, cz]}>
      <Html center occlude distanceFactor={8} style={{ pointerEvents: "auto" }} transform sprite>
        <SelectedInspectorPanel
          id={selected.id}
          selected={selected}
          title={def?.name ?? selected.defId}
          price={def?.price}
          onClose={() => setSelected([])}
        />
      </Html>
    </group>
  );
}

export default SelectedInspector;
