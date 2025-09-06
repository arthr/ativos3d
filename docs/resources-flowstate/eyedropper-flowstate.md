---
id: FLOW-EYEDROPPER
title: Eyedropper Tool
relates_to: [HUD-003, CAT-012, OBJ-040, CON-025]
status: draft
---

# Fluxo de estados — Ferramenta: Conta-Gotas

**Estados**

1. Idle → 2) Mirando/Hover (alvo) → 3) Amostrado (objeto/material/preset) → 4) Equipa Item/Material → 5) Ghost (da ferramenta destino) → 6) Válido/Inválido → 7) Aplicar (Commit) → 8) Concluir/Cancelar

**Eventos & Transições**

* Ativar Conta-Gotas (tecla/ícone) → **Idle**.
* Mirar sobre algo elegível → **Mirando/Hover** (mostra tipo e dica).
* Click:

  * **Objeto comprável** → **Amostrado** → troca para **Objetos** já com o SKU/swatch; se há estoque, **Ghost**; senão, aviso.
  * **Material de piso/parede** → **Amostrado** → troca para **Revestimentos** com material ativo → **Ghost**.
  * **Estruturais** (porta/janela/escada/plataforma/parede) → **Amostrado** → troca para a **ferramenta correspondente** com o preset do alvo → **Ghost**.
* Segurar **Shift** após equipar → permanece em modo “**multi-sample**” (não sai do Conta-Gotas).
* **Enter/Click** em Válido → **Aplicar**; **Esc/RightClick** cancela e retorna à ferramenta anterior.

**Ações por estado**

* **Mirando/Hover**: highlight do alvo; tooltip: nome, SKU/material, swatch, preço e **quantidade no inventário**.
* **Amostrado**: mostra ficha compacta; se houver variações, mantém o **swatch do alvo**.
* **Equipa Item/Material**: carrega a ferramenta destino com contexto (slots/altura/rotação herdáveis quando fizer sentido).
* **Ghost**: atua como a ferramenta destino (validação, custo, estoque).

**Guardas / Validações**

* **Elegibilidade**: ignora itens ocultos/camadas desativadas; respeita prioridade de picking (objeto > material > parede).
* **Disponibilidade**: se **Inventário da empresa** possui unidades, priorizar; se não, checar **fundos** e **estoque do catálogo**.
* **Permissões**: itens “não vendáveis/controlados” só permitem **inspecionar** (abrir ficha) — sem equipar para compra.
* **Consistência**: ao copiar estruturais, validar que o preset é compatível com o projeto atual (pé-direito, largura, etc.).
* **Sincronismo**: se preço/estoque mudaram entre amostrar e equipar, mostrar banner “atualizado” e revalidar.

**Atalhos**

* **E** (ou ícone): ativar Conta-Gotas.
* **Alt+Click**: amostrar **apenas o swatch/estilo** (mantém o mesmo SKU selecionado previamente).
* **\[ / ]**: ciclar camada de picking quando há sobreposição (ex.: quadro sobre parede).
* **Shift**: manter em **multi-sample** (após equipar, volta ao Conta-Gotas automaticamente).
* **Enter** confirma colocação; **Esc/RightClick** cancela e retorna à ferramenta anterior.

**Mensagens comuns**

* “Este item é controlado/não vendável — abrindo ficha para inspeção.”
* “Sem estoque para este SKU — use o Inventário da empresa ou escolha outro.”
* “Material incompatível com a altura de parede atual.”
* “Preço/estoque atualizados agora.”
