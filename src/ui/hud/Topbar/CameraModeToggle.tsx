import Button from "../../components/Button";
import { useStore } from "../../../store/useStore";
import { MdOutlineViewInAr } from "react-icons/md";
import { LuRotate3D } from "react-icons/lu";

export function CameraModeToggle() {
  const cameraMode = useStore((s) => s.cameraMode);
  const setCameraMode = useStore((s) => s.setCameraMode);
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <Button
        aria-label="Câmera perspectiva"
        title="Câmera perspectiva"
        onClick={() => setCameraMode("persp")}
        active={cameraMode === "persp"}
      >
        <LuRotate3D /> {/* TODO: add tooltip */}
        Perspectiva
      </Button>
      <Button
        aria-label="Câmera ortográfica"
        title="Câmera ortográfica"
        onClick={() => setCameraMode("ortho")}
        active={cameraMode === "ortho"}
      >
        <MdOutlineViewInAr /> {/* TODO: add tooltip */}
        Isométrica
      </Button>
    </div>
  );
}

export default CameraModeToggle;
