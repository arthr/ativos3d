# Pipeline de Validação

O pipeline de validação está implementado em `src/core/placement/` usando Chain of Responsibility.

### Implementação atual
- `types.ts`: `PlacementContext`, `PlacementValidator`, `ValidationResult`
- `validators.ts`: `BoundsValidator`, `ObjectsCollisionValidator`
- `pipeline.ts`: `createPlacementPipeline`, `createDefaultPlacementPipeline`
- `placement.ts`: façade que expõe `validatePlacement` delegando ao pipeline padrão

### Fluxo
1. BoundsValidator – impede que o footprint saia dos limites do lote
2. ObjectsCollisionValidator – verifica colisões AABB com objetos existentes

Para acelerar, usamos um índice espacial (Strategy) de AABBs (`src/core/spatial/`),
consultado em pre-check no preview (`PlaceStrategy`).

### Etapas planejadas
- Snap (grid, parede ou slot)
- Clearance (tiles livres)
- Requisitos: `needs_wall`, `door/window` em segmento de parede, `requires_slots`

O retorno do pipeline segue o formato `{ ok: boolean, reason?: string }`.

