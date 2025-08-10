import { useStore } from "../store/useStore";
import ToolbarGroup from "./components/ToolbarGroup";
import Button from "./components/Button";

export function Toolbar() {
  const mode = useStore((s) => s.mode);
  const activeTool = useStore((s) => s.activeTool);
  const setMode = useStore((s) => s.setMode);
  const setTool = useStore((s) => s.setTool);
  const undoOnce = useStore((s) => s.undoOnce);
  const redoOnce = useStore((s) => s.redoOnce);
  const buttonStyle = (active: boolean): React.CSSProperties => ({
    height: 44,
    minWidth: 44,
    padding: "0 12px",
  });
  return (
    <div style={{ display: "flex", gap: 12 }}>
      {/* Modo */}
      <ToolbarGroup>
        {(["view", "build", "buy"] as const).map((m) => (
          <Button
            aria-label={`Modo ${m}`}
            title={`Modo ${m}`}
            key={m}
            onClick={() => setMode(m)}
            active={mode === m}
          >
            {m}
          </Button>
        ))}
      </ToolbarGroup>

      {/* Tools por modo */}
      {mode === "build" && (
        <ToolbarGroup>
          {(["wall", "floor"] as const).map((t) => (
            <Button
              aria-label={`Ferramenta ${t}`}
              title={`Ferramenta ${t}`}
              key={t}
              onClick={() => setTool(t)}
              active={activeTool === t}
            >
              {t}
            </Button>
          ))}
        </ToolbarGroup>
      )}
      {mode === "buy" && (
        <ToolbarGroup>
          {(["place", "move", "bulldoze", "eyedropper"] as const).map((t) => (
            <Button
              aria-label={`Ferramenta ${t}`}
              title={`Ferramenta ${t}`}
              key={t}
              onClick={() => setTool(t)}
              active={activeTool === t}
            >
              {t}
            </Button>
          ))}
        </ToolbarGroup>
      )}

      {/* Undo/Redo */}
      <ToolbarGroup>
        <Button aria-label="Desfazer (Ctrl+Z)" title="Desfazer (Ctrl+Z)" onClick={undoOnce}>
          Undo
        </Button>
        <Button aria-label="Refazer (Ctrl+Y)" title="Refazer (Ctrl+Y)" onClick={redoOnce}>
          Redo
        </Button>
      </ToolbarGroup>
    </div>
  );
}
