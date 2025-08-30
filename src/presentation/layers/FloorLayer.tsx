import type { JSX } from "react";
import { useCallback } from "react";
import { useFloors } from "@presentation/hooks/useFloors";
import { useApplication } from "@presentation/hooks/useApplication";
import type { RenderComponent as IRenderComponent } from "@core/types/components/RenderComponent";

/**
 * FloorLayer: renderiza pisos do domínio usando geometria box.
 * - Usa position como centro e size como escala.
 * - Material/Cor: tenta ler do RenderComponent da mesma entidade; fallback para `#cccccc`.
 */
export function FloorLayer({ color = "#cccccc" }: { readonly color?: string }): JSX.Element | null {
    const { list } = useFloors();
    const { eventBus, entityManager } = useApplication();

    if (list.length === 0) return null;

    return (
        <>
            {list.map(({ entityId, floor }) => {
                // Anchor vertical na base: centerY = position.y + size.y/2
                const position: [number, number, number] = [
                    floor.position.x,
                    floor.position.y + floor.size.y / 2,
                    floor.position.z,
                ];
                const scale: [number, number, number] = [
                    floor.size.x,
                    floor.size.y,
                    floor.size.z,
                ];

                // Tenta obter cor/material do RenderComponent
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
                    <group key={entityId} position={position}>
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
            })}
        </>
    );
}
