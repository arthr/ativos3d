import type { ToolType } from "@core/types";
import type { EventBus } from "@core/events/EventBus";
import type { ToolStrategy } from "./strategies/ToolStrategy";

/**
 * Gerencia as ferramentas disponíveis
 */
export class ToolManager {
    private strategies = new Map<ToolType, ToolStrategy>();
    private activeTool: ToolType | null = null;

    constructor(private readonly eventBus: EventBus) {}

    /** Registra uma ferramenta */
    register(tool: ToolType, strategy: ToolStrategy): void {
        this.strategies.set(tool, strategy);
    }

    /** Ativa a ferramenta */
    activate(tool: ToolType): void {
        if (this.activeTool === tool) return;
        if (this.activeTool) {
            const current = this.strategies.get(this.activeTool);
            current?.deactivate();
            this.eventBus.emit("toolDeactivated", { tool: this.activeTool });
        }

        this.activeTool = tool;
        this.strategies.get(tool)?.activate();
        this.eventBus.emit("toolActivated", { tool });
    }

    /** Desativa a ferramenta ativa */
    deactivate(): void {
        if (!this.activeTool) return;

        const tool = this.activeTool;
        this.strategies.get(tool)?.deactivate();
        this.activeTool = null;
        this.eventBus.emit("toolDeactivated", { tool });
    }

    /** Encaminha entrada para a ferramenta ativa */
    handleInput(input: unknown): void {
        if (!this.activeTool) return;
        this.strategies.get(this.activeTool)?.handleInput(input);
    }
}
