# Comparação de Funcionalidades

Este documento resume as funcionalidades do legado e indica o status de port para a nova base descrita no README principal.

Funcionalidades marcadas com `[x]` já possuem correspondência no novo README. As marcadas com `[ ]` ainda não foram portadas ou documentadas.

## Ferramentas
- [ ] place
- [ ] move
- [ ] wall
- [ ] floor
- [ ] bulldoze
- [ ] eyedropper

## HUD e Interface
- [ ] Topbar
- [ ] BudgetBar
- [ ] Toolbar
- [ ] Catálogo
- [ ] Inspector flutuante

## Arquivos
- [ ] Exportar lote em JSON
- [ ] Importar lote em JSON
- [ ] Exportar thumbnail do Canvas

## Validação e Orçamento
- [ ] Pipeline de validação (bounds/colisão)
- [ ] Verificação de orçamento via decorator
- [ ] Toasts globais de feedback

## Controles e Interação
- [x] Modos de câmera perspectiva/ortográfica
- [x] Pan, rotação e zoom
- [ ] Interações específicas de ferramentas (R para rotacionar, ESC para cancelar)

## Undo/Redo
- [x] Histórico de ações com Command Pattern

## Renderização
- [x] Camadas de cena (Grid, Walls, Floor, Objects, Gizmo, Camera, Controls)
- [ ] Instancing para otimização

## Catálogo e Serialização
- [ ] Catálogo validado com Zod
- [ ] Exportação/importação versionada de lotes
