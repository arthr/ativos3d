import { Raycaster, Vector2 } from "three";
import type { Camera } from "three";
import {
    CollisionFactory,
    CollisionDetection,
    Vec3Factory,
    AABBOperations,
    Vec3Operations,
} from "@core/geometry";
import type { ObjectSnapDependencies, ObjectSnapProvider } from "@core/types/snap";
import type { InputEvents } from "@core/types/events/InputEvents";
import type { Vec2 } from "@core/geometry/types/Vec2";
import type { Vec3 } from "@core/geometry/types/Vec3";
import type { Unsubscribe } from "@core/types/Events";

/**
 * Sistema de snap em objetos
 */
export class ObjectSnap implements ObjectSnapProvider {
    private readonly eventBus: ObjectSnapDependencies["eventBus"];
    private readonly cameraSystem: ObjectSnapDependencies["cameraSystem"];
    private readonly getCollisionBodies: ObjectSnapDependencies["getCollisionBodies"];
    private readonly raycaster = new Raycaster();
    private readonly unsubscribe: Unsubscribe;

    constructor(dependencies: ObjectSnapDependencies) {
        this.eventBus = dependencies.eventBus;
        this.cameraSystem = dependencies.cameraSystem;
        this.getCollisionBodies = dependencies.getCollisionBodies;
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
        const result = CollisionDetection.raycastBodies(query, this.getCollisionBodies());

        if (!result.hit || !result.body) return null;

        const center = AABBOperations.getCenter(result.body.bounds);
        return Vec3Operations.add(center, result.body.position);
    }

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
            snapType: "object",
        });
    };
}
