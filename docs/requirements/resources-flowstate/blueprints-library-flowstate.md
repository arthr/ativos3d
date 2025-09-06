---
id: FLOW-BLUEPRINTS
title: Blueprints & Library/Favorites
relates_to: [PER-131, CAT-010, CAT-012]
status: draft
---

# Flowstate — Blueprints & Biblioteca

## Estados
1) Idle → 2) Abrir Biblioteca/Blueprints → 3) Selecionar item → 4) Ghost do blueprint → 5) Válido/Inválido → 6) Aplicar → 7) Salvar como Blueprint

## Transições
- **Aplicar blueprint**: escolher → **Ghost** (sala/módulo) → valida (colisão, alturas, portas) → **Commit**.
- **Salvar como blueprint**: selecionar sala/multiseleção → nomear/tags/thumbnail → **Commit**.

## Ações/Feedback
- Filtros por tags/departamentos; previews com mini-mapas.
- Opções: rotacionar/espelhar; incluir/excluir portas/revestimentos.

## Guardas
- **Compatibilidade** (pé-direito, slots, assets).
- **Dependências** (objetos sobre superfícies).
- **Cotas**: tamanho máx. de blueprint; políticas de compartilhamento.

## Atalhos
- B (abrir Biblioteca/Blueprints); R/E para rotacionar/espelhar durante Ghost.
