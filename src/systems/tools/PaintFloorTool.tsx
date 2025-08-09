import { useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useStore } from "../../store/useStore";

export function PaintFloorTool() {
  const activeTool = useStore((s) => s.activeTool);
  const selectedCatalogId = useStore((s) => s.selectedCatalogId);
  const { camera, gl } = useThree();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const pointer = useRef(new THREE.Vector2(0, 0));

  useEffect(() => {
    function onPointerMove(e: PointerEvent) {
      const rect = gl.domElement.getBoundingClientRect();
      pointer.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    }
    window.addEventListener("pointermove", onPointerMove);
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [gl]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (activeTool !== "floor") return;
      const target = e.target as HTMLElement | null;
      if (target?.closest('[data-hud="true"]')) return;
      raycaster.setFromCamera(pointer.current, camera);
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const hit = raycaster.ray.intersectPlane(plane, new THREE.Vector3());
      if (!hit) return;
      const tile = {
        x: Math.floor(hit.x),
        z: Math.floor(hit.z),
        tex: selectedCatalogId ?? "floor",
      };
      useStore.setState((s) => {
        const key = (t: typeof tile) => `${t.x}:${t.z}`;
        const existingIdx = s.floor.findIndex((t) => key(t) === key(tile));
        const next = [...s.floor];
        if (existingIdx >= 0) next[existingIdx] = tile;
        else next.push(tile);
        return { floor: next };
      });
    }
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [activeTool, camera, raycaster, selectedCatalogId]);

  return null;
}
