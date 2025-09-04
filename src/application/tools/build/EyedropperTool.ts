import type { Component } from "@core/types/ecs/Component";
import type { EventBus } from "@core/events/EventBus";
import type { EntityId } from "@core/types/ecs/EntityId";
import type { ToolStrategy } from "../strategies/ToolStrategy";
import { EntityManager } from "@domain/entities/EntityManager";

/**
 * Ferramenta de amostragem de componentes
 */
export class EyedropperTool implements ToolStrategy {
    constructor(
        private readonly eventBus: EventBus,
        private readonly entityManager: EntityManager,
    ) {}

    /** Ativa a ferramenta */
    activate(): void {}

    /** Desativa a ferramenta */
    deactivate(): void {}

    /** Lida com input de amostragem */
    handleInput(input: { entityId: EntityId; componentType: string }): void {
        const { entityId, componentType } = input;
        if (!entityId || !componentType) return;
        const entity = this.entityManager.getEntity(entityId);
        if (!entity) return;
        const component = entity.getComponent<Component>(componentType);
        if (!component) return;
        this.eventBus.emit("eyedropperSampled", { entityId, component });
    }
}
