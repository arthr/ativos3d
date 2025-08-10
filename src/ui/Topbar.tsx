import { useStore } from "../store/useStore";
import { exportLot, importLot } from "../core/serialization";

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
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => {
            const s = useStore.getState();
            const lot = {
              width: s.lot.width,
              depth: s.lot.depth,
              height: s.lot.height,
              objects: s.objects,
              walls: s.walls,
              floor: s.floor,
              budget: s.budget,
              version: 1,
            } as const;
            const json = exportLot(lot, 1);
            const blob = new Blob([json], { type: "application/json" });
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = "lot_export.json";
            a.click();
            URL.revokeObjectURL(a.href);
          }}
          style={buttonStyle(false)}
        >
          Exportar
        </button>
        <label
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
              const text = await file.text();
              try {
                const parsed = importLot<any>(text);
                const lot = parsed.lot as any;
                useStore.setState({
                  lot: { width: lot.width, depth: lot.depth, height: lot.height },
                  objects: lot.objects ?? [],
                  walls: lot.walls ?? [],
                  floor: lot.floor ?? [],
                  budget: lot.budget ?? useStore.getState().budget,
                  selectedIds: [],
                });
              } catch (err) {
                // eslint-disable-next-line no-alert
                alert("Falha ao importar JSON: " + (err as Error).message);
              } finally {
                e.currentTarget.value = "";
              }
            }}
          />
        </label>
        <button
          onClick={() => {
            const canvas = document.querySelector("canvas");
            if (!canvas) return;
            const dataUrl = (canvas as HTMLCanvasElement).toDataURL("image/png");
            const a = document.createElement("a");
            a.href = dataUrl;
            a.download = "thumbnail.png";
            a.click();
          }}
          style={buttonStyle(false)}
        >
          Thumbnail
        </button>
      </div>
    </div>
  );
}
