import type { JSX } from "react";
import { useApplication } from "@presentation/hooks/useApplication";
import type { EntityId } from "@core/types/ecs/EntityId";
import type { WallComponent as IWallComponent } from "@core/types/components/WallComponent";
import type { RenderComponent as IRenderComponent } from "@core/types/components/RenderComponent";

/**
 * Item responsável por renderizar uma parede e emitir eventos de interação.
 */
export function WallItem({
    entityId,
    wall,
    thickness,
    color,
}: {
    readonly entityId: EntityId;
    readonly wall: IWallComponent;
    readonly thickness: number;
    readonly color: string;
}): JSX.Element {
    const { eventBus, entityManager } = useApplication();

    const dx = wall.end.x - wall.start.x;
    const dz = wall.end.z - wall.start.z;
    const length = Math.sqrt(dx * dx + dz * dz) || 0.0001;
    const yaw = Math.atan2(dz, dx);
    const center: [number, number, number] = [
        (wall.start.x + wall.end.x) / 2,
        (wall.start.y + wall.end.y) / 2 + wall.height / 2,
        (wall.start.z + wall.end.z) / 2,
    ];
    const rotation: [number, number, number] = [0, yaw, 0];
    const t = wall.thickness ?? thickness;
    const scale: [number, number, number] = [length, wall.height, t];

    const rc = entityManager
        .getEntity(entityId)
        ?.getComponent<IRenderComponent>("RenderComponent");
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
        <group position={center} rotation={rotation}>
            <mesh
                castShadow
                receiveShadow
                scale={scale}
                onPointerDown={handleDown}
                onPointerOver={handleOver}
                onPointerOut={handleOut}
            >
                <boxGeometry />
                <meshStandardMaterial color={colorToUse} roughness={0.9} metalness={0.0} />
            </mesh>
        </group>
    );
}

