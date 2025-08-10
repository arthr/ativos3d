import React from "react";
import * as THREE from "three";
import { useStore } from "../../../store/useStore";
import { ToolStrategy, ToolContext } from "./types";
import { snapToGrid } from "../toolUtils";
import { eventBus } from "../../../core/events";
import { executeCommand } from "../../../core/commandStack";
import { withBudget } from "../../../core/budget";
import { catalog } from "../../../core/catalog";
import { CatalogItem3D } from "../../../core/types";

export function createBulldozeStrategy(ctx: ToolContext): ToolStrategy {
  const state = {
    hover: null as { kind: "object"; id: string } | { kind: "tile"; x: number; z: number } | null,
    cleanup: [] as Array<() => void>,
  };
  const raycaster = new THREE.Raycaster();
  return {
    onActivate() {
      const offPointer = eventBus.on("pointerNdc", ({ x, y }) => {
        const { activeTool, cameraGestureActive, input } = useStore.getState();
        if (activeTool !== "bulldoze" || cameraGestureActive) return;
        // Raycast primeiro para tentar encontrar objetos
        const ndc = new THREE.Vector2(x, y);
        raycaster.setFromCamera(ndc, ctx.camera);
        const hitList = raycaster.intersectObjects(ctx.scene.children, true);
        const objHit = hitList.find(
          (h) => (h.object as { userData?: { objectId?: string } })?.userData?.objectId,
        );
        if (objHit) {
          const objectId = (objHit.object as { userData?: { objectId?: string } }).userData
            ?.objectId as string;
          state.hover = { kind: "object", id: objectId };
          return;
        }
        // Caso não haja objeto, usar tile pelo ground
        const gp = input.groundPoint;
        if (gp) {
          const snapped = snapToGrid(new THREE.Vector3(gp.x, gp.y, gp.z), "floor");
          state.hover = { kind: "tile", x: snapped.x, z: snapped.z };
        } else {
          state.hover = null;
        }
      });
      const offClick = eventBus.on("click", ({ button, hudTarget }) => {
        const { activeTool, cameraGestureActive } = useStore.getState();
        if (activeTool !== "bulldoze" || cameraGestureActive || hudTarget || button !== 0) return;
        const h = state.hover;
        if (!h) return;
        if (h.kind === "object") {
          const id = h.id;
          const snapshot = useStore.getState().objects.find((o) => o.id === id);
          const cmd = {
            description: "bulldoze-object",
            execute: () =>
              useStore.setState((s) => ({ objects: s.objects.filter((o) => o.id !== id) })),
            undo: () =>
              snapshot && useStore.setState((s) => ({ objects: [...s.objects, snapshot] })),
          };
          const price =
            (catalog as unknown as CatalogItem3D[]).find((i) => i.id === snapshot?.defId)?.price ??
            0;
          const decorated = withBudget(cmd, -price);
          executeCommand(decorated, useStore.getState().pushCommand);
          return;
        }
        const x = h.x;
        const z = h.z;
        const snapshot = useStore.getState().floor.find((t) => t.x === x && t.z === z);
        const cmd = {
          description: "bulldoze-floor",
          execute: () =>
            useStore.setState((s) => ({ floor: s.floor.filter((t) => !(t.x === x && t.z === z)) })),
          undo: () => snapshot && useStore.setState((s) => ({ floor: [...s.floor, snapshot] })),
        };
        const price = 0;
        const decorated = withBudget(cmd, -price);
        executeCommand(decorated, useStore.getState().pushCommand);
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
      if (activeTool !== "bulldoze" || !state.hover || state.hover.kind !== "tile") return null;
      const t = state.hover;
      return (
        <mesh position={[t.x + 0.5, 0.02, t.z + 0.5]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial color="#ef4444" transparent opacity={0.2} />
        </mesh>
      );
    },
  } satisfies ToolStrategy;
}
