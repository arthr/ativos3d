# Tabela de cobertura (Req → Flows) 

| Req ID  | Requisito (resumo)                                   | Flows |
|---------|-------------------------------------------------------|-------|
| GRP-001 | Modos Build/Buy/Seleção                               | [modes-hud-flowstate.md](./modes-hud-flowstate.md) |
| GRP-002 | Andares e visibilidade de paredes                     | [modes-hud-flowstate.md](./modes-hud-flowstate.md) |
| HUD-003 | HUD global (Undo/Redo, eyedropper, marreta, etc.)     | [modes-hud-flowstate.md](./modes-hud-flowstate.md), [eyedropper-flowstate.md](./eyedropper-flowstate.md), [sledgehammer-flowstate.md](./sledgehammer-flowstate.md), [design-tool-flowstate.md](./design-tool-flowstate.md), [catalog-search-flowstate.md](./catalog-search-flowstate.md) |
| CAT-010 | Catálogo: Depto/Categoria/Coleções                    | [catalog-search-flowstate.md](./catalog-search-flowstate.md) |
| CAT-011 | Filtros (preço/categoria/disponibilidade/tags)        | [catalog-search-flowstate.md](./catalog-search-flowstate.md) |
| CAT-012 | Ficha do item (preço/qtd/footprint/requisitos)        | [catalog-search-flowstate.md](./catalog-search-flowstate.md) |
| CAT-013 | Sincronismo de estoque/fundos                         | [inventory-flowstate.md](./inventory-flowstate.md), [objects-place-flowstate.md](./objects-place-flowstate.md) |
| CON-020 | Paredes/Sala                                          | [walls-room-flowstate.md](./walls-room-flowstate.md) |
| CON-021 | Meias-paredes e arcos                                 | [walls-room-flowstate.md](./walls-room-flowstate.md) |
| CON-022 | Portas/Janelas (B/M/A, centralização, dobradiça)      | [doors-windows-flowstate.md](./doors-windows-flowstate.md) |
| CON-023 | Escadas (reta/L/U + corte de piso)                    | [stairs-flowstate.md](./stairs-flowstate.md) |
| CON-024 | Plataformas internas                                  | [platforms-flowstate.md](./platforms-flowstate.md) |
| CON-025 | Revestimentos (pisos & paredes)                       | [finishes-floor-wall-flowstate.md](./finishes-floor-wall-flowstate.md), [design-tool-flowstate.md](./design-tool-flowstate.md) |
| CON-026 | Bulldoze (Sala/Andar/Lote)                            | [bulldoze-flowstate.md](./bulldoze-flowstate.md) |
| OBJ-040 | Mover/Rotacionar                                      | [objects-place-flowstate.md](./objects-place-flowstate.md) |
| OBJ-041 | Grade 1/½/¼ e livre (Alt)                             | [snapping-slots-flowstate.md](./snapping-slots-flowstate.md), [objects-place-flowstate.md](./objects-place-flowstate.md) |
| OBJ-042 | Altura em parede                                      | [objects-place-flowstate.md](./objects-place-flowstate.md) |
| OBJ-043 | Escala (decorativos)                                  | [objects-place-flowstate.md](./objects-place-flowstate.md) |
| OBJ-044 | Multiposição                                          | [objects-place-flowstate.md](./objects-place-flowstate.md) |
| OBJ-045 | Inventário da empresa                                 | [inventory-flowstate.md](./inventory-flowstate.md) |
| OBJ-046 | Multi-seleção/duplicar/vender                          | [multi-selection-flowstate.md](./multi-selection-flowstate.md) |
| OBJ-047 | Mover sala (módulo)                                   | [move-room-flowstate.md](./move-room-flowstate.md) |
| SNAP-070| Snaps contextuais                                     | [snapping-slots-flowstate.md](./snapping-slots-flowstate.md), [objects-place-flowstate.md](./objects-place-flowstate.md) |
| SNAP-071| Slots de superfície + ordem (M)                        | [snapping-slots-flowstate.md](./snapping-slots-flowstate.md) |
| SNAP-072| Snaps em parede                                       | [snapping-slots-flowstate.md](./snapping-slots-flowstate.md) |
| SNAP-073| Alinhamento/equidistância                             | [snapping-slots-flowstate.md](./snapping-slots-flowstate.md), [multi-selection-flowstate.md](./multi-selection-flowstate.md) |
| FB-080  | Estados: Idle/Hover/Ghost/Válido/Inválido/Selecionado | [feedback-overlay-flowstate.md](./feedback-overlay-flowstate.md) |
| FB-081  | Gizmos (paredes/escadas/plataformas)                  | [feedback-overlay-flowstate.md](./feedback-overlay-flowstate.md), [walls-room-flowstate.md](./walls-room-flowstate.md), [stairs-flowstate.md](./stairs-flowstate.md), [platforms-flowstate.md](./platforms-flowstate.md) |
| FB-082  | Custo & disponibilidade em tempo real                 | [feedback-overlay-flowstate.md](./feedback-overlay-flowstate.md) |
| VAL-090 | Footprint/colisão                                     | [objects-place-flowstate.md](./objects-place-flowstate.md), [snapping-slots-flowstate.md](./snapping-slots-flowstate.md) |
| VAL-091 | Acessos (routing)                                     | [objects-place-flowstate.md](./objects-place-flowstate.md) |
| VAL-092 | Portas/Janelas — validações                           | [doors-windows-flowstate.md](./doors-windows-flowstate.md) |
| VAL-093 | Escadas — validações                                  | [stairs-flowstate.md](./stairs-flowstate.md) |
| VAL-094 | Plataformas — validações                               | [platforms-flowstate.md](./platforms-flowstate.md) |
| VAL-095 | Superfícies/slots — validações                         | [snapping-slots-flowstate.md](./snapping-slots-flowstate.md) |
| VAL-096 | Sobreposição forçada (debug)                           | [feedback-overlay-flowstate.md](./feedback-overlay-flowstate.md) |
| CMD-100 | Atalhos por sala (Shift/Ctrl/Alt/F5)                  | [modes-hud-flowstate.md](./modes-hud-flowstate.md), [finishes-floor-wall-flowstate.md](./finishes-floor-wall-flowstate.md), [objects-place-flowstate.md](./objects-place-flowstate.md) |
| VIS-110 | Paredes/camadas/hora do dia                           | [modes-hud-flowstate.md](./modes-hud-flowstate.md), [feedback-overlay-flowstate.md](./feedback-overlay-flowstate.md) |
| VIS-111 | Indicadores/medidas/alinhamento                       | [feedback-overlay-flowstate.md](./feedback-overlay-flowstate.md), [snapping-slots-flowstate.md](./snapping-slots-flowstate.md) |
| PERF-120| Picking & culling                                     | [feedback-overlay-flowstate.md](./feedback-overlay-flowstate.md), [snapping-slots-flowstate.md](./snapping-slots-flowstate.md) |
| PERF-121| Undo/Redo transacional                                | [modes-hud-flowstate.md](./modes-hud-flowstate.md) |
| PER-130 | Salvar/Carregar | [persistence-save-load-flowstate.md](./persistence-save-load-flowstate.md) |
| PER-131 | Blueprints & Biblioteca/Favoritos | [blueprints-library-flowstate.md](./blueprints-library-flowstate.md) |
| PER-132 | Histórico de edições (sessões) | [edit-history-flowstate.md](./edit-history-flowstate.md) |
| ACC-140 | Tooltips/atalhos no HUD                               | [modes-hud-flowstate.md](./modes-hud-flowstate.md), [feedback-overlay-flowstate.md](./feedback-overlay-flowstate.md) |
| ACC-141 | Snaps assistidos (inibir)                             | [snapping-slots-flowstate.md](./snapping-slots-flowstate.md) |
| ACC-142 | Mensagens de conflito claras                          | [feedback-overlay-flowstate.md](./feedback-overlay-flowstate.md) |
