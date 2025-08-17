import { useCallback, useRef, useState } from "react";
import * as THREE from "three";
import { useStore } from "../../../store/useStore";
import { ToolContext } from "./types";
import { snapToGrid } from "../toolUtils";
import { useEventBus } from "../../../core/events";
import { executeCommand } from "../../../core/commandStack";
import { withBudget } from "../../../core/budget";
import { catalog } from "../../../core/catalog";
import { CatalogItem3D } from "../../../core/types";

type Hover =
  | { kind: "object"; id: string }
  | { kind: "tile"; x: number; z: number };

export function BulldozeStrategy({ ctx }: { ctx: ToolContext }) {
  const raycasterRef = useRef(new THREE.Raycaster());
  const hoverRef = useRef<Hover | null>(null);
  const [hover, setHover] = useState<Hover | null>(null);

  const setHoverState = useCallback((h: Hover | null) => {
    hoverRef.current = h;
    setHover(h);
  }, []);

  const handlePointer = useCallback(({ x, y }: { x: number; y: number }) => {
    const { activeTool, camera, input } = useStore.getState();
    if (activeTool !== "bulldoze" || camera.gestureActive) return;
    const ndc = new THREE.Vector2(x, y);
    const raycaster = raycasterRef.current;
    raycaster.setFromCamera(ndc, ctx.camera);
    const hitList = raycaster.intersectObjects(ctx.scene.children, true);
    const objHit = hitList.find(
      (h) => (h.object as { userData?: { objectId?: string } })?.userData?.objectId,
    );
    if (objHit) {
      const objectId = (objHit.object as { userData?: { objectId?: string } }).userData
        ?.objectId as string;
      setHoverState({ kind: "object", id: objectId });
      return;
    }
    const gp = input.groundPoint;
    if (gp) {
      const snapped = snapToGrid(new THREE.Vector3(gp.x, gp.y, gp.z), "floor");
      setHoverState({ kind: "tile", x: snapped.x, z: snapped.z });
    } else {
      setHoverState(null);
    }
  }, [ctx, setHoverState]);

  const handleClick = useCallback(
    ({ button, hudTarget }: { button: number; hudTarget: boolean }) => {
      const { activeTool, camera } = useStore.getState();
      if (activeTool !== "bulldoze" || camera.gestureActive || hudTarget || button !== 0) return;
      const h = hoverRef.current;
      if (!h) return;
      if (h.kind === "object") {
        const id = h.id;
        const snapshot = useStore.getState().objects.find((o) => o.id === id);
        const cmd = {
          description: "bulldoze-object",
          execute: () =>
            useStore.setState((s) => ({ objects: s.objects.filter((o) => o.id !== id) })),
          undo: () =>
            snapshot && useStore.setState((s) => ({ objects: [...s.objects, snapshot] })),
        };
        const price =
          (catalog as unknown as CatalogItem3D[]).find((i) => i.id === snapshot?.defId)?.price ??
          0;
        const decorated = withBudget(cmd, -price);
        executeCommand(decorated, useStore.getState().pushCommand);
        return;
      }
      const x = h.x;
      const z = h.z;
      const snapshot = useStore.getState().floor.find((t) => t.x === x && t.z === z);
      const cmd = {
        description: "bulldoze-floor",
        execute: () =>
          useStore.setState((s) => ({ floor: s.floor.filter((t) => !(t.x === x && t.z === z)) })),
        undo: () => snapshot && useStore.setState((s) => ({ floor: [...s.floor, snapshot] })),
      };
      const decorated = withBudget(cmd, 0);
      executeCommand(decorated, useStore.getState().pushCommand);
    },
    [],
  );

  useEventBus("pointerNdc", handlePointer);
  useEventBus("click", handleClick);

  const activeTool = useStore((s) => s.activeTool);
  if (activeTool !== "bulldoze" || !hover || hover.kind !== "tile") return null;
  const t = hover;
  return (
    <mesh position={[t.x + 0.5, 0.02, t.z + 0.5]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial color="#ef4444" transparent opacity={0.2} />
    </mesh>
  );
}

export default BulldozeStrategy;
