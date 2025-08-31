import type { EntityId } from "@core/types/ecs/EntityId";
import type { Component } from "@core/types/ecs/Component";
import { useEffect, useState } from "react";
import { useApplication } from "./useApplication";

/**
 * Hook que mantém um mapa de componentes sincronizados com o EntityManager.
 */
export function useComponentSubscription<T extends Component>(
    componentType: string,
): Map<EntityId, T> {
    const { eventBus, entityManager } = useApplication();
    const [componentsById, setComponentsById] = useState<Map<EntityId, T>>(new Map());

    useEffect(() => {
        const entities = entityManager.getEntitiesWithComponent(componentType);
        const initial = new Map<EntityId, T>();

        for (const entity of entities) {
            const component = entity.getComponent<T>(componentType);
            if (component) initial.set(entity.id, component);
        }

        setComponentsById(initial);

        const offAdded = eventBus.on("componentAdded", ({ entityId, component }) => {
            if (component.type === componentType) {
                setComponentsById((prev) => {
                    const next = new Map(prev);
                    next.set(entityId, component as T);
                    return next;
                });
            }
        });

        const offUpdated = eventBus.on("componentUpdated", ({ entityId, component }) => {
            if (component.type === componentType) {
                setComponentsById((prev) => {
                    const next = new Map(prev);
                    next.set(entityId, component as T);
                    return next;
                });
            }
        });

        const offRemoved = eventBus.on(
            "componentRemoved",
            ({ entityId, componentType: removed }) => {
                if (removed === componentType) {
                    setComponentsById((prev) => {
                        if (!prev.has(entityId)) return prev;
                        const next = new Map(prev);
                        next.delete(entityId);
                        return next;
                    });
                }
            },
        );

        const offDestroyed = eventBus.on("entityDestroyed", ({ entityId }) => {
            setComponentsById((prev) => {
                if (!prev.has(entityId)) return prev;
                const next = new Map(prev);
                next.delete(entityId);
                return next;
            });
        });

        return (): void => {
            offAdded();
            offUpdated();
            offRemoved();
            offDestroyed();
        };
    }, [componentType, eventBus, entityManager]);

    return componentsById;
}
