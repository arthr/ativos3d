# Pipeline de Validação

O pipeline de validação é composto por uma sequência de validadores que
garantem se um item pode ser colocado no lote. O `createDefaultPlacementPipeline`
atualmente encadeia os seguintes validadores:

1. **BoundsValidator** – impede que o *footprint* do item fique fora dos
   limites do lote.
2. **ObjectsCollisionValidator** – verifica colisões com outros objetos já
   posicionados.

### Etapas planejadas

As etapas abaixo ainda não estão implementadas e serão adicionadas no futuro:

- Snap (grid, parede ou slot)
- Clearance (tiles livres)
- Requisitos:
  - needs_wall
  - door/window em segmento de parede
  - requires_slots

O retorno do pipeline segue o formato `{ ok: boolean, reason?: string }`.

