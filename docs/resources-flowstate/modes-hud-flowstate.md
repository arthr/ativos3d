---
id: FLOW-MODES-HUD
title: Modes & Global HUD Controller
relates_to: [GRP-001, GRP-002, HUD-003, CMD-100, VIS-110, VIS-111, PERF-121, ACC-140]
status: draft
---

# Fluxo de estados — Controlador: Modos & HUD Global

**Estados principais (paralelos)**

* **A) Modo Ativo**: Build | Buy | Seleção
* **B) Camada de Piso/Paredes**: Piso N selecionado; Paredes: Baixa | Média | Alta
* **C) Painéis HUD**: Catálogo | Filtros | Pesquisa | Inventário | Comparar | Nenhum
* **D) Ferramentas Rápidas (overrides)**: Conta-gotas | Marreta | Pincel de Estilo | Nenhuma
* **E) Sistema de Ações**: Idle | Undo | Redo | Confirm | Cancel

**Transições-chave**

* Troca de **Modo** (A):

  * Termina “ghost” não confirmado (**auto-cancel**), preserva seleção quando aplicável; carrega tool default do modo.
* Alterar **Piso/Paredes** (B):

  * Atualiza visibilidade sem afetar validação; mantém ferramenta corrente.
* Abrir/fechar **Painéis** (C):

  * Exclusivos (um por vez); voltar fecha painel e retorna ao estado anterior.
* Ativar **Ferramenta Rápida** (D):

  * Entra em override temporário sobre o modo (ex.: Eyedropper) → ao soltar tecla, retorna à ferramenta anterior.
* **Ações globais** (E):

  * **Undo/Redo**: transação única por ação de usuário; **Confirm/Cancel** encerra operações pendentes.

**Ações por estado**

* **A) Modo Ativo**

  * Build: habilita Paredes/Sala, Portas/Janelas, Escadas, Plataformas, Revestimentos.
  * Buy: habilita Objetos, Catálogo, Snapping/Slots completo.
  * Seleção: mover/duplicar/vender, Multi-seleção, Mover Sala.
* **B) Piso/Paredes**

  * Botões subir/descer piso; toggle de paredes (Baixa/Média/Alta).
* **C) Painéis HUD**

  * Pesquisa com debounce; chips de filtros; estado “Esgotado/Disponível”; coleções/favoritos.
* **D) Ferramentas Rápidas**

  * **Conta-gotas**: amostra item/material → abre ficha ou equipa item/material correspondente.
  * **Marreta**: remove alvo(s) elegíveis com preview de custo/retorno.
  * **Pincel de Estilo**: aplica swatch/material do alvo fonte ao alvo destino.
* **E) Sistema de Ações**

  * **Undo/Redo** restauram: geometria, aberturas, objetos, fundos/estoque.
  * **Confirm/Cancel**: confirma/cancela ghost/arrastos em qualquer ferramenta.

**Guardas/Políticas**

* **Troca de modo**: se houver preview/ghost → **auto-cancel**; se houver edição crítica (escada/plataforma) → solicitar confirmação.
* **Painéis**: operações de compra só permitidas com **estoque/fundos** válidos; mensagens claras.
* **Overrides**: Marreta não remove estruturais protegidos (a menos que “modo debug” habilitado).
* **Persistência visual**: mudanças em B (paredes/piso visíveis) **não** alteram regras de validação/colisão.
* **Conflitos de atalhos**: prioridade: Overrides (D) > Ações (E) > Ferramenta atual > Navegação.

**Atalhos globais (sugestão)**

* **F1/F2/F3**: Seleção / Build / Buy
* **PgUp/PgDn**: subir/descer piso
* **L**: hora do dia; **V**: paredes (ciclo Baixa/Média/Alta)
* **B**: Catálogo; **/** ou **Ctrl+F**: Busca
* **E** Eyedropper, **K** Marreta, **R** Pincel de Estilo (hold = temporário)
* **Ctrl+Z / Ctrl+Y**: Undo/Redo; **Enter**: Confirm; **Esc**: Cancel

**Mensagens comuns**

* “Mudança de modo cancelou uma colocação pendente.”
* “Item estrutural protegido — use a ferramenta apropriada.”
* “Sem estoque/fundos para esta ação.”
