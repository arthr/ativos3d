import * as THREE from "three";
import { useStore } from "../../../store/useStore";
import { ToolStrategy, ToolContext } from "./types";
import { snapToGrid } from "../toolUtils";
import { eventBus } from "../../../core/events";
import { executeCommand } from "../../../core/commandStack";
import { aabbIntersects, footprintAABB3D, rotateFootprint3D } from "../../../core/geometry";
import { CatalogItem3D } from "../../../core/types";
import { catalog } from "../../../core/catalog";
import { buildObjectAabbIndex } from "../../../core/sceneIndex";

export function createMoveStrategy(ctx: ToolContext): ToolStrategy {
  const state = {
    dragging: false,
    cleanup: [] as Array<() => void>,
    index: null as ReturnType<typeof buildObjectAabbIndex> | null,
    lastObjectsRef: null as any,
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
      if (state.lastObjectsRef !== objects) {
        state.index = buildObjectAabbIndex(objects, catalogItems, { ignoreObjectId: id });
        state.lastObjectsRef = objects;
      }

      // candidate AABB for moved object (use its footprint)
      const moving = objects.find((o) => o.id === id);
      if (!moving) return;
      const movingDef = (catalogItems.find((c) => c.id === moving.defId) as CatalogItem3D | undefined);
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
      const neighbors = state.index ? state.index.query(movedAabb) : [];
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
