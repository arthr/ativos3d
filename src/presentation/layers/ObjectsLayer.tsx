import type { JSX } from "react";
import { useRenderObjects } from "@presentation/hooks/useRenderObjects";
import { ObjectItem } from "./ObjectItem";

/**
 * ObjectsLayer: materializa RenderComponents do domínio em nós R3F.
 * Usa TransformComponent se disponível para posição/rotação/escala.
 */
export function ObjectsLayer(): JSX.Element {
    const { list } = useRenderObjects();

    return (
        <>
            {list.map(({ entityId, render, transform }) => (
                <ObjectItem
                    key={entityId}
                    entityId={entityId}
                    render={render}
                    transform={transform}
                />
            ))}
        </>
    );
}

