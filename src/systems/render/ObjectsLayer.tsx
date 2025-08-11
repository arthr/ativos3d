import { useMemo, useCallback, useEffect } from "react";
import { useStore } from "../../store/useStore";
import { catalog } from "../../core/catalog";
import { CatalogItem3D } from "../../core/types";
import type { ThreeEvent } from "@react-three/fiber";
import { Instances, Instance } from "@react-three/drei";
import { useInstanceCapacity } from "./useInstanceCapacity";

export function ObjectsLayer() {
  const objects = useStore((s) => s.objects);
  const lot = useStore((s) => s.lot);
  const [capacity, updateCapacity] = useInstanceCapacity(objects.length);
  useEffect(() => {
    updateCapacity(lot.width * lot.depth);
  }, [lot.width, lot.depth, updateCapacity]);
  const setHover = useStore((s) => s.setHover);
  const setSelected = useStore((s) => s.setSelected);
  const hoverId = useStore((s) => s.hoverId);
  const selectedIds = useStore((s) => s.selectedIds);

  const idToItem = useMemo(() => {
    const map = new Map<string, CatalogItem3D>();
    for (const item of catalog as unknown as CatalogItem3D[]) map.set(item.id, item);
    return map;
  }, []);

  const handlePointerOver = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      const id = e.object?.userData?.objectId as string | undefined;
      setHover(id);
    },
    [setHover],
  );

  const handlePointerOut = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      setHover(undefined);
    },
    [setHover],
  );

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      const id = e.object?.userData?.objectId as string | undefined;
      if (id) setSelected([id]);
    },
    [setSelected],
  );

  return (
    <Instances limit={capacity} key={objects.length}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial />
      {objects.map((obj) => {
        const item = idToItem.get(obj.defId);
        if (!item) return null;

        let sx = 1,
          sy = 1,
          sz = 1;
        if (item.footprint?.kind === "box") {
          sx = item.footprint.w;
          sz = item.footprint.d;
          sy = item.footprint.h;
        }

        const isHovered = hoverId === obj.id;
        const isSelected = selectedIds.includes(obj.id);

        const base = item.art?.color ?? "#64748b";
        const color = isHovered || isSelected ? "#38bdf8" : base;

        // Corrigir offset do centro conforme rotação Y (0/90/180/270)
        const yawDeg = ((obj.rot.y % 360) + 360) % 360;
        const halfX = (yawDeg % 180 === 0 ? sx : sz) / 2;
        const halfZ = (yawDeg % 180 === 0 ? sz : sx) / 2;

        return (
          <Instance
            key={obj.id}
            userData={{ objectId: obj.id, defId: obj.defId }}
            position={[obj.pos.x + halfX, obj.pos.y + sy / 2, obj.pos.z + halfZ]}
            rotation={[0, (obj.rot.y * Math.PI) / 180, 0]}
            scale={[sx, sy, sz]}
            onPointerOver={handlePointerOver as any}
            onPointerOut={handlePointerOut as any}
            onClick={handleClick as any}
            color={color}
          />
        );
      })}
    </Instances>
  );
}
