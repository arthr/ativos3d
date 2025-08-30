import { useEffect, useMemo, useState } from "react";
import type { EntityId } from "@core/types/ecs/EntityId";
import type { FloorComponent as IFloorComponent } from "@core/types/components/FloorComponent";
import { useApplication } from "@presentation/hooks/useApplication";

/**
 * Hook que observa o EventBus e fornece a lista de pisos do domínio.
 */
export function useFloors(): { list: Array<{ entityId: EntityId; floor: IFloorComponent }> } {
    const { eventBus, entityManager } = useApplication();
    const [floorsById, setFloorsById] = useState<Map<EntityId, IFloorComponent>>(new Map());

    useEffect(() => {
        // Hidrata estado inicial
        const entities = entityManager.getEntitiesWithComponent("FloorComponent");
        const initial = new Map<EntityId, IFloorComponent>();
        for (const entity of entities) {
            const fc = entity.getComponent<IFloorComponent>("FloorComponent");
            if (fc) initial.set(entity.id, fc);
        }
        setFloorsById(initial);

        // Listeners
        const offAdded = eventBus.on("componentAdded", ({ entityId, component }) => {
            if (component.type === "FloorComponent") {
                setFloorsById((prev) => {
                    const next = new Map(prev);
                    next.set(entityId, component as IFloorComponent);
                    return next;
                });
            }
        });
        const offRemoved = eventBus.on("componentRemoved", ({ entityId, componentType }) => {
            if (componentType === "FloorComponent") {
                setFloorsById((prev) => {
                    if (!prev.has(entityId)) return prev;
                    const next = new Map(prev);
                    next.delete(entityId);
                    return next;
                });
            }
        });
        const offDestroyed = eventBus.on("entityDestroyed", ({ entityId }) => {
            setFloorsById((prev) => {
                if (!prev.has(entityId)) return prev;
                const next = new Map(prev);
                next.delete(entityId);
                return next;
            });
        });

        return () => {
            offAdded();
            offRemoved();
            offDestroyed();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [eventBus, entityManager]);

    const list = useMemo(() => {
        const items: Array<{ entityId: EntityId; floor: IFloorComponent }> = [];
        for (const [entityId, floor] of floorsById.entries()) {
            items.push({ entityId, floor });
        }
        return items;
    }, [floorsById]);

    return { list };
}

