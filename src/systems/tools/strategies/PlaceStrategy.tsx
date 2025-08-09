import React from "react";
import * as THREE from "three";
import { useStore } from "../../../store/useStore";
import { ToolStrategy, ToolContext } from "./types";
import { catalog } from "../../../core/catalog";
import { snapToGrid } from "../toolUtils";
import { eventBus } from "../../../core/events";

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
  };

  const api: ToolStrategy = {
    onActivate() {
      const offKeyDown = eventBus.on("keyDown", ({ code, shift }) => {
        if (code.toLowerCase?.() === "keyr" || code === "KeyR") {
          state.yaw = (((state.yaw ?? 0) + (shift ? 270 : 90)) % 360) as any;
        }
        if (code === "Escape") {
          useStore.setState({ selectedCatalogId: undefined });
          state.preview = null;
        }
      });
      const offClick = eventBus.on("click", ({ button, hudTarget }) => {
        const { activeTool, cameraGestureActive, selectedCatalogId } = useStore.getState();
        if (activeTool !== "place" || hudTarget || cameraGestureActive || button !== 0) return;
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
        cmd.execute();
        useStore.getState().pushCommand(cmd);
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
      const item: any = (catalog as any[]).find((i) => i.id === selectedCatalogId);
      if (!item) {
        state.preview = null;
        return;
      }
      const fp = item.footprint || { w: 1, d: 1, h: 1 };
      const baseW = fp.w ?? 1;
      const baseD = fp.d ?? 1;
      const baseH = fp.h ?? 1;
      const yaw = state.yaw;
      const rotW = yaw % 180 === 0 ? baseW : baseD;
      const rotD = yaw % 180 === 0 ? baseD : baseW;
      const pos = snapToGrid(new THREE.Vector3(gp.x, gp.y, gp.z), "floor");
      const aabb = {
        min: { x: pos.x, y: 0, z: pos.z },
        max: { x: pos.x + rotW, y: baseH, z: pos.z + rotD },
      };
      let valid = true;
      if (aabb.min.x < 0 || aabb.min.z < 0 || aabb.max.x > lot.width || aabb.max.z > lot.depth) {
        valid = false;
      }
      if (valid) {
        const idToItem = new Map<string, any>();
        for (const it of catalog as any[]) idToItem.set(it.id, it);
        for (const obj of objects) {
          const def = idToItem.get(obj.defId);
          const ofp = def?.footprint || { w: 1, d: 1, h: 1 };
          const oyaw = Math.round(obj.rot.y) % 360;
          const ow = oyaw % 180 === 0 ? ofp.w ?? 1 : ofp.d ?? 1;
          const od = oyaw % 180 === 0 ? ofp.d ?? 1 : ofp.w ?? 1;
          const obb = {
            min: { x: obj.pos.x, y: 0, z: obj.pos.z },
            max: { x: obj.pos.x + ow, y: ofp.h ?? 1, z: obj.pos.z + od },
          };
          const intersects = !(
            aabb.max.x <= obb.min.x ||
            aabb.min.x >= obb.max.x ||
            aabb.max.z <= obb.min.z ||
            aabb.min.z >= obb.max.z
          );
          if (intersects) {
            valid = false;
            break;
          }
        }
      }
      state.preview = {
        pos,
        w: rotW,
        d: rotD,
        h: baseH,
        color: item.art?.color ?? "#64748b",
        yawDeg: yaw,
        valid,
      } as any;
    },
    renderPreview() {
      const p = state.preview;
      if (!p) return null;
      return (
        <mesh position={[p.pos.x + p.w / 2, p.h / 2, p.pos.z + p.d / 2]}>
          <boxGeometry args={[p.w, p.h, p.d]} />
          <meshStandardMaterial color={p.valid ? "#16a34a" : "#ef4444"} transparent opacity={0.5} />
        </mesh>
      );
    },
  };
  return api;
}
