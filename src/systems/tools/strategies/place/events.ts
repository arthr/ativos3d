import { useEffect } from "react";
import { eventBus } from "../../../../core/events";
import { useStore } from "../../../../store/useStore";
import { createPlaceCommand } from "./command";
import type { PlacementPreview } from "./preview";

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
      const { activeTool, selectedCatalogId, camera } = useStore.getState();
      if (activeTool !== "place" || hudTarget || camera.gestureActive || button !== 0) return;
      if (!preview || !selectedCatalogId || !preview.valid) return;
      createPlaceCommand(selectedCatalogId, preview.pos, yaw);
    });
    return () => {
      offKeyDown();
      offClick();
    };
  }, [yaw, setYaw, preview]);
}
