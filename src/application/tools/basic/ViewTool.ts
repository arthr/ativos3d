import type { EventBus } from "@core/events/EventBus";
import type { ToolStrategy } from "../strategies/ToolStrategy";

/**
 * Ferramenta de visualização
 */
export class ViewTool implements ToolStrategy {
    constructor(private readonly eventBus: EventBus) {}

    /** Ativa a ferramenta */
    activate(): void {
        this.eventBus.emit("modeChanged", { mode: "view" });
    }

    /** Desativa a ferramenta */
    deactivate(): void {}

    /** Lida com input (não utilizado) */
    handleInput(): void {}
}
