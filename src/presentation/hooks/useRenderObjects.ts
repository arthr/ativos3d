import type { EntityId } from "@core/types/ecs/EntityId";
import type { RenderComponent as IRenderComponent } from "@core/types/components/RenderComponent";
import type { TransformComponent as ITransformComponent } from "@core/types/components/TransformComponent";
import { useMemo } from "react";
import { useComponentSubscription } from "./useComponentSubscription";

/**
 * Hook que observa o EventBus e fornece uma visão R3F dos objetos renderizáveis.
 * Mantém um mapa de `entityId -> { render, transform }` e expõe uma lista ordenada.
 */
export function useRenderObjects(): {
    list: Array<{ entityId: EntityId; render: IRenderComponent; transform?: ITransformComponent }>;
} {
    const renderById = useComponentSubscription<IRenderComponent>("RenderComponent");
    const transformById = useComponentSubscription<ITransformComponent>("TransformComponent");

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
