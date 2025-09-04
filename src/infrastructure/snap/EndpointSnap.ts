import type { EndpointSnapDependencies, EndpointSnapProvider } from "@core/types/snap";
import type { InputEvents } from "@core/types/events/InputEvents";
import type { Vec3 } from "@core/geometry/types/Vec3";
import type { Unsubscribe } from "@core/types/Events";
import { Vec3Math } from "@core/geometry";

/**
 * Sistema de snap em extremidades
 */
export class EndpointSnap implements EndpointSnapProvider {
    private readonly eventBus: EndpointSnapDependencies["eventBus"];
    private readonly getEndpoints: EndpointSnapDependencies["getEndpoints"];
    private readonly unsubscribe: Unsubscribe;
    private static readonly THRESHOLD = 0.5;

    constructor(dependencies: EndpointSnapDependencies) {
        this.eventBus = dependencies.eventBus;
        this.getEndpoints = dependencies.getEndpoints;
        this.unsubscribe = this.eventBus.on("pointerMove", this.handlePointerMove);
    }

    /** Calcula o ponto de snap para uma posição */
    calculateSnapPoint(position: Vec3): Vec3 | null {
        let nearest: Vec3 | null = null;
        let minDistance = Infinity;
        for (const endpoint of this.getEndpoints()) {
            const distance = Vec3Math.distance(position, endpoint);
            if (distance < minDistance) {
                minDistance = distance;
                nearest = endpoint;
            }
        }
        if (nearest && minDistance < EndpointSnap.THRESHOLD) {
            return nearest;
        }
        return null;
    }

    /** Remove todos os listeners registrados */
    dispose(): void {
        this.unsubscribe();
    }

    /** Lida com movimento do ponteiro */
    private handlePointerMove = (event: InputEvents["pointerMove"]): void => {
        const snappedPosition = this.calculateSnapPoint(event.worldPosition);
        if (!snappedPosition) return;
        this.eventBus.emit("snapPointCalculated", {
            originalPosition: event.worldPosition,
            snappedPosition,
            snapType: "endpoint",
        });
    };
}
