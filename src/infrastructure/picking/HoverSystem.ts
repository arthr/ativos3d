import { Raycaster, Vector2 } from "three";
import type { Camera } from "three";
import { CollisionFactory, CollisionDetection, Vec3Factory } from "@core/geometry";
import type { EntityId } from "@core/types/ecs/EntityId";
import type { HoverSystemDependencies, HoverSystemProvider } from "@core/types/picking";
import type { InputEvents } from "@core/types/events/InputEvents";
import type { Unsubscribe } from "@core/types/Events";

/**
 * Sistema de hover de objetos baseado em raycasting
 */
export class HoverSystem implements HoverSystemProvider {
    private readonly eventBus: HoverSystemDependencies["eventBus"];
    private readonly cameraSystem: HoverSystemDependencies["cameraSystem"];
    private readonly getCollisionBodies: HoverSystemDependencies["getCollisionBodies"];
    private readonly raycaster = new Raycaster();
    private hovered: EntityId | null = null;
    private readonly unsubscribe: Unsubscribe;

    constructor(private readonly dependencies: HoverSystemDependencies) {
        this.eventBus = dependencies.eventBus;
        this.cameraSystem = dependencies.cameraSystem;
        this.getCollisionBodies = dependencies.getCollisionBodies;
        this.unsubscribe = this.eventBus.on("pointerMove", this.handlePointerMove);
    }

    /** Retorna o ID atualmente em hover */
    getHovered(): EntityId | null {
        return this.hovered;
    }

    /** Remove listener registrado */
    dispose(): void {
        this.unsubscribe();
    }

    /** Processa eventos de ponteiro para realizar hover */
    private handlePointerMove = ({ ndc }: InputEvents["pointerMove"]): void => {
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

        if (result.hit && result.body) {
            const id = result.body.id as EntityId;
            if (this.hovered === id) return;
            if (this.hovered) {
                this.eventBus.emit("entityUnhovered", { entityId: this.hovered });
            }
            this.hovered = id;
            this.eventBus.emit("entityHovered", { entityId: id });
            return;
        }

        if (this.hovered) {
            this.eventBus.emit("entityUnhovered", { entityId: this.hovered });
            this.hovered = null;
        }
    };
}
