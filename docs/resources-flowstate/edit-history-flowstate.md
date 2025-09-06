---
id: FLOW-EDIT-HISTORY
title: Edit History & Sessions
relates_to: [PER-132, PERF-121]
status: draft
---

# Flowstate — Histórico de Edições

## Estados
1) Idle → 2) Timeline aberta → 3) Selecionar checkpoint → 4) Preview (diff) → 5) Restaurar → 6) Confirmar → 7) Commit

## Transições
- Abrir timeline → listar checkpoints (agrupados por ferramenta) → selecionar → diff visual → **Restaurar** → **Commit** (atomic).

## Ações/Feedback
- Metadados (autor, data, tamanho, notas).
- “Snapshot rápido” (criar ponto manual).
- Indicador de impacto (objetos N, §, revestimentos M).

## Guardas
- **Compatibilidade** de assets entre snapshots.
- **Espaço**/limite de checkpoints (rotações FIFO).
- **Atomicidade**: rollback completo; Undo/Redo do próprio restore.

## Atalhos
- Ctrl+H (abrir histórico), Ctrl+Shift+K (criar checkpoint).
