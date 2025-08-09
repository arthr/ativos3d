import { useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useStore } from "../../store/useStore";
import { intersectGround, isHudEventTarget, snapToGrid } from "./toolUtils";
import { eventBus } from "../../core/events";

export function PaintFloorTool() {
  const activeTool = useStore((s) => s.activeTool);
  const cameraGestureActive = useStore((s) => s.cameraGestureActive);
  const selectedCatalogId = useStore((s) => s.selectedCatalogId);
  const { camera, gl } = useThree();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const pointerNdc = useStore((s) => s.input.pointerNdc);
  const hoverTile = useRef<{ x: number; z: number } | null>(null);

  useEffect(() => {
    if (activeTool !== "floor") return;
    const off = eventBus.on("pointerNdc", ({ x, y }) => {
      const ndc = new THREE.Vector2(x, y);
      const hit = intersectGround(raycaster, camera, ndc);
      if (!hit) {
        hoverTile.current = null;
        return;
      }
      const snapped = snapToGrid(hit, "floor");
      hoverTile.current = { x: snapped.x, z: snapped.z };
    });
    return () => off();
  }, [activeTool, camera, raycaster]);

  useEffect(() => {
    if (activeTool !== "floor") return;
    const off = eventBus.on("click", ({ button, hudTarget, ground }) => {
      if (cameraGestureActive || hudTarget || button !== 0 || !ground) return;
      const snapped = snapToGrid(new THREE.Vector3(ground.x, ground.y, ground.z), "floor");
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
    });
    return () => off();
  }, [activeTool, selectedCatalogId, cameraGestureActive]);

  if (activeTool !== "floor" || !hoverTile.current) return null;
  const t = hoverTile.current;
  return (
    <mesh position={[t.x + 0.5, 0.01, t.z + 0.5]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial color="#38bdf8" transparent opacity={0.25} />
    </mesh>
  );
}
