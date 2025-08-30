import type { JSX } from "react";
import { useWalls } from "@presentation/hooks/useWalls";
import { WallItem } from "./WallItem";

/**
 * WallsLayer: renderiza paredes do domínio usando geometria box.
 * Orienta cada parede pelo vetor (end - start) no plano XZ.
 */
export function WallsLayer({ thickness = 0.12, color = "#b8b8b8" }: {
    readonly thickness?: number;
    readonly color?: string;
}): JSX.Element | null {
    const { list } = useWalls();

    if (list.length === 0) return null;

    return (
        <>
            {list.map(({ entityId, wall }) => (
                <WallItem
                    key={entityId}
                    entityId={entityId}
                    wall={wall}
                    thickness={thickness}
                    color={color}
                />
            ))}
        </>
    );
}

