import { useStore } from "../store/useStore";

export function Topbar() {
  const cameraMode = useStore((s) => s.cameraMode);
  const setCameraMode = useStore((s) => s.setCameraMode);
  const barStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: 8,
    background: "#ffffff",
    borderBottom: "1px solid #e5e5e5",
  };
  const buttonStyle = (active: boolean): React.CSSProperties => ({
    height: 32,
    minWidth: 44,
    padding: "0 10px",
    borderRadius: 8,
    border: "1px solid #e5e7eb",
    background: active ? "#e0f2fe" : "#fff",
    fontWeight: active ? 800 : 600,
    textTransform: "capitalize",
  });
  return (
    <div style={barStyle}>
      <div style={{ fontWeight: 800 }}>Ativos3D</div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => setCameraMode("persp")} style={buttonStyle(cameraMode === "persp")}>
          Perspective
        </button>
        <button onClick={() => setCameraMode("ortho")} style={buttonStyle(cameraMode === "ortho")}>
          Orthographic
        </button>
      </div>
    </div>
  );
}
