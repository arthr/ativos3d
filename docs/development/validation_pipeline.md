### Implementação atual
- `ValidationSystem.ts` – coordena a execução sequencial dos validadores.
- `validators/BoundsValidator.ts` – `createBoundsValidator`.
- `validators/ObjectsCollisionValidator.ts` – `createObjectsCollisionValidator`.
- `validators/PlacementValidator.ts` – `createPlacementValidator` (compõe bounds e colisão).

### Validadores disponíveis
- `createBoundsValidator` — verifica se o footprint rotacionado permanece dentro dos limites do lote.
- `createObjectsCollisionValidator` — detecta colisões AABB com outras entidades existentes.
- `createPlacementValidator` — combina os validadores de limites e colisão para validar posicionamento.

### Funcionamento
1. O `ValidationSystem` escuta o evento `validationRequested`.
2. Quando acionado, monta o `ValidationContext` e executa cada `Validator` registrado.
3. O resultado é emitido via `validationCompleted` contendo `isValid`, `errors` e `warnings`.

### Etapas planejadas
- Snap (grid, parede ou slot)
- Clearance (tiles livres)
- Requisitos: `needs_wall`, `door/window` em segmento de parede, `requires_slots`

O resultado da validação segue o formato `{ isValid: boolean, errors: string[], warnings?: string[] }`.