import type { EventBus } from "@core/events/EventBus";
import type { Vec3 } from "@core/geometry";
import type { ToolStrategy } from "../strategies/ToolStrategy";
import { EntityManager } from "@domain/entities/EntityManager";
import { FloorComponent } from "@domain/components/FloorComponent";

/**
 * Ferramenta de construção de pisos
 */
export class FloorTool implements ToolStrategy {
    constructor(
        private readonly eventBus: EventBus,
        private readonly entityManager: EntityManager,
    ) {}

    /** Ativa a ferramenta */
    activate(): void {}

    /** Desativa a ferramenta */
    deactivate(): void {}

    /** Lida com input de construção de pisos */
    handleInput(input: { position: Vec3; size: Vec3; material: string }): void {
        const { position, size, material } = input || {};
        if (!position || !size || !material) return;
        const entity = this.entityManager.createEntity();
        const floorComponent = FloorComponent.create({ position, size, material });
        this.entityManager.addComponent(entity.id, floorComponent);
        this.eventBus.emit("floorCreated", { entityId: entity.id });
    }
}
