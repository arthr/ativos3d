import React from "react";
import * as THREE from "three";
import { useStore } from "../../../store/useStore";
import { ToolStrategy, ToolContext } from "./types";
import { catalog } from "../../../core/catalog";
import { snapToGrid } from "../toolUtils";
import { eventBus } from "../../../core/events";
import { executeCommand } from "../../../core/commandStack";
import { withBudget } from "../../../core/budget";
import { validatePlacement } from "../../../core/placement";
import { aabbIntersects } from "../../../core/geometry";
import { CatalogItem3D, PlacedObject3D } from "../../../core/types";
import { buildObjectAabbIndex } from "../../../core/sceneIndex";

export function createPlaceStrategy(ctx: ToolContext): ToolStrategy {
  const state = {
    preview: null as null | {
      pos: THREE.Vector3;
      w: number;
      h: number;
      d: number;
      color: string;
      yawDeg?: 0 | 90 | 180 | 270;
      valid?: boolean;
    },
    yaw: 0 as 0 | 90 | 180 | 270,
    cleanup: [] as Array<() => void>,
    index: null as ReturnType<typeof buildObjectAabbIndex> | null,
    lastObjectsRef: null as PlacedObject3D[] | null,
  };

  const api: ToolStrategy = {
    onActivate() {
      const offKeyDown = eventBus.on("keyDown", ({ code, shift }) => {
        if (code.toLowerCase?.() === "keyr" || code === "KeyR") {
          state.yaw = (((state.yaw ?? 0) + (shift ? 270 : 90)) % 360) as 0 | 90 | 180 | 270;
        }
        if (code === "Escape") {
          useStore.setState({ selectedCatalogId: undefined });
          state.preview = null;
        }
      });
      const offClick = eventBus.on("click", ({ button, hudTarget }) => {
        const { activeTool, camera, selectedCatalogId } = useStore.getState();
        if (activeTool !== "place" || hudTarget || camera.gestureActive || button !== 0)
          return;
        const p = state.preview;
        if (!p || !selectedCatalogId || !p.valid) return;
        const id = crypto.randomUUID();
        // Command pattern
        const cmd = {
          description: "place-object",
          execute: () =>
            useStore.setState((s) => ({
              objects: [
                ...s.objects,
                {
                  id,
                  defId: selectedCatalogId,
                  pos: { x: p.pos.x, y: 0, z: p.pos.z },
                  rot: { x: 0, y: state.yaw ?? 0, z: 0 },
                },
              ],
            })),
          undo: () => useStore.setState((s) => ({ objects: s.objects.filter((o) => o.id !== id) })),
        };
        const price =
          (catalog as unknown as CatalogItem3D[]).find((i) => i.id === selectedCatalogId)?.price ??
          0;
        const decorated = withBudget(cmd, price);
        executeCommand(decorated, useStore.getState().pushCommand);
      });
      state.cleanup.push(offKeyDown, offClick);
    },
    onDeactivate() {
      state.cleanup.forEach((fn) => fn());
      state.cleanup = [];
      state.preview = null;
    },
    onFrame() {
      const { activeTool, selectedCatalogId, objects, lot, input } = useStore.getState();
      if (activeTool !== "place" || !selectedCatalogId) {
        state.preview = null;
        return;
      }
      const gp = input.groundPoint;
      if (!gp) {
        state.preview = null;
        return;
      }
      const catalogItems = catalog as unknown as CatalogItem3D[];
      const item = catalogItems.find((i) => i.id === selectedCatalogId);
      if (!item) {
        state.preview = null;
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
      const yaw = state.yaw;
      const rotW = yaw % 180 === 0 ? baseW : baseD;
      const rotD = yaw % 180 === 0 ? baseD : baseW;
      const pos = snapToGrid(new THREE.Vector3(gp.x, gp.y, gp.z), "floor");

      // Reconstruir índice apenas quando o array de objetos mudar (referência)
      if (state.lastObjectsRef !== objects) {
        state.index = buildObjectAabbIndex(objects, catalogItems);
        state.lastObjectsRef = objects;
      }

      // Checagem rápida via índice espacial
      const candidate = {
        min: { x: pos.x, y: 0, z: pos.z },
        max: { x: pos.x + rotW, y: baseH, z: pos.z + rotD },
      };
      let fastOk = true;
      const neighbors = state.index ? state.index.query(candidate) : [];
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
          { x: 0, y: state.yaw, z: 0 },
          objects,
          [],
          { width: lot.width, depth: lot.depth },
          catalogItems,
        ).ok;
      state.preview = {
        pos,
        w: rotW,
        d: rotD,
        h: baseH,
        color: item.art?.color ?? "#64748b",
        yawDeg: yaw,
        valid,
      };
    },
    renderPreview() {
      const p = state.preview;
      if (!p) return null;
      return (
        <mesh
          position={[p.pos.x + p.w / 2, p.h / 2, p.pos.z + p.d / 2]}
          renderOrder={1000}
          castShadow={false}
          receiveShadow={false}
        >
          <boxGeometry args={[p.w, p.h, p.d]} />
          <meshStandardMaterial
            color={p.valid ? "#16a34a" : "#ef4444"}
            transparent
            opacity={0.5}
            depthTest={false}
            depthWrite={false}
            polygonOffset
            polygonOffsetFactor={-1}
          />
        </mesh>
      );
    },
  };
  return api;
}
