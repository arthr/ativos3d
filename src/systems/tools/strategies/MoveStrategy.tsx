import * as THREE from "three";
import { useStore } from "../../../store/useStore";
import { ToolStrategy, ToolContext } from "./types";
import { snapToGrid } from "../toolUtils";
import { eventBus } from "../../../core/events";
import { executeCommand } from "../../../core/commandStack";
import { aabbIntersects, footprintAABB3D, rotateFootprint3D } from "../../../core/geometry";
import { CatalogItem3D, PlacedObject3D } from "../../../core/types";
import { catalog } from "../../../core/catalog";
import { buildObjectAabbIndex } from "../../../core/sceneIndex";

export function createMoveStrategy(ctx: ToolContext): ToolStrategy {
  const state = {
    dragging: false,
    movingObjectId: null as string | null,
    startPos: null as { x: number; y: number; z: number } | null,
    lastPos: null as { x: number; y: number; z: number } | null,
    cleanup: [] as Array<() => void>,
    index: null as ReturnType<typeof buildObjectAabbIndex> | null,
    lastObjectsRef: null as PlacedObject3D[] | null,
  };

  return {
    onActivate() {
      const offDown = eventBus.on("pointerDown", ({ button, hudTarget }) => {
        const { activeTool, cameraGestureActive, selectedIds } = useStore.getState();
        if (activeTool !== "move" || cameraGestureActive || hudTarget || button !== 0) return;
        if (!selectedIds.length) return;
        const id = selectedIds[0];
        const obj = useStore.getState().objects.find((o) => o.id === id);
        if (!obj) return;
        state.dragging = true;
        state.movingObjectId = id;
        state.startPos = { x: obj.pos.x, y: obj.pos.y, z: obj.pos.z };
        state.lastPos = { x: obj.pos.x, y: obj.pos.y, z: obj.pos.z };
      });
      const offUp = eventBus.on("pointerUp", () => {
        if (state.dragging && state.movingObjectId && state.startPos && state.lastPos) {
          const moved =
            state.startPos.x !== state.lastPos.x ||
            state.startPos.y !== state.lastPos.y ||
            state.startPos.z !== state.lastPos.z;
          if (moved) {
            const id = state.movingObjectId;
            const from = { ...state.startPos };
            const to = { ...state.lastPos };
            const cmd = {
              description: "move-object",
              execute: () =>
                useStore.setState((s) => ({
                  objects: s.objects.map((o) =>
                    o.id === id ? { ...o, pos: { x: to.x, y: to.y, z: to.z } } : o,
                  ),
                })),
              undo: () =>
                useStore.setState((s) => ({
                  objects: s.objects.map((o) =>
                    o.id === id ? { ...o, pos: { x: from.x, y: from.y, z: from.z } } : o,
                  ),
                })),
            };
            executeCommand(cmd, useStore.getState().pushCommand);
          }
        }
        state.dragging = false;
        state.movingObjectId = null;
        state.startPos = null;
        state.lastPos = null;
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
      const id = state.movingObjectId ?? selectedIds[0];

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
      state.lastPos = { x: snapped.x, y: 0, z: snapped.z };
    },
    renderPreview() {
      return null;
    },
  } satisfies ToolStrategy;
}
