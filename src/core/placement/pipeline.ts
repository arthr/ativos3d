import type { PlacementContext, PlacementValidator, ValidationResult } from "./types";
import { BoundsValidator, ObjectsCollisionValidator } from "./validators";

export function createPlacementPipeline(validators: PlacementValidator[]) {
  return (ctx: PlacementContext): ValidationResult => {
    for (const v of validators) {
      const res = v.validate(ctx);
      if (!res.ok) return res;
    }
    return { ok: true };
  };
}

export function createDefaultPlacementPipeline() {
  return createPlacementPipeline([new BoundsValidator(), new ObjectsCollisionValidator()]);
}
