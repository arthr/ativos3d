---
id: FLOW-MOVE-ROOM
title: Move Room Module
relates_to: [OBJ-047, VAL-090, VAL-091]
status: draft
---

# Fluxo de estados — Ferramenta: Mover Sala

**Estados**

1. Idle → 2) Seleção da Sala → 3) Ghost (sala “na mão”) → 4) Válido / 5) Inválido → 6) Aplicar (Commit) → 7) Ajuste Fino (girar/posicionar) → 8) Concluir / 9) Cancelar

**Eventos & Transições**

* Ativar ferramenta → **Idle**
* Click sobre contorno/área da sala → **Seleção da Sala** (destaca paredes/portas/janelas/itens incluídos)
* MouseDown e arrastar / teclas de rotação → **Ghost** (move o módulo inteiro) → valida continuamente → **Válido/Inválido**
* Enter/Click em **Válido** → **Aplicar (Commit)** (reposiciona tudo em lote)
* Após Commit: pequenos ajustes (nudge/rotação fina) → **Ajuste Fino**
* Esc/RightClick em qualquer etapa com mudanças pendentes → **Cancelar** (reverte)
* Undo/Redo: desfaz/refaz o Commit inteiro (geometria, aberturas, objetos, custos/estoque se houver)

**Ações por estado**

* **Seleção da Sala**: mostra bounding box, área (m²/azulejos), lista de elementos inclusos (paredes, portas/janelas, objetos, plataformas).
* **Ghost**: preview translúcido com guias de alinhamento a paredes, eixos e outras salas; mostra deltas (Δx/Δy/rotação).
* **Ajuste Fino**: gizmos para rotação (15°/45° e fino), nudge por setas, snap em 1/½/¼ de azulejo.

**Guardas / Validações (chave)**

* **Colisão**: perímetro da sala e seus objetos não podem invadir paredes externas, outras salas, escadas, colunas.
* **Conectividade**: portas mantêm conexão com salas/vãos; se destino não tem parede compatível para a porta, bloquear ou oferecer “remover porta”.
* **Aberturas**: janelas/portas preservam alturas (B/M/A) e afastamentos; proibir corte em quina/coluna.
* **Plataformas**: níveis internos movem juntos; validar bordas livres e degraus obrigatórios após o deslocamento.
* **Routing**: manter caminhos críticos (acesso a portas/escadas); se bloquear, marcar **Inválido** com motivo.
* **Snaps**: alinhar a grid, a paredes existentes e centros; **Alt** permite posição livre (se permitido).
* **Orçamento/Estoque**: mover **não** debita; apenas mudanças estruturais (ex.: remoção de porta por incompatibilidade) ajustam fundos/estoque com confirmação.

**Snapping & Controles**

* **Grid** 1/½/¼; **Alt** desliga snap temporariamente.
* **R / Scroll**: rotaciona sala (Shift = passo fino).
* **Setas**: nudge (1 unidade de grid).
* **G**: alternar preservação de alinhamento de portas com corredores existentes.
* **Enter** confirma; **Esc/RightClick** cancela.

**Mensagens comuns**

* “Colisão com \<parede/escada/objeto> ao longo da borda norte.”
* “Porta X perderia apoio de parede no destino.”
* “Caminho até a saída foi bloqueado.”
* “Diferença de altura exige degraus na borda leste.”
