---
id: FLOW-PERSIST-SAVELOAD
title: Persistence — Save & Load
relates_to: [PER-130, PERF-121]
status: draft
---

# Flowstate — Save & Load

## Estados
1) Idle → 2) Abrir diálogo (Salvar/Carregar) → 3) Validação de integridade → 4) Confirmar → 5) Executar (atomic) → 6) Sucesso/Erro

## Transições (resumo)
- Abrir **Salvar**: snapshot dif/metadata → valida (versão, refs de assets) → Confirmar → **Commit** (arquivo + thumbs) → Sucesso.
- Abrir **Carregar**: listar slots/arquivos → preview → valida compatibilidade → Confirmar → **Commit** (swap de cena) → Sucesso.

## Ações/Feedback
- Mostrar metadados (autor, data, versão, tamanho, pacote).
- Barra de progresso; bloqueio de UI durante commit; um único passo de **Undo/Redo** pós-load (estado anterior).

## Guardas
- **Compatibilidade de versão** (migrator ou aviso).
- **Referências de assets** resolvidas (itens faltantes → substitutos).
- **Atomicidade**: escrever para temp e fazer swap.
- **Integridade**: hash/verificação; fallback em erro.

## Atalhos
- Ctrl+S (Salvar rápido), Ctrl+Shift+S (Salvar como), Ctrl+O (Carregar).
