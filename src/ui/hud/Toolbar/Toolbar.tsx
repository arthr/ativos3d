import { useStore } from "../../../store/useStore";
import ToolbarGroup from "../../components/ToolbarGroup";
import Button from "../../components/Button";
import { PiBulldozerFill, PiEyedropperFill, PiWallDuotone } from "react-icons/pi";
import { LuUndo, LuRedo, LuReplace, LuMove, LuTrash } from "react-icons/lu";
import { MdOutlineViewInAr } from "react-icons/md";
import { BsBoxSeam } from "react-icons/bs";
import { SiDatabricks } from "react-icons/si";

export function Toolbar() {
  const mode = useStore((s) => s.mode);
  const activeTool = useStore((s) => s.activeTool);
  const setMode = useStore((s) => s.setMode);
  const setTool = useStore((s) => s.setTool);
  const undoOnce = useStore((s) => s.undoOnce);
  const redoOnce = useStore((s) => s.redoOnce);

  const toolIcon = (t: string) => {
    switch (t) {
      case "view":
        return <MdOutlineViewInAr />;
      case "build":
        return <PiBulldozerFill />;
      case "wall":
        return <PiWallDuotone />;
      case "floor":
        return <SiDatabricks />;
      case "buy":
        return <BsBoxSeam />;
      case "place":
        return <LuReplace />;
      case "move":
        return <LuMove />;
      case "bulldoze":
        return <LuTrash />;
      case "eyedropper":
        return <PiEyedropperFill />;
      default:
        return t;
    }
  };

  const toolTitle = (t: string) => {
    switch (t) {
      case "view":
        return "Visualizar";
      case "build":
        return "Construir";
      case "buy":
        return "Comprar";
      case "place":
        return "Colocar";
      case "move":
        return "Mover";
      case "bulldoze":
        return "Demolir";
      case "eyedropper":
        return "Copiar";
      default:
        return t;
    }
  };

  return (
    <div style={{ display: "flex", gap: 12 }}>
      <ToolbarGroup>
        {(["view", "build", "buy"] as const).map((m) => (
          <Button
            style={{ fontSize: 16, height: 34, padding: "8px 10px" }}
            aria-label={`Modo ${m}`}
            title={toolTitle(m)}
            key={m}
            onClick={() => setMode(m)}
            active={mode === m}
          >
            {toolIcon(m)}
          </Button>
        ))}
      </ToolbarGroup>

      {mode === "build" && (
        <ToolbarGroup>
          {(["wall", "floor"] as const).map((t) => (
            <Button
              style={{ fontSize: 16, height: 34, padding: "8px 10px" }}
              aria-label={`Ferramenta ${t}`}
              title={toolTitle(t)}
              key={t}
              onClick={() => setTool(t)}
              active={activeTool === t}
            >
              {toolIcon(t)}
            </Button>
          ))}
        </ToolbarGroup>
      )}
      {mode === "buy" && (
        <ToolbarGroup>
          {(["place", "move", "bulldoze", "eyedropper"] as const).map((t) => (
            <Button
              style={{ fontSize: 16, height: 34, padding: "8px 10px" }}
              aria-label={`Ferramenta ${t}`}
              title={toolTitle(t)}
              key={t}
              onClick={() => setTool(t)}
              active={activeTool === t}
            >
              {toolIcon(t)}
            </Button>
          ))}
        </ToolbarGroup>
      )}

      <ToolbarGroup>
        <Button
          style={{ fontSize: 16, height: 34, padding: "8px 10px" }}
          aria-label="Desfazer"
          title="Desfazer"
          onClick={undoOnce}
        >
          <LuUndo />
        </Button>
        <Button
          style={{ fontSize: 16, height: 34, padding: "8px 10px" }}
          aria-label="Refazer"
          title="Refazer"
          onClick={redoOnce}
        >
          <LuRedo />
        </Button>
      </ToolbarGroup>
    </div>
  );
}

export default Toolbar;
