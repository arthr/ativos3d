import { useEffect, useMemo, useState } from "react";
import type { EntityId } from "@core/types/ecs/EntityId";
import type { WallComponent as IWallComponent } from "@core/types/components/WallComponent";
import { useApplication } from "@presentation/hooks/useApplication";

/**
 * Hook que observa o EventBus e fornece a lista de paredes do domínio.
 */
export function useWalls(): { list: Array<{ entityId: EntityId; wall: IWallComponent }> } {
    const { eventBus, entityManager } = useApplication();
    const [wallsById, setWallsById] = useState<Map<EntityId, IWallComponent>>(new Map());

    useEffect(() => {
        // Hidrata estado inicial
        const entities = entityManager.getEntitiesWithComponent("WallComponent");
        const initial = new Map<EntityId, IWallComponent>();
        for (const entity of entities) {
            const wc = entity.getComponent<IWallComponent>("WallComponent");
            if (wc) initial.set(entity.id, wc);
        }
        setWallsById(initial);

        // Listeners
        const offAdded = eventBus.on("componentAdded", ({ entityId, component }) => {
            if (component.type === "WallComponent") {
                setWallsById((prev) => {
                    const next = new Map(prev);
                    next.set(entityId, component as IWallComponent);
                    return next;
                });
            }
        });
        const offRemoved = eventBus.on("componentRemoved", ({ entityId, componentType }) => {
            if (componentType === "WallComponent") {
                setWallsById((prev) => {
                    if (!prev.has(entityId)) return prev;
                    const next = new Map(prev);
                    next.delete(entityId);
                    return next;
                });
            }
        });
        const offDestroyed = eventBus.on("entityDestroyed", ({ entityId }) => {
            setWallsById((prev) => {
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
        const items: Array<{ entityId: EntityId; wall: IWallComponent }> = [];
        for (const [entityId, wall] of wallsById.entries()) {
            items.push({ entityId, wall });
        }
        return items;
    }, [wallsById]);

    return { list };
}

