---
id: FLOW-DESIGN-TOOL
title: Design Tool (Style Brush)
relates_to: [HUD-003, CON-025, OBJ-040, FB-081]
status: draft
---

# Fluxo de estados — Ferramenta: Pincel de Estilo

**Estados**

1. Idle → 2) Selecionar Fonte (hover/click) → 3) Estilo Capturado (swatch/material/preset) → 4) Hover de Destino → 5) Preview (aplicação) → 6) Válido / 7) Inválido → 8) Aplicar (Commit) → 9) Repetição (auto-apply) → 10) Concluir / 11) Cancelar

**Eventos & Transições**

* Ativar ferramenta → **Idle**.
* Apontar e **Click** no item/material **fonte** → **Estilo Capturado** (guarda swatch/material/preset).
* Mover para um **destino compatível** → **Hover de Destino** → **Preview** com revalidação contínua → **Válido/Inválido**.
* **Click/Enter** em **Válido** → **Aplicar (Commit)**.
* **Shift** mantém **Repetição** (continua aplicando o mesmo estilo em múltiplos alvos).
* **Esc/RightClick** cancela (limpa estilo capturado se mantido).

**Ações por estado**

* **Seleção de Fonte**: highlight do alvo; tooltip com nome, swatch/material, custo de troca (se houver).
* **Estilo Capturado**: badge fixo no cursor (ex.: “Nogal — Brilho”).
* **Preview**: destino mostra o estilo aplicado **temporariamente** (sem custo) + aviso de efeitos colaterais (ex.: “altera também almofadas”).
* **Aplicar**: confirma mudança de swatch/material/preset; atualiza custos/estoque/thumbnail do item.

**Guardas / Validações**

* **Compatibilidade**: só aplica em modelos que **possuem** o mesmo swatch/material ou um **mapeamento** equivalente.
* **Escopo**: objetos multi-parte — decidir por regra (ex.: sofá + almofadas) se aplica ao conjunto; mostrar toggle “incluir partes vinculadas”.
* **Dependências**: se item tem **componentes** (ex.: módulo de estante), tentar aplicar por subpeça; se ausente, degradar com aviso.
* **Políticas/Estoque**: troca pode ser **gratuita** (estilo) ou ter **diferença de custo**/consumo de estoque (revestimentos); bloquear se insuficiente.
* **Camada**: materiais de **parede/piso** só em seus respectivos alvos; itens “protegidos” (corporativos) só permitem visualizar.
* **Sincronismo**: se catálogo atualizou swatches, sugerir “converter para o swatch mais próximo” (prévia destacando diferenças).

**Controles & Atalhos**

* **Roda do mouse / , .**: ciclar variações do **estilo capturado** antes de aplicar.
* **Alt+Click** no destino: aplicar **apenas** ao componente sob o cursor (ignora partes vinculadas).
* **Shift**: manter **Repetição** após cada Commit.
* **A**: aplicar a **todos** os itens **similares no cômodo** (prévia com contagem).
* **Enter** confirma; **Esc/RightClick** cancela.

**Mensagens comuns**

* “Este item não possui o swatch/material selecionado.”
* “Aplicará também a 2 partes vinculadas (alt para isolar).”
* “Diferença de custo §120 — fundos insuficientes.”
* “X itens similares no cômodo serão atualizados.”
