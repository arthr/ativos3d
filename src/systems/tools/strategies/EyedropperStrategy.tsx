import { useCallback, useRef, useState } from "react";
import * as THREE from "three";
import { ToolContext } from "./types";
import { useStore } from "../../../store/useStore";
import { useEventBus } from "../../../core/events";

export function EyedropperStrategy({ ctx }: { ctx: ToolContext }) {
  const raycasterRef = useRef(new THREE.Raycaster());
  const hoverRef = useRef<string | null>(null);
  const [, setHover] = useState<string | null>(null);

  const setHoverState = useCallback((d: string | null) => {
    hoverRef.current = d;
    setHover(d);
  }, []);

  const handlePointer = useCallback(({ x, y }: { x: number; y: number }) => {
    const { activeTool, camera } = useStore.getState();
    if (activeTool !== "eyedropper" || camera.gestureActive) return;
    const ndc = new THREE.Vector2(x, y);
    raycasterRef.current.setFromCamera(ndc, ctx.camera);
    const hits = raycasterRef.current.intersectObjects(ctx.scene.children, true);
    const objHit = hits.find(
      (h) =>
        (h.object as { userData?: { defId?: string; objectId?: string } })?.userData?.defId ||
        (h.object as { userData?: { defId?: string; objectId?: string } })?.userData?.objectId,
    );
    if (objHit) {
      const u = (objHit.object as { userData?: { defId?: string; objectId?: string } }).userData ?? {};
      setHoverState(u.defId ?? null);
    } else {
      setHoverState(null);
    }
  }, [ctx, setHoverState]);

  const handleClick = useCallback(
    ({ button, hudTarget }: { button: number; hudTarget: boolean }) => {
      const { activeTool, camera } = useStore.getState();
      if (activeTool !== "eyedropper" || camera.gestureActive || hudTarget || button !== 0) return;
      if (hoverRef.current) {
        useStore.setState({ selectedCatalogId: hoverRef.current, activeTool: "place" });
      }
    },
    [],
  );

  useEventBus("pointerNdc", handlePointer);
  useEventBus("click", handleClick);

  return null;
}

export default EyedropperStrategy;
