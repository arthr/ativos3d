import type { EventBus } from "@core/events/EventBus";
import type { EntityId } from "@core/types/ecs/EntityId";
import type { ToolStrategy } from "../strategies/ToolStrategy";

/**
 * Ferramenta de seleção de entidades
 */
export class SelectTool implements ToolStrategy {
    constructor(private readonly eventBus: EventBus) {}

    /** Ativa a ferramenta */
    activate(): void {}

    /** Desativa a ferramenta */
    deactivate(): void {}

    /** Lida com input de seleção */
    handleInput(input: { entityId: EntityId }): void {
        if (!input?.entityId) return;
        this.eventBus.emit("entitySelected", { entityId: input.entityId });
    }
}
