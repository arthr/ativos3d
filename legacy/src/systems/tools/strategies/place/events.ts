import { useCallback } from "react";
import { useEventBus } from "../../../../core/events";
import { useStore } from "../../../../store/useStore";
import { createPlaceCommand } from "./command";
import type { PlacementPreview } from "./preview";

export function usePlaceEvents(
  yaw: 0 | 90 | 180 | 270,
  setYaw: (y: 0 | 90 | 180 | 270) => void,
  preview: PlacementPreview | null,
) {
  const handleKeyDown = useCallback(
    ({ code, shift }: { code: string; shift: boolean }) => {
      if (code.toLowerCase?.() === "keyr" || code === "KeyR") {
        setYaw(((yaw + (shift ? 270 : 90)) % 360) as 0 | 90 | 180 | 270);
      }
      if (code === "Escape") {
        useStore.setState({ selectedCatalogId: undefined });
      }
    },
    [yaw, setYaw],
  );

  const handleClick = useCallback(
    ({ button, hudTarget }: { button: number; hudTarget: boolean }) => {
      const { activeTool, selectedCatalogId, camera } = useStore.getState();
      if (activeTool !== "place" || hudTarget || camera.gestureActive || button !== 0) return;
      if (!preview || !selectedCatalogId || !preview.valid) return;
      createPlaceCommand(selectedCatalogId, preview.pos, yaw);
    },
    [yaw, preview],
  );

  useEventBus("keyDown", handleKeyDown);
  useEventBus("click", handleClick);
}
