import { useCallback, useRef, useState } from "react";
import * as THREE from "three";
import { useStore } from "../../../store/useStore";
import { ToolContext } from "./types";
import { snapToGrid } from "../toolUtils";
import { useEventBus } from "../../../core/events";
import { executeCommand } from "../../../core/commandStack";
import { withBudget } from "../../../core/budget";

type Hover = { x: number; z: number };

export function FloorStrategy({ ctx }: { ctx: ToolContext }) {
  void ctx;
  const [hover, setHover] = useState<Hover | null>(null);
  const hoverRef = useRef<Hover | null>(null);

  const setHoverState = useCallback((h: Hover | null) => {
    hoverRef.current = h;
    setHover(h);
  }, []);

  const handlePointer = useCallback(({ x, y }: { x: number; y: number }) => {
    const { activeTool, camera, input } = useStore.getState();
    if (activeTool !== "floor" || camera.gestureActive) return;
    const gp = input.groundPoint;
    if (!gp) {
      setHoverState(null);
      return;
    }
    const snapped = snapToGrid(new THREE.Vector3(gp.x, gp.y, gp.z), "floor");
    setHoverState({ x: snapped.x, z: snapped.z });
  }, [setHoverState]);

  const handleClick = useCallback(
    ({ button, hudTarget }: { button: number; hudTarget: boolean }) => {
      const { activeTool, camera, selectedCatalogId } = useStore.getState();
      if (activeTool !== "floor" || camera.gestureActive || hudTarget || button !== 0) return;
      const h = hoverRef.current;
      if (!h) return;
      const tile = { x: h.x, z: h.z, tex: selectedCatalogId ?? "floor" };
      const cmd = {
        description: "paint-floor",
        execute: () =>
          useStore.setState((s) => {
            const key = (t: typeof tile) => `${t.x}:${t.z}`;
            const existingIdx = s.floor.findIndex((t) => key(t) === key(tile));
            const next = [...s.floor];
            if (existingIdx >= 0) next[existingIdx] = tile;
            else next.push(tile);
            return { floor: next };
          }),
        undo: () =>
          useStore.setState((s) => {
            const key = (t: typeof tile) => `${t.x}:${t.z}`;
            const idx = s.floor.findIndex((t) => key(t) === key(tile));
            const next = [...s.floor];
            if (idx >= 0) next.splice(idx, 1);
            return { floor: next };
          }),
      };
      const decorated = withBudget(cmd, 0);
      executeCommand(decorated, useStore.getState().pushCommand);
    },
    [],
  );

  useEventBus("pointerNdc", handlePointer);
  useEventBus("click", handleClick);

  const activeTool = useStore((s) => s.activeTool);
  if (activeTool !== "floor" || !hover) return null;
  const t = hover;
  return (
    <mesh
      position={[t.x + 0.5, 0.01, t.z + 0.5]}
      rotation={[-Math.PI / 2, 0, 0]}
      renderOrder={1000}
      castShadow={false}
      receiveShadow={false}
    >
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        color="#38bdf8"
        transparent
        opacity={0.25}
        depthTest={false}
        depthWrite={false}
        polygonOffset
        polygonOffsetFactor={-1}
      />
    </mesh>
  );
}

export default FloorStrategy;
