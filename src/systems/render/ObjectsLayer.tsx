import { useMemo, useCallback } from "react";
import { useStore } from "../../store/useStore";
import { catalog } from "../../core/catalog";
import { CatalogItem3D } from "../../core/types";
import type { ThreeEvent } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { Instances, Instance } from "@react-three/drei";

export function ObjectsLayer() {
  const objects = useStore((s) => s.objects);
  const lot = useStore((s) => s.lot);
  const [capacity, setCapacity] = useState(() =>
    Math.max(lot.width * lot.depth, objects.length, 1),
  );
  useEffect(() => {
    const target = Math.max(lot.width * lot.depth, objects.length, capacity);
    if (target > capacity) setCapacity(Math.max(target, capacity * 2));
  }, [objects.length, lot.width, lot.depth, capacity]);
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
    <Instances limit={capacity} range={objects.length}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial vertexColors />
      {objects.map((obj) => {
        const item = idToItem.get(obj.defId);
        if (!item) return null;
        let sx = 1,
          sz = 1,
          sy = 1;
        if (item.footprint && item.footprint.kind === "box") {
          sx = item.footprint.w;
          sz = item.footprint.d;
          sy = item.footprint.h;
        }
        const isHovered = hoverId === obj.id;
        const isSelected = selectedIds.includes(obj.id);
        const emissive = isHovered || isSelected ? "#38bdf8" : "#000";
        const emissiveIntensity = isSelected ? 0.6 : isHovered ? 0.25 : 0;
        const color = item.art?.color ?? "#64748b";
        return (
          <Instance
            key={obj.id}
            userData={{ objectId: obj.id, defId: obj.defId }}
            position={[obj.pos.x + sx / 2, obj.pos.y + sy / 2, obj.pos.z + sz / 2]}
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
