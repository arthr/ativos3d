import { ToolStrategy, ToolContext } from "./types";
import { useStore } from "../../../store/useStore";
import { eventBus } from "../../../core/events";

export function createEyedropperStrategy(ctx: ToolContext): ToolStrategy {
  const state = { cleanup: [] as Array<() => void> };
  return {
    onActivate() {
      const offClick = eventBus.on("click", ({ button, hudTarget }) => {
        const { activeTool, cameraGestureActive } = useStore.getState();
        if (activeTool !== "eyedropper" || cameraGestureActive || hudTarget || button !== 0) return;
        // Reutilizar seleção anterior se existir via hover da cena (assumimos que o mesh setou userData.defId)
        // Como a estratégia não tem raycaster aqui, sugere-se manter o comportamento simples: trocar tool para place com último defId selecionado, caso exista.
        const last = useStore.getState().selectedCatalogId;
        if (last) useStore.setState({ activeTool: "place" });
      });
      state.cleanup.push(offClick);
    },
    onDeactivate() {
      state.cleanup.forEach((fn) => fn());
      state.cleanup = [];
    },
    renderPreview() {
      return null;
    },
  } satisfies ToolStrategy;
}
