import type { EventBus } from "../../events/EventBus";
import type { Vec3 } from "../../geometry/types/Vec3";

/**
 * Depdências para o snap em grade
 */
export interface GridSnapDependencies {
    /** EventBus para listenter/emitter de eventos de snap */
    readonly eventBus: EventBus;

    /** Tamanho da grande utilizada nos calculos de snap */
    readonly gridSize: number;
}

/**
 * Provedor do sistema de snap em grade
 */
export interface GridSnapProvider {
    /** Calcula o ponto de snap para uma posição */
    calculateSnapPoint(position: Vec3): Vec3 | null;

    /** Remove todos os listeners registrados */
    dispose(): void;
}
