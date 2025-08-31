import type { JSX } from "react";
import { useApplication } from "../hooks/useApplication";
import type { EntityId } from "@core/types/ecs/EntityId";
import type { FloorComponent as IFloorComponent } from "@core/types/components/FloorComponent";
import type { RenderComponent as IRenderComponent } from "@core/types/components/RenderComponent";

/**
 * Item responsável por renderizar um piso e emitir eventos de interação.
 */
export function FloorItem({
    entityId,
    floor,
    color,
}: {
    readonly entityId: EntityId;
    readonly floor: IFloorComponent;
    readonly color: string;
}): JSX.Element {
    const { eventBus, entityManager } = useApplication();

    const position: [number, number, number] = [
        floor.position.x,
        floor.position.y + floor.size.y / 2,
        floor.position.z,
    ];
    const scale: [number, number, number] = [floor.size.x, floor.size.y, floor.size.z];

    const rc = entityManager.getEntity(entityId)?.getComponent<IRenderComponent>("RenderComponent");
    const colorToUse = rc?.color ?? color;

    function handleDown(): void {
        eventBus.emit("entitySelected", { entityId });
    }
    function handleOver(): void {
        eventBus.emit("entityHovered", { entityId });
    }
    function handleOut(): void {
        eventBus.emit("entityUnhovered", { entityId });
    }

    return (
        <group position={position}>
            <mesh
                castShadow
                receiveShadow
                scale={scale}
                onPointerDown={handleDown}
                onPointerOver={handleOver}
                onPointerOut={handleOut}
            >
                <boxGeometry />
                <meshStandardMaterial color={colorToUse} roughness={0.8} metalness={0.0} />
            </mesh>
        </group>
    );
}
