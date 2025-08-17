import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useStore } from "../../../store/useStore";
import { ToolContext } from "./types";
import { snapToGrid } from "../toolUtils";
import { useEventBus } from "../../../core/events";
import { executeCommand } from "../../../core/commandStack";
import { buildObjectAabbIndex } from "../../../core/sceneIndex";
import { CatalogItem3D } from "../../../core/types";
import { catalog } from "../../../core/catalog";

type Segment = { ax: number; ay: number; az: number; bx: number; by: number; bz: number };

export function WallStrategy({ ctx }: { ctx: ToolContext }) {
  void ctx;
  const [start, setStart] = useState<THREE.Vector3 | null>(null);
  const [end, setEnd] = useState<THREE.Vector3 | null>(null);
  const indexRef = useRef<ReturnType<typeof buildObjectAabbIndex> | null>(null);
  const objects = useStore((s) => s.objects);
  const lot = useStore((s) => s.lot);
  const activeTool = useStore((s) => s.activeTool);

  const computeSegments = useCallback((s: THREE.Vector3, e: THREE.Vector3) => {
    const dx = Math.round(e.x - s.x);
    const dz = Math.round(e.z - s.z);
    const segments: Segment[] = [];
    if (Math.abs(dx) >= Math.abs(dz)) {
      const step = dx >= 0 ? 1 : -1;
      for (let i = 0; i !== dx; i += step) {
        const ax = s.x + i;
        const bx = s.x + i + step;
        segments.push({ ax, ay: 0, az: s.z, bx, by: 0, bz: s.z });
      }
    } else {
      const step = dz >= 0 ? 1 : -1;
      for (let i = 0; i !== dz; i += step) {
        const az = s.z + i;
        const bz = s.z + i + step;
        segments.push({ ax: s.x, ay: 0, az, bx: s.x, by: 0, bz });
      }
    }
    return segments.filter(
      (seg) =>
        seg.ax >= 0 &&
        seg.bx >= 0 &&
        seg.az >= 0 &&
        seg.bz >= 0 &&
        seg.ax <= lot.width &&
        seg.bx <= lot.width &&
        seg.az <= lot.depth &&
        seg.bz <= lot.depth,
    );
  }, [lot.width, lot.depth]);

  const handleDown = useCallback(
    ({ button, hudTarget, ground }: { button: number; hudTarget: boolean; ground: { x: number; y: number; z: number } | null }) => {
      const { activeTool: tool, camera } = useStore.getState();
      if (tool !== "wall" || camera.gestureActive || hudTarget || button !== 0) return;
      if (!ground) return;
      const snapped = snapToGrid(new THREE.Vector3(ground.x, ground.y, ground.z), "round");
      setStart(snapped);
      setEnd(snapped.clone());
    },
    [],
  );

  const handleUp = useCallback(
    ({ button }: { button: number }) => {
      if (button !== 0) return;
      const { activeTool: tool, camera } = useStore.getState();
      if (tool !== "wall" || camera.gestureActive || !start || !end) return;
      const segments = computeSegments(start, end);
      if (segments.length) {
        const cmd = {
          description: "add-walls",
          execute: () => useStore.setState((s) => ({ walls: [...s.walls, ...segments] })),
          undo: () =>
            useStore.setState((s) => ({ walls: s.walls.slice(0, s.walls.length - segments.length) })),
        };
        executeCommand(cmd, useStore.getState().pushCommand);
      }
      setStart(null);
      setEnd(null);
    },
    [start, end, computeSegments],
  );

  useEventBus("pointerDown", handleDown);
  useEventBus("pointerUp", handleUp);

  useFrame(() => {
    const { activeTool: tool, camera, input } = useStore.getState();
    if (tool !== "wall" || camera.gestureActive || !start) return;
    const gp = input.groundPoint;
    if (!gp) return;
    const snapped = snapToGrid(new THREE.Vector3(gp.x, gp.y, gp.z), "round");
    setEnd(snapped);
  });

  useEffect(() => {
    const catalogItems = catalog as unknown as CatalogItem3D[];
    indexRef.current = buildObjectAabbIndex(objects, catalogItems);
  }, [objects]);

  if (activeTool !== "wall" || !start || !end) return null;

  const dx = end.x - start.x;
  const dz = end.z - start.z;
  const useX = Math.abs(dx) >= Math.abs(dz);
  const len = useX ? Math.abs(Math.round(dx)) : Math.abs(Math.round(dz));
  const yaw = useX ? 0 : Math.PI / 2;
  const cx = (start.x + end.x) / 2;
  const cz = (start.z + end.z) / 2;
  const previewHeight = Math.max(1, lot.height * 0.5);
  const thickness = 0.1;

  const wallAabb = useX
    ? {
        min: { x: Math.min(start.x, end.x), y: 0, z: Math.min(start.z, end.z) - thickness / 2 },
        max: { x: Math.max(start.x, end.x), y: previewHeight, z: Math.max(start.z, end.z) + thickness / 2 },
      }
    : {
        min: { x: Math.min(start.x, end.x) - thickness / 2, y: 0, z: Math.min(start.z, end.z) },
        max: { x: Math.max(start.x, end.x) + thickness / 2, y: previewHeight, z: Math.max(start.z, end.z) },
      };
  const neighbors = indexRef.current ? indexRef.current.query(wallAabb) : [];
  let collision = false;
  for (const b of neighbors) {
    if (
      !(wallAabb.max.x <= b.min.x || wallAabb.min.x >= b.max.x || wallAabb.max.z <= b.min.z || wallAabb.min.z >= b.max.z)
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
}

export default WallStrategy;
