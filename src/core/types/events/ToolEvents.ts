import type { ToolType, ModeType } from "../tools/ToolTypes";

/**
 * Eventos de ferramentas
 */
export interface ToolEvents {
    toolActivated: { tool: ToolType };
    toolDeactivated: { tool: ToolType };
    modeChanged: { mode: ModeType };
}
