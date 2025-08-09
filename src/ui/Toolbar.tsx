import { useStore } from "../store/useStore";

export function Toolbar() {
  const mode = useStore((s) => s.mode);
  const activeTool = useStore((s) => s.activeTool);
  const setMode = useStore((s) => s.setMode);
  const setTool = useStore((s) => s.setTool);
  const undoOnce = useStore((s) => s.undoOnce);
  const redoOnce = useStore((s) => s.redoOnce);
  const groupStyle: React.CSSProperties = {
    display: "flex",
    gap: 8,
    background: "rgba(255,255,255,0.95)",
    padding: 8,
    borderRadius: 12,
    boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
  };
  const buttonStyle = (active: boolean): React.CSSProperties => ({
    height: 44,
    minWidth: 44,
    padding: "0 12px",
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    background: active ? "#e0f2fe" : "#fff",
    fontWeight: active ? 800 : 600,
    textTransform: "capitalize",
  });
  return (
    <div style={{ display: "flex", gap: 12 }}>
      {/* Modo */}
      <div style={groupStyle}>
        {(["view", "build", "buy"] as const).map((m) => (
          <button key={m} onClick={() => setMode(m)} style={buttonStyle(mode === m)}>
            {m}
          </button>
        ))}
      </div>

      {/* Tools por modo */}
      {mode === "build" && (
        <div style={groupStyle}>
          {(["wall", "floor"] as const).map((t) => (
            <button key={t} onClick={() => setTool(t)} style={buttonStyle(activeTool === t)}>
              {t}
            </button>
          ))}
        </div>
      )}
      {mode === "buy" && (
        <div style={groupStyle}>
          {(["place", "move", "bulldoze", "eyedropper"] as const).map((t) => (
            <button key={t} onClick={() => setTool(t)} style={buttonStyle(activeTool === t)}>
              {t}
            </button>
          ))}
        </div>
      )}

      {/* Undo/Redo */}
      <div style={groupStyle}>
        <button onClick={undoOnce} style={buttonStyle(false)}>
          Undo
        </button>
        <button onClick={redoOnce} style={buttonStyle(false)}>
          Redo
        </button>
      </div>
    </div>
  );
}
