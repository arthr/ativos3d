import { ToolContext } from "./types";
import { useMoveState } from "./move/state";
import { useMoveEvents } from "./move/events";
import { useMoveFrame } from "./move/frame";
import { useMovePreview } from "./move/preview";

export function MoveStrategy({ ctx }: { ctx: ToolContext }) {
  void ctx;
  const state = useMoveState();
  useMoveEvents(state);
  useMoveFrame(state);
  const preview = useMovePreview(state);
  if (!preview) return null;
  return (
    <group>
      {/* box preview deslocado pela metade do footprint */}
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
          opacity={0.35}
          depthTest={false}
          depthWrite={false}
          polygonOffset
          polygonOffsetFactor={-1}
        />
      </mesh>
    </group>
  );
}

export default MoveStrategy;
