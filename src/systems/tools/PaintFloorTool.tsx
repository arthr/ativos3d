import { useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useStore } from "../../store/useStore";
import { getNormalizedPointer, intersectGround, isHudEventTarget, snapToGrid } from "./toolUtils";

export function PaintFloorTool() {
  const activeTool = useStore((s) => s.activeTool);
  const cameraGestureActive = useStore((s) => s.cameraGestureActive);
  const selectedCatalogId = useStore((s) => s.selectedCatalogId);
  const { camera, gl } = useThree();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const pointer = useRef(new THREE.Vector2(0, 0));
  const hoverTile = useRef<{ x: number; z: number } | null>(null);

  useEffect(() => {
    function onPointerMove(e: PointerEvent) {
      getNormalizedPointer(e, gl.domElement, pointer.current);
      if (activeTool !== "floor") return;
      const hit = intersectGround(raycaster, camera, pointer.current);
      if (!hit) {
        hoverTile.current = null;
        return;
      }
      const snapped = snapToGrid(hit, "floor");
      hoverTile.current = { x: snapped.x, z: snapped.z };
    }
    window.addEventListener("pointermove", onPointerMove);
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [gl, activeTool, camera, raycaster]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (activeTool !== "floor" || cameraGestureActive) return;
      if (isHudEventTarget(e)) return;
      raycaster.setFromCamera(pointer.current, camera);
      const hit = intersectGround(raycaster, camera, pointer.current);
      if (!hit) return;
      const snapped = snapToGrid(hit, "floor");
      const tile = {
        x: snapped.x,
        z: snapped.z,
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
  }, [activeTool, camera, raycaster, selectedCatalogId, cameraGestureActive]);

  if (activeTool !== "floor" || !hoverTile.current) return null;
  const t = hoverTile.current;
  return (
    <mesh position={[t.x + 0.5, 0.01, t.z + 0.5]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial color="#38bdf8" transparent opacity={0.25} />
    </mesh>
  );
}
