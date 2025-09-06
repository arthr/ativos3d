---
id: FLOW-FINISHES
title: Floor & Wall Finishes
relates_to: [CON-025, FB-081, CMD-100]
status: draft
---

# Fluxo de estados — Ferramenta: Revestimentos

**Estados**

1. Idle → 2) Seleção de Material (catálogo) → 3) Hover (alvo: célula/parede/sala) → 4) Ghost (preview) → 5) Pincelando/Arrasto ou Flood-Fill → 6) Válido / 7) Inválido → 8) Aplicar (Commit, com batching) → 9) Concluir / 10) Cancelar

**Eventos & Transições**

* Escolher material no catálogo → **Seleção de Material** → **Hover** sobre piso/parede elegível.
* Click simples: **Ghost** da célula/segmento; manter pressionado e arrastar → **Pincelando** (faixa/retângulo).
* **Shift+Click** em área fechada → **Flood-Fill** por sala (piso) ou por segmento contínuo (parede).
* A cada mudança, revalida → **Válido/Inválido**.
* Soltar/Enter em **Válido** → **Aplicar (Commit)** (loteia mudanças numa única operação de Undo).
* **Ctrl** alterna para **Borracha/Remover** (material volta ao default).
* Esc/RightClick → **Cancelar** (descarta preview).
* Undo/Redo → desfaz/refaz o Commit inteiro.

**Ações por estado**

* **Hover**: destaca célula/segmento/sala-alvo; mostra custo por unidade e total estimado.
* **Ghost**: preview translúcido com **padrão/orientação**; para paredes, indica altura (B/M/A) do revestimento.
* **Pincelando/Flood-Fill**: contador de azulejos/segmentos; subtotal de custo; continuidade visual nas bordas.
* **Aplicar**: grava material, recalcula junções (rodapés/guarnições se aplicável), atualiza biblioteca de estilos recentes.

**Guardas / Validações**

* **Alvo válido**: piso existente; parede do andar ativo (inteira ou meia, conforme material).
* **Compatibilidade de altura** (paredes): material exige B/M/A suportado pela sala/pé-direito.
* **Contiguidade** (flood): requer sala fechada; se não fechado, oferecer pincel ao invés de fill.
* **Plataformas/Desníveis**: não cruzar níveis de altura distintos na mesma operação de piso.
* **Orçamento/Estoque**: bloquear se insuficiente; mostrar unidades necessárias e disponíveis.
* **Restrições de modelo**: alguns padrões não permitem rotação/espelhamento; respeitar.

**Snapping & Controles**

* **Grid** 1/½/¼ para pincel em piso; paredes por **segmento** com snap às quinas.
* **R**: rotaciona padrão; **X**: espelha (se suportado).
* **Shift**: **flood-fill** por sala/segmento contínuo.
* **Ctrl**: borracha/remover material.
* **, / .**: alterna swatch/variação.
* **Alt** (com Conta-gotas ativa): amostra material existente.
* **Enter** confirma; **Esc/RightClick** cancela etapa.

**Mensagens comuns**

* “Sala não fechada — flood-fill indisponível.”
* “Altura da parede incompatível com o revestimento selecionado.”
* “Fundos/estoque insuficientes para N unidades.”
* “Operação cruza plataformas de alturas diferentes — divida a aplicação.”
