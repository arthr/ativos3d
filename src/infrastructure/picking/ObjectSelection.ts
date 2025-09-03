import { Raycaster, Vector2 } from "three";
import type { Camera } from "three";
import { CollisionFactory, CollisionDetection, Vec3Factory } from "@core/geometry";
import type { EntityId } from "@core/types/ecs/EntityId";
import type { ObjectSelectionDependencies, ObjectSelectionProvider } from "@core/types/picking";
import type { InputEvents } from "@core/types/events/InputEvents";
import type { Unsubscribe } from "@core/types/Events";

/**
 * Sistema de seleção de objetos baseado em raycasting
 */
export class ObjectSelection implements ObjectSelectionProvider {
    private readonly eventBus: ObjectSelectionDependencies["eventBus"];
    private readonly cameraSystem: ObjectSelectionDependencies["cameraSystem"];
    private readonly getCollisionBodies: ObjectSelectionDependencies["getCollisionBodies"];
    private readonly raycaster = new Raycaster();
    private readonly selected = new Set<EntityId>();
    private readonly unsubscribe: Unsubscribe;

    constructor(private readonly dependencies: ObjectSelectionDependencies) {
        this.eventBus = dependencies.eventBus;
        this.cameraSystem = dependencies.cameraSystem;
        this.getCollisionBodies = dependencies.getCollisionBodies;
        this.unsubscribe = this.eventBus.on("pointerDown", this.handlePointerDown);
    }

    /** Retorna os IDs atualmente selecionados */
    getSelected(): EntityId[] {
        return Array.from(this.selected);
    }

    /** Remove listener registrado */
    dispose(): void {
        this.unsubscribe();
    }

    /** Processa eventos de ponteiro para realizar seleção */
    private handlePointerDown = ({ ndc, button, hudTarget }: InputEvents["pointerDown"]): void => {
        if (button !== 0 || hudTarget) return;

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
            this.select(result.body.id as EntityId);
            return;
        }

        this.clear();
    };

    /** Seleciona uma entidade e emite eventos */
    private select(id: EntityId): void {
        if (this.selected.has(id) && this.selected.size === 1) return;

        if (this.selected.size > 0) {
            const prev = Array.from(this.selected);
            this.selected.clear();
            prev.forEach((pid) => this.eventBus.emit("entityDeselected", { entityId: pid }));
        }

        this.selected.add(id);
        this.eventBus.emit("entitySelected", { entityId: id });
        this.eventBus.emit("selectionChanged", { selectedIds: Array.from(this.selected) });
    }

    /** Limpa seleção atual e emite eventos */
    private clear(): void {
        if (this.selected.size === 0) return;
        const prev = Array.from(this.selected);
        this.selected.clear();
        prev.forEach((pid) => this.eventBus.emit("entityDeselected", { entityId: pid }));
        this.eventBus.emit("selectionChanged", { selectedIds: [] });
    }
}
