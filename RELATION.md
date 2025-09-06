# Relação entre Documentações

## Visão Geral

* **Flowstates** (`docs/requirements/resources-flowstate/*.md`) → descrevem **comportamento/estado** das ferramentas
* **RESOURCES_MATRIX.md** (`docs/requirements/`) → **contrato testável** com critérios de aceitação
* **README.md** (resources-flowstate) → **tabela de cobertura** (Req → Flows)
* **CHECKLIST.md** (`docs/requirements/`) → **escopo** (o "o quê")

## Status Atual

✅ **Todos os flowstates agora possuem front-matter** seguindo o padrão:

```md
---
id: FLOW-[NOME]
title: [Título Descritivo]
relates_to: [REQ-001, REQ-002, ...]
status: draft
---
```

## Mapeamento Completo (arquivo → requisitos)

### Construção
* `walls-room-flowstate.md` → CON-020, CON-021, FB-080, VAL-090
* `doors-windows-flowstate.md` → CON-022, VAL-092, FB-080
* `stairs-flowstate.md` → CON-023, VAL-093, FB-081
* `platforms-flowstate.md` → CON-024, VAL-094, FB-081
* `finishes-floor-wall-flowstate.md` → CON-025, FB-081, CMD-100
* `bulldoze-flowstate.md` → CON-026

### Objetos & Interação
* `objects-place-flowstate.md` → OBJ-040..044, SNAP-070..073, VAL-090..091, FB-080
* `multi-selection-flowstate.md` → OBJ-046, SNAP-073, PERF-121
* `move-room-flowstate.md` → OBJ-047, VAL-090, VAL-091
* `inventory-flowstate.md` → OBJ-045, CAT-013

### Sistema & Snapping
* `snapping-slots-flowstate.md` → SNAP-070..073, VAL-095, ACC-141
* `feedback-overlay-flowstate.md` → FB-080..082, PERF-120, VIS-111, ACC-142, VAL-096

### Interface & Catálogo
* `modes-hud-flowstate.md` → GRP-001..002, HUD-003, CMD-100, VIS-110..111, PERF-121, ACC-140
* `catalog-search-flowstate.md` → CAT-010..012, HUD-003

### Ferramentas Rápidas
* `eyedropper-flowstate.md` → HUD-003, CAT-012, OBJ-040, CON-025
* `design-tool-flowstate.md` → HUD-003, CON-025, OBJ-040, FB-081
* `sledgehammer-flowstate.md` → HUD-003, PERF-121, VAL-090

### Persistência
* `persistance-save-load-flowstate.md` → PER-130, PERF-121
* `blueprints-library-flowstate.md` → PER-131, CAT-010, CAT-012
* `edit-history-flowstate.md` → PER-132, PERF-121

## Hierarquia de Precedência

Em caso de conflito entre documentações:

1. **/.cursor/.cursorrules** (regras do sistema)
2. **docs/requirements/RESOURCES_MATRIX.md** (contrato testável)
3. **README.md** (tabela de cobertura)
4. **docs/architecture/CONTEXT.md** (contexto do projeto)
5. **docs/architecture/REFAC.md** (plano de refatoração)
6. **Flowstates individuais** (implementação específica)
