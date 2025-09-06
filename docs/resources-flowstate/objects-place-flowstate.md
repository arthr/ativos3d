---
id: FLOW-OBJECTS-PLACE
title: Objects Placement & Manipulation
relates_to: [OBJ-040, OBJ-041, OBJ-042, OBJ-043, OBJ-044, SNAP-070, SNAP-071, SNAP-072, SNAP-073, VAL-090, VAL-091, FB-080]
status: draft
---

# Fluxo de estados — Ferramenta: Objetos

**Estados**

1. Idle → 2) Hover (superfície/piso/parede) → 3) Ghost (com snap/slots) → 4) Válido / 5) Inválido → 6) Aplicar (Commit) → 7) Selecionado → 8) Arrastando (mover) / Rotacionando / Ajuste Vertical (parede) / Escalando → 9) Multiposição (repetição/linha) → 10) Concluir → 11) Cancelar

**Eventos & Transições (resumo)**

* Ativar ferramenta / escolher item do catálogo → **Idle**.
* Mover cursor a uma superfície compatível → **Hover** (mostra grid/slots/guias).
* MouseDown/Click em ponto elegível → **Ghost** → valida continuamente → **Válido/Inválido**.
* Confirmar (Click/Enter) em **Válido** → **Aplicar (Commit)** (debita fundos/estoque).
* Selecionar item recém-colocado → **Selecionado** (gizmos visíveis).
* Drag → **Arrastando** (mover); R/Scroll → **Rotacionando**; Ctrl+9/0 (ou setas verticais) → **Ajuste Vertical** (parede); Shift+\[ / ] → **Escalando**.
* Manter **Shift** após Commit → **Multiposição** (repete peça; arrasto linear com snap).
* Esc/RightClick com alterações pendentes → **Cancelar** (reverte etapa).
* Undo/Redo: reverte/aplica **Commit** atomicamente, inclusive fundos/estoque/slots.

**Ações por estado**

* **Hover**: destaca área válida (piso/parede/superfície), mostra footprint e marcadores de slot.
* **Ghost**: preview translúcido com custo/disponibilidade; linhas de alinhamento (centro/cantos/equidistância).
* **Válido/Inválido**: verde/vermelho + tooltip (“slot cheio”, “colisão lateral”, “altura inválida”).
* **Selecionado**: gizmos (mover/rotacionar/altura/escala), painel com variações (swatches) e ações (duplicar, enviar ao inventário).
* **Multiposição**: contador de unidades, subtotal de custo/estoque, espaçamento por grid/snap.

**Guardas / Validações**

* **Compatibilidade de suporte**: item de parede só em parede; item de superfície apenas em mesas/prateleiras com slot compatível (peso/tamanho).
* **Footprint**: não colide com paredes/itens; tolerâncias por categoria (decor vs. grande).
* **Snaps/Slots**: respeita capacidade; ordem alterável (tecla **M**); bloqueia empilhamento inválido.
* **Altura (parede)**: faixas válidas (B/M/A); limite de rodapé/teto; alinhamento com vizinhos.
* **Rotação**: respeita recuos mínimos de portas/escadas/circulação.
* **Routing**: objetos interativos exigem “approach slots” livres; não pode bloquear caminho crítico do cômodo.
* **Orçamento/Estoque**: impedir Commit se fundos/quantidade insuficientes; mensagens claras e CTA para inventário.
* **Escala** (se suportada): restringir a range; recalcular hitbox/slots; proibir se romper validações acima.

**Snapping & Alinhamento**

* Grid 1/½/¼; **Alt** desliga snap temporariamente.
* Guias a centros/cantos/meio do azulejo e distribuição equidistante (N itens).
* Snaps contextuais: cadeira↔mesa/notebook; TV↔parede/suporte; luminária↔teto/mesa; prateleira↔parede.

**Atalhos**

* **R / Scroll**: rotacionar (com step de 15°/45°, Shift para step fino).
* **Alt**: colocação livre (sem snap) enquanto pressionado.
* **F5**: alterna granularidade de grid (1, ½, ¼).
* **Shift**: repetir colocação / iniciar arrasto linear (multiposição).
* **M**: alternar slot em superfícies.
* **Ctrl+9 / Ctrl+0** (ou setas verticais): subir/descer em parede.
* **Shift+\[ / Shift+]**: diminuir/aumentar escala (quando permitido).
* **Backspace**: enviar ao **Inventário da empresa**.
* **Esc/RightClick**: cancelar etapa atual; **Enter**: confirmar.

**Mensagens comuns**

* “Slot de superfície ocupado/insuficiente.”
* “Área de acesso bloqueada — libere a frente/lado do objeto.”
* “Sem estoque suficiente / fundos insuficientes.”
* “Altura inválida para este modelo.”
