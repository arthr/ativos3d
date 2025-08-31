import type { EntityId } from "@core/types/ecs/EntityId";
import type { FloorComponent as IFloorComponent } from "@core/types/components/FloorComponent";
import { useMemo } from "react";
import { useComponentSubscription } from "./useComponentSubscription";

/**
 * Hook que observa o EventBus e fornece a lista de pisos do domínio.
 */
export function useFloors(): { list: Array<{ entityId: EntityId; floor: IFloorComponent }> } {
    const floorsById = useComponentSubscription<IFloorComponent>("FloorComponent");

    const list = useMemo(() => {
        const items: Array<{ entityId: EntityId; floor: IFloorComponent }> = [];
        for (const [entityId, floor] of floorsById.entries()) {
            items.push({ entityId, floor });
        }
        return items;
    }, [floorsById]);

    return { list };
}
