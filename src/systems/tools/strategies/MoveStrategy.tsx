import * as THREE from "three";
import { useStore } from "../../../store/useStore";
import { ToolStrategy, ToolContext } from "./types";
import { snapToGrid } from "../toolUtils";
import { eventBus } from "../../../core/events";

export function createMoveStrategy(ctx: ToolContext): ToolStrategy {
  const state = {
    dragging: false,
    cleanup: [] as Array<() => void>,
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
          cmd.execute();
          useStore.getState().pushCommand(cmd);
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
      const { activeTool, input, selectedIds } = useStore.getState();
      if (activeTool !== "move" || !state.dragging || !selectedIds.length) return;
      const gp = input.groundPoint;
      if (!gp) return;
      const snapped = snapToGrid(new THREE.Vector3(gp.x, gp.y, gp.z), "floor");
      const id = selectedIds[0];
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
