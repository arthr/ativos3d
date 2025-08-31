import type { EntityId } from "@core/types/ecs/EntityId";
import type { WallComponent as IWallComponent } from "@core/types/components/WallComponent";
import { useMemo } from "react";
import { useComponentSubscription } from "./useComponentSubscription";

/**
 * Hook que observa o EventBus e fornece a lista de paredes do domínio.
 */
export function useWalls(): { list: Array<{ entityId: EntityId; wall: IWallComponent }> } {
    const wallsById = useComponentSubscription<IWallComponent>("WallComponent");

    const list = useMemo(() => {
        const items: Array<{ entityId: EntityId; wall: IWallComponent }> = [];
        for (const [entityId, wall] of wallsById.entries()) {
            items.push({ entityId, wall });
        }
        return items;
    }, [wallsById]);

    return { list };
}
