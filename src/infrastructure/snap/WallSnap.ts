import { Raycaster, Vector2 } from "three";
import type { Camera } from "three";
import { CollisionFactory, CollisionDetection, Vec3Factory } from "@core/geometry";
import type { WallSnapDependencies, WallSnapProvider } from "@core/types/snap";
import type { InputEvents } from "@core/types/events/InputEvents";
import type { Vec2 } from "@core/geometry/types/Vec2";
import type { Vec3 } from "@core/geometry/types/Vec3";
import type { Unsubscribe } from "@core/types/Events";

/**
 * Sistema de snap em paredes
 */
export class WallSnap implements WallSnapProvider {
    private readonly eventBus: WallSnapDependencies["eventBus"];
    private readonly cameraSystem: WallSnapDependencies["cameraSystem"];
    private readonly getWallBodies: WallSnapDependencies["getWallBodies"];
    private readonly raycaster = new Raycaster();
    private readonly unsubscribe: Unsubscribe;

    constructor(dependencies: WallSnapDependencies) {
        this.eventBus = dependencies.eventBus;
        this.cameraSystem = dependencies.cameraSystem;
        this.getWallBodies = dependencies.getWallBodies;
        this.unsubscribe = this.eventBus.on("pointerMove", this.handlePointerMove);
    }

    /** Calcula o ponto de snap para uma posição em NDC */
    calculateSnapPoint(ndc: Vec2): Vec3 | null {
        const camera = this.cameraSystem.getCamera() as Camera;
        this.raycaster.setFromCamera(new Vector2(ndc.x, ndc.y), camera);
        const origin = Vec3Factory.create(
            this.raycaster.ray.origin.x,
            this.raycaster.ray.origin.y,
            this.raycaster.ray.origin.z,
        );
        const direction = Vec3Factory.create(
            this.raycaster.ray.direction.x,
            this.raycaster.ray.direction.y,
            this.raycaster.ray.direction.z,
        );
        const query = CollisionFactory.createRaycastQuery({ origin, direction });
        const result = CollisionDetection.raycastBodies(query, this.getWallBodies());

        if (!result.hit || !result.point) return null;
        return result.point;
    }

    /** Remove todos os listeners registrados */
    dispose(): void {
        this.unsubscribe();
    }

    /** Lida com movimento do ponteiro */
    private handlePointerMove = (event: InputEvents["pointerMove"]): void => {
        const snappedPosition = this.calculateSnapPoint(event.ndc);
        if (!snappedPosition) return;
        this.eventBus.emit("snapPointCalculated", {
            originalPosition: event.worldPosition,
            snappedPosition,
            snapType: "wall",
        });
    };
}
