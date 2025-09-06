---
id: FLOW-MULTI-SELECTION
title: Multi-Selection & Batch Operations
relates_to: [OBJ-046, SNAP-073, PERF-121]
status: draft
---

# Fluxo de estados — Ferramenta: Multi-seleção

**Estados**

1. Idle → 2) Iniciar Marquee (arrasto) → 3) Seleção Parcial (prévia) → 4) Seleção Final (conjunto ativo) → 5) Ação: Mover / Duplicar / Vender / Enviar ao Inventário / Alinhar → 6) Válido / 7) Inválido → 8) Aplicar (Commit em lote) → 9) Concluir / 10) Cancelar

**Eventos & Transições**

* Arrastar em área vazia → **Iniciar Marquee** (modo “tocar” ou “conter”; alternar com Tab).
* MouseUp → **Seleção Final** (N itens); vazio → volta **Idle** com tooltip (“Nada selecionado”).
* Escolher ação:

  * **Mover** (drag) → valida colisão/slots/routing em conjunto → **Válido/Inválido**.
  * **Duplicar** (Ctrl+D) → cria **Ghost** do grupo mantendo offsets; conflitos resolvidos por regra (p.ex. “pular itens inválidos”).
  * **Vender** (Delete) / **Inventário** (Backspace) → mostra diálogo com contagem e total.
  * **Alinhar/Distribuir** (guias) → preview com medidas.
* Enter/Click em **Válido** → **Aplicar (Commit)** (uma operação de Undo).
* Esc/RightClick → **Cancelar** (reverte etapa atual).
* Undo/Redo reverte/aplica todo o lote.

**Ações por estado**

* **Seleção Parcial/Final**: mostra hull/bbox, contagem por tipo, subtotal de valor/estoque; permite **refinar** (Shift=adicionar, Ctrl=subtrair click/marquee).
* **Mover/Duplicar**: snap à grid/½/¼ e guias; contador de “itens inválidos/ignorados”.
* **Vender/Inventário**: confirmação com lista resumida (top N) + totais (fundos/quantidade).
* **Alinhar/Distribuir**: opções (bordas, centros, espaçar igualmente X/Y).

**Guardas / Validações**

* **Escopo**: só itens elegíveis (ignora bloqueados/estruturais por padrão; toggle “incluir estruturais” opcional).
* **Dependências de slot**: itens sobre superfícies movem juntos; se destino sem slots → marcar inválidos.
* **Colisão/Footprint**: grupo não pode cruzar portas/escadas/parede; tolerâncias por categoria.
* **Routing**: manter approach slots essenciais (sofás, cadeiras, eletros).
* **Pisos/Alturas**: não atravessar andar; respeitar altura de parede de itens pendurados.
* **Orçamento/Estoque**: **Duplicar** requer fundos/quantidade; **Vender/Inventário** ajusta saldos atomicamente.

**Atalhos**

* Arrasto vazio: iniciar marquee.
* **Shift** adicionar / **Ctrl** subtrair seleção.
* **Ctrl+D** duplicar; **Delete** vender; **Backspace** inventário.
* **A** selecionar todos no cômodo/piso visível; **G** alinhar; **H** distribuir (opcional).
* **Alt** mover sem snap temporariamente; **Enter** confirma; **Esc/RightClick** cancela.

**Mensagens comuns**

* “Nenhum item elegível na seleção.”
* “X itens sem slots compatíveis no destino — serão ignorados.”
* “Duplicação cancelada — fundos/estoque insuficientes.”
* “Movimento bloquearia acesso a <objeto>.”
