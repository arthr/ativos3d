import type { GridSnapDependencies, GridSnapProvider } from "@core/types/snap";
import type { InputEvents } from "@core/types/events/InputEvents";
import type { Vec3 } from "@core/geometry/types/Vec3";
import type { Unsubscribe } from "@core/types/Events";
import { Vec3Factory } from "@core/geometry";

/**
 * Sistema de snap em grade
 */
export class GridSnap implements GridSnapProvider {
    private readonly eventBus: GridSnapDependencies["eventBus"];
    private readonly gridSize: GridSnapDependencies["gridSize"];
    private readonly unsubscribe: Unsubscribe;

    constructor(dependencies: GridSnapDependencies) {
        this.eventBus = dependencies.eventBus;
        this.gridSize = dependencies.gridSize;
        this.unsubscribe = this.eventBus.on("pointerMove", this.handlePointerMove);
    }

    /** Calcula o ponto de snap para uma posição */
    calculateSnapPoint(position: Vec3): Vec3 | null {
        const snappedX = Math.round(position.x / this.gridSize) * this.gridSize;
        const snappedZ = Math.round(position.z / this.gridSize) * this.gridSize;
        return Vec3Factory.create(snappedX, position.y, snappedZ);
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
            snapType: "grid",
        });
    };
}
