import type { JSX } from "react";
import { useCallback } from "react";
import { useWalls } from "@presentation/hooks/useWalls";
import { useApplication } from "@presentation/hooks/useApplication";
import type { RenderComponent as IRenderComponent } from "@core/types/components/RenderComponent";

/**
 * WallsLayer: renderiza paredes do domínio usando geometria box.
 * - Orienta cada parede pelo vetor (end - start) no plano XZ.
 * - Altura mapeada para escala Y; posição central ajustada para base no piso.
 */
export function WallsLayer({ thickness = 0.12, color = "#b8b8b8" }: {
    readonly thickness?: number;
    readonly color?: string;
}): JSX.Element | null {
    const { list } = useWalls();
    const { eventBus, entityManager } = useApplication();

    if (list.length === 0) return null;

    return (
        <>
            {list.map(({ entityId, wall }) => {
                const dx = wall.end.x - wall.start.x;
                const dz = wall.end.z - wall.start.z;
                const length = Math.sqrt(dx * dx + dz * dz) || 0.0001;
                const yaw = Math.atan2(dz, dx);
                const center = [
                    (wall.start.x + wall.end.x) / 2,
                    (wall.start.y + wall.end.y) / 2 + wall.height / 2,
                    (wall.start.z + wall.end.z) / 2,
                ] as const;

                const rotation: [number, number, number] = [0, yaw, 0];
                const t = wall.thickness ?? thickness;
                const scale: [number, number, number] = [length, wall.height, t];

                // Tenta obter cor do RenderComponent da mesma entidade
                const rc = entityManager
                    .getEntity(entityId)
                    ?.getComponent<IRenderComponent>("RenderComponent");
                const colorToUse = rc?.color ?? color;

                const handleDown = useCallback(() => {
                    eventBus.emit("entitySelected", { entityId });
                }, [eventBus, entityId]);
                const handleOver = useCallback(() => {
                    eventBus.emit("entityHovered", { entityId });
                }, [eventBus, entityId]);
                const handleOut = useCallback(() => {
                    eventBus.emit("entityUnhovered", { entityId });
                }, [eventBus, entityId]);

                return (
                    <group key={entityId} position={[center[0], center[1], center[2]]} rotation={rotation}>
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
            })}
        </>
    );
}
