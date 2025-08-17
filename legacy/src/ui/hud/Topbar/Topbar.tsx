import CameraModeToggle from "./CameraModeToggle";
import FileActions from "./FileActions";

export function Topbar() {
  const barStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: 8,
    background: "#ffffff",
    borderBottom: "1px solid #e5e5e5",
  };
  return (
    <div style={barStyle}>
      <div style={{ fontWeight: 800 }}>Ativos3D</div>
      <CameraModeToggle />
      <FileActions />
    </div>
  );
}

export default Topbar;
