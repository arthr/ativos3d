import type { Component } from "../ecs/Component";
import type { EntityId } from "../ecs/EntityId";
import type { ToolType, ModeType } from "../tools/ToolTypes";

/**
 * Eventos de ferramentas
 */
export interface ToolEvents {
    toolActivated: { tool: ToolType };
    toolDeactivated: { tool: ToolType };
    modeChanged: { mode: ModeType };
    eyedropperSampled: { entityId: EntityId; component: Component };
}
