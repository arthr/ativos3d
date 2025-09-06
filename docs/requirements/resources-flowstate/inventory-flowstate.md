---
id: FLOW-INVENTORY
title: Company Inventory Management
relates_to: [OBJ-045, CAT-013]
status: draft
---

# Fluxo de estados — Ferramenta: Inventário da empresa

**Estados**

1. Idle → 2) Painel do Inventário (aberto) → 3) Enviar ao Inventário (seleção → stack) → 4) Seleção no Inventário → 5) Ghost (retirada p/ cena) → 6) Válido / 7) Inválido → 8) Aplicar (Commit) → 9) Ações em Lote (mover/vender/descartar) → 10) Concluir / 11) Cancelar

**Eventos & Transições**

* Abrir painel (HUD/tecla) → **Painel do Inventário** (lista por SKU/swatch).
* Selecionar objeto na cena + **Backspace** → **Enviar ao Inventário** (empilha por SKU+variante; preserva estado/swatch).
* Click em item do painel → **Seleção no Inventário** (mostra quantidade e variações).
* Drag/Click-to-place do painel → **Ghost** (reserva 1 unid.) → valida contínuo → **Válido/Inválido**.
* Confirmar em **Válido** → **Aplicar (Commit)** (baixa 1 do estoque; coloca na cena).
* **Shift** após Commit → **repetição** consumindo unidades até acabar/Cancelar.
* Seleção múltipla no painel → **Ações em Lote**: mover para coleção, **Vender** ao caixa, **Descartar** (se sem valor), **Exportar** lista.
* **Esc/RightClick** em qualquer etapa com pendências → **Cancelar** (solta reserva/ghost).
* Undo/Redo: reverte/aplica envio, retirada e venda **atomicamente** (fundos/quantidades).

**Ações por estado**

* **Painel**: busca, filtros (categoria, departamento, tag, disponibilidade), ordenação (nome, preço, qtd). Thumbnails com badge de **quantidade** e **swatches** colapsados.
* **Enviar ao Inventário**: remove da cena, cria/atualiza stack; registra log (quem/quando).
* **Seleção no Inventário**: mostra ficha (SKU, swatch, dimensões, tags, requisitos/slots).
* **Ghost**: preview com custo **0** (já comprado), mas mostra **custo de instalação** se existir.
* **Ações em Lote**: diálogo com totais (itens, valor potencial de venda, espaço).

**Guardas / Validações**

* **Elegibilidade**: itens estruturais (paredes/portas/janelas/escadas/plataformas) **não** vão para inventário; apenas móveis/decor/ativos portáteis.
* **Estados**: item com dependentes (objetos em cima) exige mover dependentes ou bloquear envio.
* **Integridade**: ao restaurar, respeitar **slots/footprint/routing** como qualquer colocação normal.
* **Swatch/estado**: preservados; se modelo mudou (incompatível), marcar **Inválido** com opção “converter para variante atual” (pós-MVP).
* **Estoque**: reserva durante **Ghost**; ao sair do Ghost, libera; sem corrida de estoque entre abas.
* **Orçamento**: enviar/retirar **não** altera fundos; **Vender** debita/credita e remove do inventário.
* **Políticas**: flag “não vendável” impede venda; “controlado” requer confirmação extra.

**Controles & Atalhos**

* **Backspace**: enviar seleção atual ao inventário.
* **Delete** (no painel): vender item selecionado (confirmação).
* **Ctrl+D** (no painel): duplicar referência p/ colocar várias (consome 1/Commit).
* **Shift**: repetição após cada Commit.
* **M**: alternar slot ao retirar para superfície.
* **Alt**: colocar sem snap (segue regra global).
* **Ctrl** (no painel): selecionar múltiplos; **A**: selecionar todos filtrados.
* **Enter** confirma; **Esc/RightClick** cancela.

**Mensagens comuns**

* “Item estrutural não pode ir para o inventário.”
* “Este item possui dependentes (N) — remova-os ou mova juntos.”
* “Sem unidades disponíveis deste swatch.”
* “Variante descontinuada — converta para a versão atual.”
* “Venda impedida: política ‘não vendável’.”
