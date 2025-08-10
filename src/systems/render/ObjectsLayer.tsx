import { useMemo, useCallback, useState } from "react";
import { useStore } from "../../store/useStore";
import { catalog } from "../../core/catalog";
import { CatalogItem3D } from "../../core/types";

export function ObjectsLayer() {
  const objects = useStore((s) => s.objects);
  const setHover = useStore((s) => s.setHover);
  const setSelected = useStore((s) => s.setSelected);
  const hoverId = useStore((s) => s.hoverId);
  const selectedIds = useStore((s) => s.selectedIds);

  const idToItem = useMemo(() => {
    const map = new Map<string, CatalogItem3D>();
    for (const item of (catalog as unknown as CatalogItem3D[])) map.set(item.id, item);
    return map;
  }, []);

  const handlePointerOver = useCallback(
    (e: any) => {
      e.stopPropagation();
      const id = e.object?.userData?.objectId as string | undefined;
      setHover(id);
    },
    [setHover],
  );

  const handlePointerOut = useCallback(
    (e: any) => {
      e.stopPropagation();
      setHover(undefined);
    },
    [setHover],
  );

  const handleClick = useCallback(
    (e: any) => {
      e.stopPropagation();
      const id = e.object?.userData?.objectId as string | undefined;
      if (id) setSelected([id]);
    },
    [setSelected],
  );

  return (
    <group>
      {objects.map((obj) => {
        const item = idToItem.get(obj.defId);
        if (!item) return null;
        let w = 1, d = 1, h = 1;
        if (item.footprint && item.footprint.kind === "box") {
          w = item.footprint.w;
          d = item.footprint.d;
          h = item.footprint.h;
        }
        const color = item.art?.color ?? "#64748b";
        const isHovered = hoverId === obj.id;
        const isSelected = selectedIds.includes(obj.id);
        return (
          <mesh
            userData={{ objectId: obj.id, defId: obj.defId }}
            key={obj.id}
            position={[obj.pos.x + w / 2, obj.pos.y + h / 2, obj.pos.z + d / 2]}
            rotation={[0, (obj.rot.y * Math.PI) / 180, 0]}
            castShadow
            receiveShadow
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
            onClick={handleClick}
          >
            <boxGeometry args={[w, h, d]} />
            <meshStandardMaterial
              color={color}
              emissive={isHovered || isSelected ? "#38bdf8" : "#000"}
              emissiveIntensity={isSelected ? 0.6 : isHovered ? 0.25 : 0}
            />
          </mesh>
        );
      })}
    </group>
  );
}
