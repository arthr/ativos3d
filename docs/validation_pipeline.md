# Pipeline de Validação
1. Snap (grid, parede ou slot)
2. Colisão (footprint vs objetos)
3. Clearance (tiles livres)
4. Requisitos:
   - needs_wall
   - door/window em segmento de parede
   - requires_slots
5. Retorno { ok: boolean, reason?: string }