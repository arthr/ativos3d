import type { EventBus } from "@core/events/EventBus";
import type { EntityId } from "@core/types/ecs/EntityId";
import type { ToolStrategy } from "../strategies/ToolStrategy";

/**
 * Ferramenta de movimentação de entidades
 */
export class MoveTool implements ToolStrategy {
    constructor(private readonly eventBus: EventBus) {}

    /** Ativa a ferramenta */
    activate(): void {}

    /** Desativa a ferramenta */
    deactivate(): void {}

    /** Lida com input de movimentação */
    handleInput(input: { entityId: EntityId }): void {
        if (!input?.entityId) return;
        this.eventBus.emit("entityMoved", { entityId: input.entityId });
    }
}
