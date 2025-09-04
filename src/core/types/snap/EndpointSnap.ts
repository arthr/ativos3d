import type { EventBus } from "../../events/EventBus";
import type { Vec3 } from "../../geometry/types/Vec3";

/**
 * Dependências para o sistema de snap em extremidades
 */
export interface EndpointSnapDependencies {
    readonly eventBus: EventBus;
    readonly getEndpoints: () => Vec3[];
}

/**
 * Provedor do sistema de snap em extremidades
 */
export interface EndpointSnapProvider {
    calculateSnapPoint(position: Vec3): Vec3 | null;
    dispose(): void;
}
