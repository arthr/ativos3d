import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { snapToGrid } from "../toolUtils";
import { useStore } from "../../../store/useStore";
import { catalog } from "../../../core/catalog";
import { validatePlacement } from "../../../core/placement";
import { aabbIntersects } from "../../../core/geometry";
import { CatalogItem3D, PlacedObject3D } from "../../../core/types";
import { buildObjectAabbIndex } from "../../../core/sceneIndex";

export interface PlacementPreview {
  pos: THREE.Vector3;
  w: number;
  h: number;
  d: number;
  color: string;
  yawDeg?: 0 | 90 | 180 | 270;
  valid?: boolean;
}

export function usePlacementPreview(yaw: 0 | 90 | 180 | 270) {
  const [preview, setPreview] = useState<PlacementPreview | null>(null);
  const indexRef = useRef<ReturnType<typeof buildObjectAabbIndex> | null>(null);
  const lastObjectsRef = useRef<PlacedObject3D[] | null>(null);

  useFrame(() => {
    const { activeTool, selectedCatalogId, objects, lot, input } = useStore.getState();
    if (activeTool !== "place" || !selectedCatalogId) {
      if (preview) setPreview(null);
      return;
    }
    const gp = input.groundPoint;
    if (!gp) {
      if (preview) setPreview(null);
      return;
    }
    const catalogItems = catalog as unknown as CatalogItem3D[];
    const item = catalogItems.find((i) => i.id === selectedCatalogId);
    if (!item) {
      if (preview) setPreview(null);
      return;
    }
    const fp = item.footprint;
    let baseW = 1;
    let baseD = 1;
    let baseH = 1;
    if (fp && fp.kind === "box") {
      baseW = fp.w;
      baseD = fp.d;
      baseH = fp.h;
    }
    const rotW = yaw % 180 === 0 ? baseW : baseD;
    const rotD = yaw % 180 === 0 ? baseD : baseW;
    const pos = snapToGrid(new THREE.Vector3(gp.x, gp.y, gp.z), "floor");

    if (lastObjectsRef.current !== objects) {
      indexRef.current = buildObjectAabbIndex(objects, catalogItems);
      lastObjectsRef.current = objects;
    }

    const candidate = {
      min: { x: pos.x, y: 0, z: pos.z },
      max: { x: pos.x + rotW, y: baseH, z: pos.z + rotD },
    };
    let fastOk = true;
    const neighbors = indexRef.current ? indexRef.current.query(candidate) : [];
    for (const b of neighbors) {
      if (aabbIntersects(candidate, b)) {
        fastOk = false;
        break;
      }
    }

    const valid =
      fastOk &&
      validatePlacement(
        { ...item, footprint: { w: rotW, d: rotD, h: baseH, kind: "box" } },
        { x: pos.x, y: 0, z: pos.z },
        { x: 0, y: yaw, z: 0 },
        objects,
        [],
        { width: lot.width, depth: lot.depth },
        catalogItems,
      ).ok;

    setPreview({
      pos,
      w: rotW,
      d: rotD,
      h: baseH,
      color: item.art?.color ?? "#64748b",
      yawDeg: yaw,
      valid,
    });
  });

  return preview;
}

