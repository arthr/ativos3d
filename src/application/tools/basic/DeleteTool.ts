import type { EventBus } from "@core/events/EventBus";
import type { EntityId } from "@core/types/ecs/EntityId";
import type { ToolStrategy } from "../strategies/ToolStrategy";

/**
 * Ferramenta de deleção de entidades
 */
export class DeleteTool implements ToolStrategy {
    constructor(private readonly eventBus: EventBus) {}

    /** Ativa a ferramenta */
    activate(): void {}

    /** Desativa a ferramenta */
    deactivate(): void {}

    /** Lida com input de deleção */
    handleInput(input: { entityId: EntityId; type?: string }): void {
        if (!input?.entityId) return;
        this.eventBus.emit("entityDestroyed", {
            entityId: input.entityId,
            type: input.type ?? "unknown",
        });
    }
}
