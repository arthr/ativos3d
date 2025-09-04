import type { EventBus } from "@core/events/EventBus";
import type { ToolManager } from "../ToolManager";
import { ViewTool } from "./ViewTool";
import { SelectTool } from "./SelectTool";
import { PlaceTool } from "./PlaceTool";
import { MoveTool } from "./MoveTool";
import { DeleteTool } from "./DeleteTool";

/**
 * Registra ferramentas básicas no ToolManager
 */
export function registerBasicTools(toolManager: ToolManager, eventBus: EventBus): void {
    toolManager.register("view", new ViewTool(eventBus));
    toolManager.register("select", new SelectTool(eventBus));
    toolManager.register("place", new PlaceTool(eventBus));
    toolManager.register("move", new MoveTool(eventBus));
    toolManager.register("delete", new DeleteTool(eventBus));
}

export { ViewTool, SelectTool, PlaceTool, MoveTool, DeleteTool };
