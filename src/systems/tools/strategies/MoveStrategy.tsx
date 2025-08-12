import { useCallback, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useStore } from "../../../store/useStore";
import { ToolContext } from "./types";
import { snapToGrid } from "../toolUtils";
import { useEventBus } from "../../../core/events";
import { executeCommand } from "../../../core/commandStack";
import {
  aabbIntersects,
  footprintAABB3D,
  rotateFootprint3D,
} from "../../../core/geometry";
import { CatalogItem3D, PlacedObject3D } from "../../../core/types";
import { catalog } from "../../../core/catalog";
import { buildObjectAabbIndex } from "../../../core/sceneIndex";

type Vec3 = { x: number; y: number; z: number };

export function MoveStrategy({ ctx }: { ctx: ToolContext }) {
  void ctx;
  const draggingRef = useRef(false);
  const movingObjectIdRef = useRef<string | null>(null);
  const startPosRef = useRef<Vec3 | null>(null);
  const lastPosRef = useRef<Vec3 | null>(null);
  const indexRef = useRef<ReturnType<typeof buildObjectAabbIndex> | null>(null);
  const lastObjectsRef = useRef<PlacedObject3D[] | null>(null);

  const handleDown = useCallback(
    ({ button, hudTarget }: { button: number; hudTarget: boolean }) => {
      const { activeTool, camera, selectedIds } = useStore.getState();
      if (activeTool !== "move" || camera.gestureActive || hudTarget || button !== 0) return;
      if (!selectedIds.length) return;
      const id = selectedIds[0];
      const obj = useStore.getState().objects.find((o) => o.id === id);
      if (!obj) return;
      draggingRef.current = true;
      movingObjectIdRef.current = id;
      startPosRef.current = { x: obj.pos.x, y: obj.pos.y, z: obj.pos.z };
      lastPosRef.current = { x: obj.pos.x, y: obj.pos.y, z: obj.pos.z };
    },
    [],
  );

  const handleUp = useCallback(() => {
    if (draggingRef.current && movingObjectIdRef.current && startPosRef.current && lastPosRef.current) {
      const moved =
        startPosRef.current.x !== lastPosRef.current.x ||
        startPosRef.current.y !== lastPosRef.current.y ||
        startPosRef.current.z !== lastPosRef.current.z;
      if (moved) {
        const id = movingObjectIdRef.current;
        const from = { ...startPosRef.current };
        const to = { ...lastPosRef.current };
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
    draggingRef.current = false;
    movingObjectIdRef.current = null;
    startPosRef.current = null;
    lastPosRef.current = null;
  }, []);

  const handleKey = useCallback(({ code, shift }: { code: string; shift: boolean }) => {
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
  }, []);

  useEventBus("pointerDown", handleDown);
  useEventBus("pointerUp", handleUp);
  useEventBus("keyDown", handleKey);

  useFrame(() => {
    const { activeTool, input, selectedIds, objects, lot } = useStore.getState();
    if (activeTool !== "move" || !draggingRef.current || !selectedIds.length) return;
    const gp = input.groundPoint;
    if (!gp) return;
    const snapped = snapToGrid(new THREE.Vector3(gp.x, gp.y, gp.z), "floor");
    const id = movingObjectIdRef.current ?? selectedIds[0];

    const catalogItems = catalog as unknown as CatalogItem3D[];
    if (lastObjectsRef.current !== objects) {
      indexRef.current = buildObjectAabbIndex(objects, catalogItems, { ignoreObjectId: id });
      lastObjectsRef.current = objects;
    }

    const moving = objects.find((o) => o.id === id);
    if (!moving) return;
    const movingDef = catalogItems.find((c) => c.id === moving.defId) as
      | CatalogItem3D
      | undefined;
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
    const neighbors = indexRef.current ? indexRef.current.query(movedAabb) : [];
    for (const b of neighbors) {
      if (aabbIntersects(movedAabb, b)) return;
    }
    useStore.setState((s) => ({
      objects: s.objects.map((o) =>
        o.id === id ? { ...o, pos: { x: snapped.x, y: 0, z: snapped.z } } : o,
      ),
    }));
    lastPosRef.current = { x: snapped.x, y: 0, z: snapped.z };
  });

  return null;
}

export default MoveStrategy;
