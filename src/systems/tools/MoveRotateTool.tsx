import { useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useStore } from "../../store/useStore";
import { intersectGround, isHudEventTarget, snapToGrid } from "./toolUtils";

export function MoveRotateTool() {
  const activeTool = useStore((s) => s.activeTool);
  const cameraGestureActive = useStore((s) => s.cameraGestureActive);
  const selectedIds = useStore((s) => s.selectedIds);
  const { camera, gl } = useThree();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const pointerNdc = useStore((s) => s.input.pointerNdc);
  const dragging = useRef(false);

  useEffect(() => {
    function onPointerMove() {
      if (!dragging.current || activeTool !== "move" || selectedIds.length === 0) return;
      const ndc = new THREE.Vector2(pointerNdc.x, pointerNdc.y);
      const hit = intersectGround(raycaster, camera, ndc);
      if (!hit) return;
      const snapped = snapToGrid(hit, "floor");
      const id = selectedIds[0];
      useStore.setState((s) => ({
        objects: s.objects.map((o) =>
          o.id === id ? { ...o, pos: { x: snapped.x, y: 0, z: snapped.z } } : o,
        ),
      }));
    }
    function onPointerDown(e: MouseEvent) {
      if (activeTool !== "move" || cameraGestureActive || selectedIds.length === 0) return;
      if (isHudEventTarget(e)) return;
      dragging.current = true;
    }
    function onPointerUp() {
      dragging.current = false;
    }
    function onKeyDown(e: KeyboardEvent) {
      if (activeTool !== "move" || selectedIds.length === 0) return;
      if (e.key.toLowerCase() === "r") {
        const id = selectedIds[0];
        useStore.setState((s) => ({
          objects: s.objects.map((o) =>
            o.id === id
              ? { ...o, rot: { ...o.rot, y: (o.rot.y + (e.shiftKey ? 270 : 90)) % 360 } }
              : o,
          ),
        }));
      }
    }
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mouseup", onPointerUp);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("mouseup", onPointerUp);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeTool, camera, gl, raycaster, selectedIds, cameraGestureActive, pointerNdc]);

  return null;
}
