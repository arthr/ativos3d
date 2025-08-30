import type { JSX } from "react";
import { useFloors } from "@presentation/hooks/useFloors";
import { FloorItem } from "./FloorItem";

/**
 * FloorLayer: renderiza pisos do domínio usando geometria box.
 * Usa position como centro e size como escala.
 */
export function FloorLayer({ color = "#cccccc" }: { readonly color?: string }): JSX.Element | null {
    const { list } = useFloors();

    if (list.length === 0) return null;

    return (
        <>
            {list.map(({ entityId, floor }) => (
                <FloorItem key={entityId} entityId={entityId} floor={floor} color={color} />
            ))}
        </>
    );
}

