import { useStore } from "../store/useStore";
import {
  exportCurrentLotToDownload,
  importLotFromFile,
  exportThumbnailPng,
} from "./services/fileActions";
import Button from "./components/Button";

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
      <div style={{ display: "flex", gap: 8 }}>
        <Button
          aria-label="Exportar lote"
          title="Exportar lote"
          onClick={exportCurrentLotToDownload}
        >
          Exportar
        </Button>
        <label
          title="Importar lote"
          style={{
            ...buttonStyle(false),
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          Importar
          <input
            type="file"
            accept="application/json,.json"
            style={{ display: "none" }}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              try {
                await importLotFromFile(file);
              } catch (err) {
                // eslint-disable-next-line no-alert
                alert("Falha ao importar JSON: " + (err as Error).message);
              } finally {
                e.currentTarget.value = "";
              }
            }}
          />
        </label>
        <Button
          aria-label="Exportar thumbnail"
          title="Exportar thumbnail"
          onClick={exportThumbnailPng}
        >
          Thumbnail
        </Button>
      </div>
    </div>
  );
}
