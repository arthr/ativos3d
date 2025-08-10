import React from "react";
import * as THREE from "three";
import { useStore } from "../../../store/useStore";
import { ToolStrategy, ToolContext } from "./types";
import { snapToGrid } from "../toolUtils";
import { eventBus } from "../../../core/events";
import { executeCommand } from "../../../core/commandStack";
import { aabbIntersects, footprintAABB3D, rotateFootprint3D } from "../../../core/geometry";
import { buildObjectAabbIndex } from "../../../core/sceneIndex";
import { CatalogItem3D } from "../../../core/types";
import { catalog } from "../../../core/catalog";

export function createWallStrategy(ctx: ToolContext): ToolStrategy {
  const state = {
    start: null as THREE.Vector3 | null,
    end: null as THREE.Vector3 | null,
    cleanup: [] as Array<() => void>,
    index: null as ReturnType<typeof buildObjectAabbIndex> | null,
  };

  function computeSegments(start: THREE.Vector3, end: THREE.Vector3) {
    const dx = Math.round(end.x - start.x);
    const dz = Math.round(end.z - start.z);
    const segments: { ax: number; ay: number; az: number; bx: number; by: number; bz: number }[] =
      [];
    if (Math.abs(dx) >= Math.abs(dz)) {
      const step = dx >= 0 ? 1 : -1;
      for (let i = 0; i !== dx; i += step) {
        const ax = start.x + i;
        const bx = start.x + i + step;
        segments.push({ ax, ay: 0, az: start.z, bx, by: 0, bz: start.z });
      }
    } else {
      const step = dz >= 0 ? 1 : -1;
      for (let i = 0; i !== dz; i += step) {
        const az = start.z + i;
        const bz = start.z + i + step;
        segments.push({ ax: start.x, ay: 0, az, bx: start.x, by: 0, bz });
      }
    }
    // clip to lot
    const lot = useStore.getState().lot;
    return segments.filter(
      (s) =>
        s.ax >= 0 &&
        s.bx >= 0 &&
        s.az >= 0 &&
        s.bz >= 0 &&
        s.ax <= lot.width &&
        s.bx <= lot.width &&
        s.az <= lot.depth &&
        s.bz <= lot.depth,
    );
  }

  return {
    onActivate() {
      const offDown = eventBus.on("pointerDown", ({ button, hudTarget, ground }) => {
        const { activeTool, cameraGestureActive } = useStore.getState();
        if (activeTool !== "wall" || cameraGestureActive || hudTarget || button !== 0) return;
        if (!ground) return;
        const snapped = snapToGrid(new THREE.Vector3(ground.x, ground.y, ground.z), "round");
        state.start = snapped;
        state.end = snapped.clone();
      });
      const offUp = eventBus.on("pointerUp", ({ button }) => {
        if (button !== 0) return;
        const { activeTool, cameraGestureActive } = useStore.getState();
        if (activeTool !== "wall" || cameraGestureActive || !state.start || !state.end) return;
        const segments = computeSegments(state.start, state.end);
        if (segments.length) {
          const cmd = {
            description: "add-walls",
            execute: () => useStore.setState((s) => ({ walls: [...s.walls, ...segments] })),
            undo: () =>
              useStore.setState((s) => ({
                walls: s.walls.slice(0, s.walls.length - segments.length),
              })),
          };
          executeCommand(cmd, useStore.getState().pushCommand);
        }
        state.start = null;
        state.end = null;
      });
      state.cleanup.push(offDown, offUp);
    },
    onDeactivate() {
      state.cleanup.forEach((fn) => fn());
      state.cleanup = [];
      state.start = null;
      state.end = null;
    },
    onFrame() {
      const { activeTool, cameraGestureActive, input } = useStore.getState();
      if (activeTool !== "wall" || cameraGestureActive || !state.start) return;
      const gp = input.groundPoint;
      if (!gp) return;
      const snapped = snapToGrid(new THREE.Vector3(gp.x, gp.y, gp.z), "round");
      state.end = snapped;
    },
    renderPreview() {
      const { lot, activeTool, objects } = useStore.getState();
      if (activeTool !== "wall" || !state.start || !state.end) return null;
      const dx = state.end.x - state.start.x;
      const dz = state.end.z - state.start.z;
      const useX = Math.abs(dx) >= Math.abs(dz);
      const len = useX ? Math.abs(Math.round(dx)) : Math.abs(Math.round(dz));
      const yaw = useX ? 0 : Math.PI / 2;
      const cx = (state.start.x + state.end.x) / 2;
      const cz = (state.start.z + state.end.z) / 2;
      const previewHeight = Math.max(1, lot.height * 0.5);
      const thickness = 0.1;

      // Pré-validação: garantir que a parede não intersecta AABB reais dos objetos (footprints rotacionados)
      const catalogItems = catalog as unknown as CatalogItem3D[];
      state.index = buildObjectAabbIndex(objects, catalogItems);
      const wallAabb = useX
        ? {
            // Parede horizontal ao longo de X: faixa estreita em Z
            min: {
              x: Math.min(state.start.x, state.end.x),
              y: 0,
              z: Math.min(state.start.z, state.end.z) - thickness / 2,
            },
            max: {
              x: Math.max(state.start.x, state.end.x),
              y: previewHeight,
              z: Math.max(state.start.z, state.end.z) + thickness / 2,
            },
          }
        : {
            // Parede vertical ao longo de Z: faixa estreita em X
            min: {
              x: Math.min(state.start.x, state.end.x) - thickness / 2,
              y: 0,
              z: Math.min(state.start.z, state.end.z),
            },
            max: {
              x: Math.max(state.start.x, state.end.x) + thickness / 2,
              y: previewHeight,
              z: Math.max(state.start.z, state.end.z),
            },
          };
      const neighbors = state.index ? state.index.query(wallAabb) : [];
      let collision = false;
      for (const b of neighbors) {
        if (
          !(
            wallAabb.max.x <= b.min.x ||
            wallAabb.min.x >= b.max.x ||
            wallAabb.max.z <= b.min.z ||
            wallAabb.min.z >= b.max.z
          )
        ) {
          collision = true;
          break;
        }
      }
      return (
        <mesh
          position={[cx, previewHeight / 2, cz]}
          rotation={[0, yaw, 0]}
          renderOrder={1000}
          castShadow={false}
          receiveShadow={false}
        >
          <boxGeometry args={[Math.max(0.001, len), previewHeight, thickness]} />
          <meshStandardMaterial
            color={collision ? "#ef4444" : "#38bdf8"}
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
  } satisfies ToolStrategy;
}
