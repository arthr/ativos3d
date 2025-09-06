---
id: FLOW-SLEDGEHAMMER
title: Sledgehammer Tool (Removal)
relates_to: [HUD-003, PERF-121, VAL-090]
status: draft
---

# Fluxo de estados — Ferramenta: Marreta (Sledgehammer)

**Estados**

1. Idle → 2) Hover (alvo detectado) → 3) Pré-remoção (ghost em vermelho) → 4) Seleção por Arrasto (lote/batch) → 5) Válido / Inválido → 6) Aplicar (Commit, com batching) → 7) Concluir / 8) Cancelar

**Eventos & Transições**

* Ativar Marreta → **Idle**.
* Apontar p/ alvo removível → **Hover** (destaca).
* Click simples → **Pré-remoção** daquele alvo → **Válido/Inválido** → Click/Enter confirma → **Aplicar**.
* Click+Arrastar → **Seleção por Arrasto** (pinta área/segmentos) com contadores (N objetos, M azulejos/parede).
* Soltar em **Válido** → **Aplicar** (um único passo de Undo).
* **Esc/RightClick** cancela etapa atual; Undo/Redo reverte/aplica tudo atomicamente.

**Ações por estado**

* **Hover**: outline do alvo; tooltip com **retorno de fundos/estoque** e dependências (ex.: “2 itens sobre a mesa”).
* **Pré-remoção**: ghost vermelho do que será removido; painel mostra total (fundos + estoque a devolver).
* **Seleção por Arrasto**: destaca tudo a remover (objetos, trechos de parede, revestimentos se aplicável); lista por tipo com totais.
* **Aplicar**: remove, devolve fundos (se política), atualiza **estoque** (itens vão ao Inventário *ou* são descartados, conforme regra), recalcula navmesh/colisões.

**Guardas / Validações**

* **Elegibilidade**: itens estruturais protegidos (p.ex. paredes portantes, escadas ativas) bloqueiam, a menos que “modo debug” (se existir).
* **Dependências**: não remove suporte com dependentes (prateleira com objetos) sem resolver: opção “mover dependentes p/ inventário” ou bloquear.
* **Integridade**: remoção de portas/janelas recompõe a parede; remoção de paredes pode invalidar sala—exibir aviso (perda de contorno).
* **Roteamento**: se quebra passagem essencial, mostrar aviso (“acesso ao cômodo X será perdido”).
* **Políticas**: itens “não vendáveis” não retornam fundos; itens controlados pedem confirmação extra.
* **Lote**: se seleção contém misto **permitido+bloqueado**, aplicar apenas permitidos e listar ignorados.

**Controles & Atalhos**

* **K** (ou ícone): ativar Marreta.
* **Click**: remove alvo único.
* **Click+Arrasto**: varre/remover em área (objetos/paredes/revestimentos).
* **Shift**: restringe a arrasto ortogonal/retangular.
* **Ctrl**: subtrai da seleção atual (quando em arrasto).
* **Alt**: alterna modo “enviar ao inventário” vs “descartar” (se política permitir).
* **Enter** confirma; **Esc/RightClick** cancela.

**Mensagens comuns**

* “Item possui dependentes: mover para inventário ou cancelar.”
* “Elemento estrutural protegido — use a ferramenta adequada.”
* “X itens removidos. §Y devolvido. Z enviados ao inventário.”
