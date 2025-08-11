import { useState } from "react";
import { ToolContext } from "./types";
import { usePlacementPreview } from "./placePreview";
import { usePlaceEvents } from "./placeEvents";

export function PlaceStrategy({ ctx }: { ctx: ToolContext }) {
  void ctx;
  const [yaw, setYaw] = useState<0 | 90 | 180 | 270>(0);
  const preview = usePlacementPreview(yaw);
  usePlaceEvents(yaw, setYaw, preview);
  if (!preview) return null;
  return (
    <mesh
      position={[preview.pos.x + preview.w / 2, preview.h / 2, preview.pos.z + preview.d / 2]}
      renderOrder={1000}
      castShadow={false}
      receiveShadow={false}
    >
      <boxGeometry args={[preview.w, preview.h, preview.d]} />
      <meshStandardMaterial
        color={preview.valid ? "#16a34a" : "#ef4444"}
        transparent
        opacity={0.5}
        depthTest={false}
        depthWrite={false}
        polygonOffset
        polygonOffsetFactor={-1}
      />
    </mesh>
  );
}

export default PlaceStrategy;
