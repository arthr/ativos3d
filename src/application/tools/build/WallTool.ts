import type { EventBus } from "@core/events/EventBus";
import type { Vec3 } from "@core/geometry";
import type { ToolStrategy } from "../strategies/ToolStrategy";
import { EntityManager } from "@domain/entities/EntityManager";
import { WallComponent } from "@domain/components/WallComponent";

/**
 * Ferramenta de construção de paredes
 */
export class WallTool implements ToolStrategy {
    constructor(
        private readonly eventBus: EventBus,
        private readonly entityManager: EntityManager,
    ) {}

    /** Ativa a ferramenta */
    activate(): void {}

    /** Desativa a ferramenta */
    deactivate(): void {}

    /**
     * Cria uma parede entre dois pontos
     */
    handleInput(input: { start: Vec3; end: Vec3; height: number; thickness: number }): void {
        const { start, end, height, thickness } = input || {};
        if (!start || !end || !height || !thickness) return;
        const entity = this.entityManager.createEntity();
        const wall = WallComponent.create({ start, end, height, thickness });
        this.entityManager.addComponent(entity.id, wall);
        this.eventBus.emit("wallCreated", { entityId: entity.id });
    }
}
