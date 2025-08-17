import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useStore } from "../../../../store/useStore";
import { snapToGrid } from "../../toolUtils";
import { aabbIntersects, footprintAABB3D, rotateFootprint3D } from "../../../../core/geometry";
import { buildObjectAabbIndex } from "../../../../core/sceneIndex";
import { catalog } from "../../../../core/catalog";
import type { CatalogItem3D, PlacedObject3D } from "../../../../core/types";
import type { MoveState } from "./state";

export interface MovePreview {
  pos: THREE.Vector3;
  w: number;
  h: number;
  d: number;
  valid: boolean;
}

export function useMovePreview(state: MoveState) {
  const [preview, setPreview] = useState<MovePreview | null>(null);
  const indexRef = useRef<ReturnType<typeof buildObjectAabbIndex> | null>(null);
  const lastObjectsRef = useRef<PlacedObject3D[] | null>(null);

  useFrame(() => {
    const { activeTool, input, selectedIds, objects, lot } = useStore.getState();
    if (activeTool !== "move" || !selectedIds.length) {
      if (preview) setPreview(null);
      return;
    }
    const gp = input.groundPoint;
    if (!gp) {
      if (preview) setPreview(null);
      return;
    }
    const id = selectedIds[0];
    const moving = objects.find((o) => o.id === id);
    if (!moving) {
      if (preview) setPreview(null);
      return;
    }

    const catalogItems = catalog as unknown as CatalogItem3D[];
    const movingDef = catalogItems.find((c) => c.id === moving.defId) as CatalogItem3D | undefined;
    const mfp = movingDef?.footprint;
    if (!mfp) {
      if (preview) setPreview(null);
      return;
    }

    const pos = snapToGrid(new THREE.Vector3(gp.x, gp.y, gp.z), "floor");

    // manter um índice rápido local para não depender da ordem de execução de outros hooks
    if (lastObjectsRef.current !== objects) {
      indexRef.current = buildObjectAabbIndex(objects, catalogItems, { ignoreObjectId: id });
      lastObjectsRef.current = objects;
    }

    // footprint rotacionado do objeto movido
    const movedAabb = footprintAABB3D(rotateFootprint3D(mfp, moving.rot), {
      x: pos.x,
      y: 0,
      z: pos.z,
    });

    const withinBounds =
      movedAabb.min.x >= 0 &&
      movedAabb.min.z >= 0 &&
      movedAabb.max.x <= lot.width &&
      movedAabb.max.z <= lot.depth;

    let collisionFree = true;
    const neighbors = indexRef.current ? indexRef.current.query(movedAabb) : [];
    for (const b of neighbors) {
      if (aabbIntersects(movedAabb, b)) {
        collisionFree = false;
        break;
      }
    }

    const w = movedAabb.max.x - movedAabb.min.x;
    const d = movedAabb.max.z - movedAabb.min.z;
    const h = movedAabb.max.y - movedAabb.min.y;
    setPreview({ pos, w, h, d, valid: withinBounds && collisionFree });
  });

  return preview;
}
