import { useMemo, useCallback, useState } from "react";
import { useStore } from "../../store/useStore";
import { catalog } from "../../core/catalog";

export function ObjectsLayer() {
  const objects = useStore((s) => s.objects);
  const setHover = useStore((s) => s.setHover);
  const setSelected = useStore((s) => s.setSelected);
  const hoverId = useStore((s) => s.hoverId);
  const selectedIds = useStore((s) => s.selectedIds);

  const idToItem = useMemo(() => {
    const map = new Map<string, any>();
    for (const item of catalog as any[]) map.set(item.id, item);
    return map;
  }, []);

  const handlePointerOver = useCallback(
    (e: any) => {
      e.stopPropagation();
      const id = e.object?.userData?.idObjeto as string | undefined;
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
      const id = e.object?.userData?.idObjeto as string | undefined;
      if (id) setSelected([id]);
    },
    [setSelected],
  );

  return (
    <group>
      {objects.map((obj) => {
        const item = idToItem.get(obj.defId) as any;
        if (!item) return null;
        const fp = item.footprint as any;
        const w = fp?.w ?? 1;
        const d = fp?.d ?? 1;
        const h = fp?.h ?? 1;
        const color = item.art?.color ?? "#64748b";
        const isHovered = hoverId === obj.id;
        const isSelected = selectedIds.includes(obj.id);
        return (
          <mesh
            userData={{ idObjeto: obj.id, defId: obj.defId }}
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
