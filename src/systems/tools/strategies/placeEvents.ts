import { useEffect } from "react";
import { eventBus } from "../../../core/events";
import { useStore } from "../../../store/useStore";
import { createPlaceCommand } from "./placeCommand";
import type { PlacementPreview } from "./placePreview";

export function usePlaceEvents(
  yaw: 0 | 90 | 180 | 270,
  setYaw: (y: 0 | 90 | 180 | 270) => void,
  preview: PlacementPreview | null,
) {
  useEffect(() => {
    const offKeyDown = eventBus.on("keyDown", ({ code, shift }) => {
      if (code.toLowerCase?.() === "keyr" || code === "KeyR") {
        setYaw(((yaw + (shift ? 270 : 90)) % 360) as 0 | 90 | 180 | 270);
      }
      if (code === "Escape") {
        useStore.setState({ selectedCatalogId: undefined });
      }
    });
    const offClick = eventBus.on("click", ({ button, hudTarget }) => {
      const { activeTool, selectedCatalogId } = useStore.getState();
      const { gestureActive } = useStore.getState().camera;
      if (activeTool !== "place" || hudTarget || gestureActive || button !== 0) return;
      if (!preview || !selectedCatalogId || !preview.valid) return;
      createPlaceCommand(selectedCatalogId, preview.pos, yaw);
    });
    return () => {
      offKeyDown();
      offClick();
    };
  }, [yaw, setYaw, preview]);
}
