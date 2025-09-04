import { useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { useStore } from "../../store/useStore";
import { Tool } from "../../core/types";
import { StrategyComponent, ToolContext } from "./strategies/types";

export function ToolManager({ strategies }: { strategies: Record<Tool, StrategyComponent> }) {
  const { camera, gl, scene } = useThree();
  const activeTool = useStore((s) => s.activeTool);
  const mode = useStore((s) => s.mode);
  const ctx = useMemo<ToolContext>(() => ({ camera, gl, scene }), [camera, gl, scene]);
  const Strategy = mode === "view" ? null : strategies[activeTool];
  return Strategy ? <Strategy ctx={ctx} /> : null;
}

