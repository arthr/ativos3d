import * as THREE from "three";
import { catalog } from "../../../../core/catalog";
import { withBudget } from "../../../../core/budget";
import { executeCommand } from "../../../../core/commandStack";
import { useStore } from "../../../../store/useStore";
import { CatalogItem3D } from "../../../../core/types";

export function createPlaceCommand(defId: string, pos: THREE.Vector3, yaw: 0 | 90 | 180 | 270) {
  const id = crypto.randomUUID();
  const cmd = {
    description: "place-object",
    execute: () =>
      useStore.setState((s) => ({
        objects: [
          ...s.objects,
          {
            id,
            defId,
            pos: { x: pos.x, y: 0, z: pos.z },
            rot: { x: 0, y: yaw, z: 0 },
          },
        ],
      })),
    undo: () => useStore.setState((s) => ({ objects: s.objects.filter((o) => o.id !== id) })),
  };
  const price = (catalog as unknown as CatalogItem3D[]).find((i) => i.id === defId)?.price ?? 0;
  const decorated = withBudget(cmd, price);
  executeCommand(decorated, useStore.getState().pushCommand);
}
