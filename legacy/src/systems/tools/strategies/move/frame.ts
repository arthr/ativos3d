import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useStore } from "../../../../store/useStore";
import { snapToGrid } from "../../toolUtils";
import { aabbIntersects, footprintAABB3D, rotateFootprint3D } from "../../../../core/geometry";
import { catalog } from "../../../../core/catalog";
import type { CatalogItem3D } from "../../../../core/types";
import type { MoveState } from "./state";
import { buildObjectAabbIndex } from "../../../../core/sceneIndex";

export function useMoveFrame(state: MoveState) {
  useFrame(() => {
    const { activeTool, input, selectedIds, objects, lot } = useStore.getState();
    if (activeTool !== "move" || !selectedIds.length) return;
    const gp = input.groundPoint;
    if (!gp) return;
    const snapped = snapToGrid(new THREE.Vector3(gp.x, gp.y, gp.z), "floor");
    const id = selectedIds[0];

    const catalogItems = catalog as unknown as CatalogItem3D[];
    if (state.lastObjectsRef.current !== objects) {
      state.indexRef.current = buildObjectAabbIndex(objects, catalogItems, { ignoreObjectId: id });
      state.lastObjectsRef.current = objects;
    }

    const moving = objects.find((o) => o.id === id);
    if (!moving) return;
    const movingDef = catalogItems.find((c) => c.id === moving.defId) as CatalogItem3D | undefined;
    const mfp = movingDef?.footprint;
    if (!mfp) return;
    const movedAabb = footprintAABB3D(rotateFootprint3D(mfp, moving.rot), {
      x: snapped.x,
      y: 0,
      z: snapped.z,
    });
    if (
      movedAabb.min.x < 0 ||
      movedAabb.min.z < 0 ||
      movedAabb.max.x > lot.width ||
      movedAabb.max.z > lot.depth
    )
      return;
    const neighbors = state.indexRef.current ? state.indexRef.current.query(movedAabb) : [];
    for (const b of neighbors) {
      if (aabbIntersects(movedAabb, b)) return;
    }
    // Não comitar no store: apenas atualizar lastPosRef como preview lógico.
    state.lastPosRef.current = { x: snapped.x, y: 0, z: snapped.z };
  });
}
