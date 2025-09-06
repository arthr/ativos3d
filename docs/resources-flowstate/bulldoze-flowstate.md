---
id: FLOW-BULLDOZE
title: Bulldoze Tool (Clear Room/Floor/Lot)
relates_to: [CON-026]
status: draft
---

# Fluxo de estados — Ferramenta: Bulldoze

**Estados**

1. Idle → 2) Escolha de Escopo (Sala | Andar | Lote) → 3) Análise de Impacto (scan) → 4) Prévia (ghost de remoção) + Relatório → 5) Confirmação (dupla) → 6) Aplicar (Commit atômico) → 7) Concluir / 8) Cancelar

**Eventos & Transições**

* Ativar Bulldoze → **Escolha de Escopo** (padrão: **Sala** sob o cursor).
* Selecionar escopo → **Análise de Impacto** (conta itens, estruturais, valores, estoque, rota).
* Exibir **Prévia + Relatório** → usuário revisa/exclui categorias (ex.: “manter portas/janelas”).
* Confirmar (checkbox “Entendi” + digitar **BULLDOZE** ou botão duplo) → **Aplicar**.
* **Esc/RightClick** em qualquer etapa pré-commit → **Cancelar**.
* **Undo/Redo**: desfaz/refaz **toda** a operação em uma transação.

**O que a ferramenta remove por escopo**

* **Sala**: objetos, revestimentos da sala, paredes internas opcionais, portas/janelas **da sala** (se marcado).
* **Andar**: tudo do piso ativo (salas, objetos, escadas que começam/terminam nele, plataformas, revestimentos).
* **Lote**: tudo no projeto (limitado ao interior, já que exterior foi excluído do produto).

**Ações por estado**

* **Análise de Impacto**:

  * Tabelas: **N objetos**, **M estruturais**, **§ retorno**, **Δ estoque** (inventário), **rotas afetadas**.
  * Lista de exceções detectadas (estruturais protegidos, itens controlados).
* **Prévia (ghost)**: desvanecer tudo que será removido; painel com toggles:

  * “Manter portas/janelas” | “Preservar revestimentos” | “Enviar objetos ao inventário (vs vender/descartar)”.
* **Aplicar (Commit)**: executa remoção em lote, recompõe paredes onde necessário, recalcula navmesh/colisões, atualiza fundos/estoque.

**Guardas / Validações**

* **Proteção estrutural**: elementos protegidos (colunas, paredes portantes, escadas essenciais) não são removidos; listar e manter.
* **Dependências**: se remover suporte (mesa) com dependentes (itens em cima), aplicar regra escolhida: **enviar ao inventário** ou **incluir na remoção**.
* **Integridade de salas**: se bulldoze de sala quebrar contorno de ambientes adjacentes, avisar e propor “recompor paredes”.
* **Portas/escadas**: se removidas, revalidar acessos; se rota crítica perdida, alerta destacado.
* **Políticas**: itens “não vendáveis/controle” → sem retorno de fundos; podem ir ao inventário ou descartar conforme política.
* **Orçamento/Estoque**: retorno de fundos e ajuste de estoque **atômicos**; prévia mostra valores antes do commit.

**Controles & Atalhos**

* Ícone dedicado no HUD; (sugestão) **Shift+Delete** abre Bulldoze com escopo “Sala”.
* **Tab** alterna escopo (Sala ↔ Andar ↔ Lote).
* **Alt** enquanto visualiza prévia: alterna “vender” ↔ “enviar ao inventário” para objetos compráveis.
* **Checkboxes** no relatório: incluir/excluir categorias (objetos, revestimentos, portas/janelas, plataformas).
* **Enter** (após confirmação dupla) aplica; **Esc/RightClick** cancela.

**Mensagens comuns**

* “X objetos, Y estruturais serão afetados. Retorno estimado: §Z. Continuar?”
* “Elementos protegidos não serão removidos: {lista}.”
* “Perda de acesso detectada: caminho até a saída bloqueado.”
* “Operação concluída: removidos X itens, §Y devolvido, Z enviados ao inventário.”
