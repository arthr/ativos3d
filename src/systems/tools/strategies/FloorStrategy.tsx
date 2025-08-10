import React from "react";
import * as THREE from "three";
import { useStore } from "../../../store/useStore";
import { ToolStrategy, ToolContext } from "./types";
import { snapToGrid } from "../toolUtils";
import { eventBus } from "../../../core/events";
import { executeCommand } from "../../../core/commandStack";

export function createFloorStrategy(ctx: ToolContext): ToolStrategy {
  const state = {
    hover: null as { x: number; z: number } | null,
    cleanup: [] as Array<() => void>,
  };

  return {
    onActivate() {
      const offPointer = eventBus.on("pointerNdc", ({ x, y }) => {
        const { activeTool, cameraGestureActive, input } = useStore.getState();
        if (activeTool !== "floor" || cameraGestureActive) return;
        const gp = input.groundPoint;
        if (!gp) {
          state.hover = null;
          return;
        }
        const snapped = snapToGrid(new THREE.Vector3(gp.x, gp.y, gp.z), "floor");
        state.hover = { x: snapped.x, z: snapped.z };
      });
      const offClick = eventBus.on("click", ({ button, hudTarget }) => {
        const { activeTool, cameraGestureActive, selectedCatalogId } = useStore.getState();
        if (activeTool !== "floor" || cameraGestureActive || hudTarget || button !== 0) return;
        const h = state.hover;
        if (!h) return;
        const tile = { x: h.x, z: h.z, tex: selectedCatalogId ?? "floor" };
        const cmd = {
          description: "paint-floor",
          execute: () =>
            useStore.setState((s) => {
              const key = (t: typeof tile) => `${t.x}:${t.z}`;
              const existingIdx = s.floor.findIndex((t) => key(t) === key(tile));
              const next = [...s.floor];
              if (existingIdx >= 0) next[existingIdx] = tile;
              else next.push(tile);
              return { floor: next };
            }),
          undo: () =>
            useStore.setState((s) => {
              const key = (t: typeof tile) => `${t.x}:${t.z}`;
              const idx = s.floor.findIndex((t) => key(t) === key(tile));
              const next = [...s.floor];
              if (idx >= 0) next.splice(idx, 1);
              return { floor: next };
            }),
        };
        executeCommand(cmd, useStore.getState().pushCommand);
      });
      state.cleanup.push(offPointer, offClick);
    },
    onDeactivate() {
      state.cleanup.forEach((fn) => fn());
      state.cleanup = [];
      state.hover = null;
    },
    onFrame() {},
    renderPreview() {
      const { activeTool } = useStore.getState();
      if (activeTool !== "floor" || !state.hover) return null;
      const t = state.hover;
      return (
        <mesh position={[t.x + 0.5, 0.01, t.z + 0.5]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.25} />
        </mesh>
      );
    },
  } satisfies ToolStrategy;
}
