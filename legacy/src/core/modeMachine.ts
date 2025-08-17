import { Tool } from "./types";

// Tipos de modo da aplicação
export type Mode = "view" | "build" | "buy";

// Mapeamento de ferramentas permitidas por modo
export const modeToTools: Record<Mode, Tool[]> = {
  view: [],
  build: ["wall", "floor"],
  buy: ["place", "move", "bulldoze", "eyedropper"],
};

export function isToolAllowedInMode(tool: Tool, mode: Mode): boolean {
  return modeToTools[mode].includes(tool);
}

export function normalizeModeForTool(tool: Tool): Mode {
  if ((modeToTools.build as Tool[]).includes(tool)) return "build";
  if ((modeToTools.buy as Tool[]).includes(tool)) return "buy";
  return "view";
}

// Cursor sugerido por ferramenta (placeholder)
export function getCursorForTool(tool?: Tool): string | undefined {
  switch (tool) {
    case "place":
      return "crosshair";
    case "move":
      return "move";
    case "bulldoze":
      return "not-allowed";
    case "eyedropper":
      return "copy";
    case "wall":
    case "floor":
      return "cell";
    default:
      return undefined;
  }
}
