import Button from "../../components/Button";
import { useStore } from "../../../store/useStore";

export function CameraModeToggle() {
  const cameraMode = useStore((s) => s.cameraMode);
  const setCameraMode = useStore((s) => s.setCameraMode);
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <Button
        aria-label="Câmera perspectiva"
        title="Câmera perspectiva"
        onClick={() => setCameraMode("persp")}
        active={cameraMode === "persp"}
      >
        Perspective
      </Button>
      <Button
        aria-label="Câmera ortográfica"
        title="Câmera ortográfica"
        onClick={() => setCameraMode("ortho")}
        active={cameraMode === "ortho"}
      >
        Orthographic
      </Button>
    </div>
  );
}

export default CameraModeToggle;
