import * as THREE from "three";
import { useStore } from "../../../store/useStore";
import { ToolStrategy, ToolContext } from "./types";
import { snapToGrid } from "../toolUtils";
import { eventBus } from "../../../core/events";
import { executeCommand } from "../../../core/commandStack";
import { SpatialIndex } from "../../../core/spatialIndex";
import { aabbIntersects, footprintAABB3D, rotateFootprint3D } from "../../../core/geometry";
import { CatalogItem3D } from "../../../core/types";
import { catalog } from "../../../core/catalog";

export function createMoveStrategy(ctx: ToolContext): ToolStrategy {
  const state = {
    dragging: false,
    cleanup: [] as Array<() => void>,
    index: new SpatialIndex(1),
    lastObjectsVersion: 0,
  };

  return {
    onActivate() {
      const offDown = eventBus.on("pointerDown", ({ button, hudTarget }) => {
        const { activeTool, cameraGestureActive, selectedIds } = useStore.getState();
        if (activeTool !== "move" || cameraGestureActive || hudTarget || button !== 0) return;
        if (!selectedIds.length) return;
        state.dragging = true;
      });
      const offUp = eventBus.on("pointerUp", () => {
        state.dragging = false;
      });
      const offKey = eventBus.on("keyDown", ({ code, shift }) => {
        const { activeTool, selectedIds } = useStore.getState();
        if (activeTool !== "move" || !selectedIds.length) return;
        if (code.toLowerCase?.() === "keyr" || code === "KeyR") {
          const id = selectedIds[0];
          const cmd = {
            description: "rotate-object",
            execute: () =>
              useStore.setState((s) => ({
                objects: s.objects.map((o) =>
                  o.id === id
                    ? { ...o, rot: { ...o.rot, y: (o.rot.y + (shift ? 270 : 90)) % 360 } }
                    : o,
                ),
              })),
            undo: () =>
              useStore.setState((s) => ({
                objects: s.objects.map((o) =>
                  o.id === id
                    ? { ...o, rot: { ...o.rot, y: (o.rot.y - (shift ? 270 : 90) + 360) % 360 } }
                    : o,
                ),
              })),
          };
          executeCommand(cmd, useStore.getState().pushCommand);
        }
      });
      state.cleanup.push(offDown, offUp, offKey);
    },
    onDeactivate() {
      state.cleanup.forEach((fn) => fn());
      state.cleanup = [];
      state.dragging = false;
    },
    onFrame() {
      const { activeTool, input, selectedIds, objects, lot } = useStore.getState();
      if (activeTool !== "move" || !state.dragging || !selectedIds.length) return;
      const gp = input.groundPoint;
      if (!gp) return;
      const snapped = snapToGrid(new THREE.Vector3(gp.x, gp.y, gp.z), "floor");
      const id = selectedIds[0];

      // rebuild index when objects ref changes
      const catalogItems = catalog as unknown as CatalogItem3D[];
      const idToItem = new Map<string, CatalogItem3D>();
      for (const it of catalogItems) idToItem.set(it.id, it);
      state.index.clear();
      for (const obj of objects) {
        if (obj.id === id) continue; // ignore the moving one in index
        const def = idToItem.get(obj.defId);
        const ofp = def?.footprint;
        if (!ofp) continue;
        const rotated = rotateFootprint3D(ofp, obj.rot);
        state.index.insert(footprintAABB3D(rotated, obj.pos));
      }

      // candidate AABB for moved object (use its footprint)
      const moving = objects.find((o) => o.id === id);
      if (!moving) return;
      const movingDef = idToItem.get(moving.defId);
      const mfp = movingDef?.footprint;
      if (!mfp) return;
      const movedAabb = footprintAABB3D(rotateFootprint3D(mfp, moving.rot), {
        x: snapped.x,
        y: 0,
        z: snapped.z,
      });
      // bounds check
      if (
        movedAabb.min.x < 0 ||
        movedAabb.min.z < 0 ||
        movedAabb.max.x > lot.width ||
        movedAabb.max.z > lot.depth
      )
        return;
      // collision check fast
      const neighbors = state.index.query(movedAabb);
      for (const b of neighbors) {
        if (aabbIntersects(movedAabb, b)) return;
      }

      useStore.setState((s) => ({
        objects: s.objects.map((o) =>
          o.id === id ? { ...o, pos: { x: snapped.x, y: 0, z: snapped.z } } : o,
        ),
      }));
    },
    renderPreview() {
      return null;
    },
  } satisfies ToolStrategy;
}
