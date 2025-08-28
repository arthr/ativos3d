import { useEffect, useMemo, useState } from "react";
import type { EntityId } from "@core/types/ecs/EntityId";
import type { RenderComponent as IRenderComponent } from "@core/types/components/RenderComponent";
import type { TransformComponent as ITransformComponent } from "@core/types/components/TransformComponent";
import { useApplication } from "@presentation/hooks/useApplication";

/**
 * Hook que observa o EventBus e fornece uma visão R3F dos objetos renderizáveis.
 * Mantém um mapa de `entityId -> { render, transform }` e expõe uma lista ordenada.
 */
export function useRenderObjects(): {
    list: Array<{ entityId: EntityId; render: IRenderComponent; transform?: ITransformComponent }>;
} {
    const { eventBus, entityManager } = useApplication();
    const [renderById, setRenderById] = useState<Map<EntityId, IRenderComponent>>(new Map());
    const [transformById, setTransformById] = useState<Map<EntityId, ITransformComponent>>(new Map());

    useEffect(() => {
        // Hidrata estado inicial com entidades que possuem RenderComponent
        const entities = entityManager.getEntitiesWithComponent("RenderComponent");
        const initialRender = new Map<EntityId, IRenderComponent>();
        const initialTransform = new Map<EntityId, ITransformComponent>();
        for (const entity of entities) {
            const rc = entity.getComponent<IRenderComponent>("RenderComponent");
            if (rc) initialRender.set(entity.id, rc);
            const tc = entity.getComponent<ITransformComponent>("TransformComponent");
            if (tc) initialTransform.set(entity.id, tc);
        }
        setRenderById(initialRender);
        setTransformById(initialTransform);

        // Inscreve listeners para manter o estado sincronizado
        const offAdded = eventBus.on("componentAdded", ({ entityId, component }) => {
            if (component.type === "RenderComponent") {
                setRenderById((prev) => {
                    const next = new Map(prev);
                    next.set(entityId, component as IRenderComponent);
                    return next;
                });
                return;
            }
            if (component.type === "TransformComponent") {
                setTransformById((prev) => {
                    const next = new Map(prev);
                    next.set(entityId, component as ITransformComponent);
                    return next;
                });
            }
        });

        const offRemoved = eventBus.on("componentRemoved", ({ entityId, componentType }) => {
            if (componentType === "RenderComponent") {
                setRenderById((prev) => {
                    if (!prev.has(entityId)) return prev;
                    const next = new Map(prev);
                    next.delete(entityId);
                    return next;
                });
                return;
            }
            if (componentType === "TransformComponent") {
                setTransformById((prev) => {
                    if (!prev.has(entityId)) return prev;
                    const next = new Map(prev);
                    next.delete(entityId);
                    return next;
                });
            }
        });

        const offDestroyed = eventBus.on("entityDestroyed", ({ entityId }) => {
            setRenderById((prev) => {
                if (!prev.has(entityId)) return prev;
                const next = new Map(prev);
                next.delete(entityId);
                return next;
            });
            setTransformById((prev) => {
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
        // entityManager não muda em runtime; eventBus tem cleanup
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [eventBus, entityManager]);

    const list = useMemo(() => {
        const items: Array<{
            entityId: EntityId;
            render: IRenderComponent;
            transform?: ITransformComponent;
        }> = [];
        for (const [entityId, render] of renderById.entries()) {
            items.push({ entityId, render, transform: transformById.get(entityId) });
        }
        return items;
    }, [renderById, transformById]);

    return { list };
}

