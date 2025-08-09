import { ToolStrategy, ToolContext } from "./types";
import { useStore } from "../../../store/useStore";
import { eventBus } from "../../../core/events";
import * as THREE from "three";

export function createEyedropperStrategy(ctx: ToolContext): ToolStrategy {
  const state = { cleanup: [] as Array<() => void>, hoverDefId: null as string | null };
  const raycaster = new THREE.Raycaster();
  return {
    onActivate() {
      const offPointer = eventBus.on("pointerNdc", ({ x, y }) => {
        const { activeTool, cameraGestureActive } = useStore.getState();
        if (activeTool !== "eyedropper" || cameraGestureActive) return;
        const ndc = new THREE.Vector2(x, y);
        raycaster.setFromCamera(ndc, ctx.camera);
        const hits = raycaster.intersectObjects(ctx.scene.children, true);
        const objHit = hits.find((h) => (h.object as any)?.userData?.defId);
        state.hoverDefId = objHit?.object?.userData?.defId ?? null;
      });
      const offClick = eventBus.on("click", ({ button, hudTarget }) => {
        const { activeTool, cameraGestureActive } = useStore.getState();
        if (activeTool !== "eyedropper" || cameraGestureActive || hudTarget || button !== 0) return;
        if (state.hoverDefId) {
          useStore.setState({ selectedCatalogId: state.hoverDefId, activeTool: "place" });
        }
      });
      state.cleanup.push(offPointer, offClick);
    },
    onDeactivate() {
      state.cleanup.forEach((fn) => fn());
      state.cleanup = [];
      state.hoverDefId = null;
    },
    renderPreview() {
      return null;
    },
  } satisfies ToolStrategy;
}
