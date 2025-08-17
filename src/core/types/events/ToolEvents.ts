import type { ToolType, ModeType } from "../Common";

/**
 * Eventos de ferramentas
 */
export interface ToolEvents {
    toolActivated: { tool: ToolType };
    toolDeactivated: { tool: ToolType };
    modeChanged: { mode: ModeType };
}
