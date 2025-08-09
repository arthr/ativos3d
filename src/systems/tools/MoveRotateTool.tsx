import { useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useStore } from "../../store/useStore";

export function MoveRotateTool() {
  const activeTool = useStore((s) => s.activeTool);
  const selectedIds = useStore((s) => s.selectedIds);
  const { camera, gl } = useThree();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const pointer = useRef(new THREE.Vector2(0, 0));
  const dragging = useRef(false);

  useEffect(() => {
    function onPointerMove(e: PointerEvent) {
      const rect = gl.domElement.getBoundingClientRect();
      pointer.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      if (!dragging.current || activeTool !== "move" || selectedIds.length === 0) return;
      raycaster.setFromCamera(pointer.current, camera);
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const hit = raycaster.ray.intersectPlane(plane, new THREE.Vector3());
      if (!hit) return;
      const snapped = new THREE.Vector3(Math.floor(hit.x), 0, Math.floor(hit.z));
      const id = selectedIds[0];
      useStore.setState((s) => ({
        objects: s.objects.map((o) =>
          o.id === id ? { ...o, pos: { x: snapped.x, y: 0, z: snapped.z } } : o,
        ),
      }));
    }
    function onPointerDown(e: MouseEvent) {
      if (activeTool !== "move" || selectedIds.length === 0) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest('[data-hud="true"]')) return;
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
  }, [activeTool, camera, gl, raycaster, selectedIds]);

  return null;
}
