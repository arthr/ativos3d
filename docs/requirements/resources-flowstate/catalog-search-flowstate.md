---
id: FLOW-CATALOG-SEARCH
title: Catalog & Search System
relates_to: [CAT-010, CAT-011, CAT-012, HUD-003]
status: draft
---

# Fluxo de estados — Ferramenta: Catálogo & Busca

**Estados**

1. Idle → 2) Navegação (Depto/Categoria/Coleções) → 3) Busca/Filtragem (chips) → 4) Resultados (lista/grid) → 5) Seleção de Item → 6) Preview/Ficha → 7) Ação (Pegar p/ Colocar / Favoritar / Adicionar a Coleção / Comparar) → 8) Concluir / 9) Cancelar

**Eventos & Transições**

* Abrir Catálogo → **Navegação** (tabs: Departamento, Categoria, Coleções/Favoritos).
* Digitar na busca / aplicar **Filtros** (preço, categoria, disponibilidade, tags) → **Busca/Filtragem** (debounce) → **Resultados**.
* Click/Enter num card → **Seleção de Item** → abre **Preview/Ficha** (swatches, requisitos, footprint, preço, **quantidade**).
* Ação:

  * **Pegar p/ Colocar** → entrega à ferramenta **Objetos** (inicia Ghost já validando estoque/fundos).
  * **Favoritar / Adicionar a Coleção** → confirmação rápida; volta a **Resultados**.
  * **Comparar** → adiciona ao comparador lateral (até N itens).
* **Esc/RightClick** fecha ficha (**Cancelar**); **Enter** confirma ação primária.

**Ações por estado**

* **Navegação**: mantém contexto por tab; breadcrumbs; contadores por categoria.
* **Busca/Filtragem**: chips de filtro visíveis; ordenar por preço/nome/popularidade/estoque.
* **Resultados**: cards com thumbnail, nome, preço, **badge de estoque** (qtd), tags, mini-swatches. Paginação/infinite scroll.
* **Preview/Ficha**: alternar swatch; ver **requisitos** (altura/slots), **footprint**; botão “Ver no cômodo” (projeta ghost no piso ativo).
* **Comparar**: tabela rápida de specs (dimensões, slots, requisitos, preço, qtd).

**Guardas / Validações**

* **Disponibilidade**: se filtro “disponível” ativo, ocultar qty=0; sem filtro, exibir card com estado “Esgotado”.
* **Sincronismo**: preço/quantidade atualizados no abrir ficha; se mudar durante o uso, banner “atualizado”.
* **Requisitos**: bloquear ação “Pegar p/ Colocar” quando requisitos impossíveis no projeto atual (ex.: item de teto em cena sem teto ativo); oferecer “ver detalhes”.
* **Permissões/Políticas**: itens marcados “não vendável/controlado” exigem confirmação extra.
* **Fallback**: sem resultados → sugestões (limpar filtros, categorias relacionadas, termos próximos).

**Controles & Atalhos**

* **/** ou **Ctrl+F**: foco na busca.
* **Tab** troca entre **Departamento/Categoria/Coleções**.
* **↑/↓ + Enter**: navegar lista e abrir ficha.
* **, / .**: ciclo de **swatches** no card/ficha.
* **Ctrl+Enter**: “Pegar p/ Colocar” direto do card selecionado.
* **Backspace** em chips → remove filtro; **Esc** limpa busca/fecha ficha.

**Mensagens comuns**

* “Nenhum resultado para ‘{q}’. Tente remover filtros ou buscar por {sugestão}.”
* “Esgotado no estoque.”
* “Requisitos não atendidos (precisa: slot de parede/altura M).”
* “Preço/estoque atualizados agora.”
