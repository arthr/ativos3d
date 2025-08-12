import { useRef } from "react";
import type { PlacedObject3D } from "../../../../core/types";
import { buildObjectAabbIndex } from "../../../../core/sceneIndex";

export type Vec3 = { x: number; y: number; z: number };

export function useMoveState() {
  const draggingRef = useRef(false);
  const movingObjectIdRef = useRef<string | null>(null);
  const startPosRef = useRef<Vec3 | null>(null);
  const lastPosRef = useRef<Vec3 | null>(null);
  const indexRef = useRef<ReturnType<typeof buildObjectAabbIndex> | null>(null);
  const lastObjectsRef = useRef<PlacedObject3D[] | null>(null);

  return {
    draggingRef,
    movingObjectIdRef,
    startPosRef,
    lastPosRef,
    indexRef,
    lastObjectsRef,
  };
}

export type MoveState = ReturnType<typeof useMoveState>;
