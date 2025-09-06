---
id: FLOW-DOORS-WINDOWS
title: Doors & Windows Placement
relates_to: [CON-022, VAL-092, FB-080]
status: draft
---

# Fluxo de estados — Ferramenta: Portas/Janelas

**Estados**

1. Idle → 2) Hover (sobre parede) → 3) Ghost (encaixado à parede) → 4) Válido / 5) Inválido → 6) Aplicar (Commit) → 7) Ajuste Fino (mover/centralizar/altura/abraçamento) → 8) Selecionado → 9) Concluir / 10) Cancelar

**Eventos & Transições**

* Ativar ferramenta → **Idle**
* Cursor entra numa **parede elegível** (andar ativo) → **Hover** (mostra faixa de altura B/M/A e centro do azulejo)
* MouseDown em posição válida → **Ghost**
* Enquanto move no Ghost:

  * Snap ao **centro do azulejo** e a offsets válidos
  * Teclas mudam **altura** (B/M/A) e **mão/abrir** (porta) → revalida → **Válido/Inválido**
* Click/Enter em **Válido** → **Aplicar (Commit)** (abre vão, debita fundos/estoque, atualiza navmesh)
* Drag após aplicado → **Ajuste Fino** (slide ao longo da parede / trocar altura / inverter mão\*)
* Esc/RightClick com mudanças pendentes → **Cancelar** (reverte)
* Selecionar item colocado → **Selecionado** (exibe gizmos/opções)
* Undo/Redo em qualquer ponto reverte/reativa **Commit** atomicamente

\* Porta: inverter mão/abrir; Janela: inverter orientação se modelo suportar.

**Ações por estado**

* **Hover**: destaca segmento de parede, mostra faixa de altura disponível (B/M/A) e distâncias às quinas/aberturas.
* **Ghost**: preview recorta a parede (sem aplicar), mostra swing (porta) ou recuo (janela), custo e disponibilidade.
* **Válido/Inválido**: verde/vermelho + tooltip com motivo (ex.: “muito próximo da quina”).
* **Aplicar**: executa “wall cut”, coloca molduras, ajusta rodapé/guarnição se houver, atualiza **routing** (porta abre passagem; janela não).
* **Ajuste Fino**: gizmo de slide paralelo à parede; troca de **altura** e **mão** com revalidação instantânea.

**Guardas / Validações (chave)**

* **Tipo de parede**: porta/janela exigem parede **inteira**; meia-parede não aceita porta; janela depende do modelo.
* **Altura**: banda B/M/A só se compatível com **pé-direito** atual e com o modelo (ex.: janela alta requer banda A).
* **Espaçamentos mínimos**: distância a quinas, outras portas/janelas e interseção com **escadas**, **plataformas** e **colunas**.
* **Colisão com objetos**: bloquear se moldura/swing invadir **footprints** (armários, cortinas de parede, suportes de TV etc.).
* **Swing da porta**: checar área de varredura livre (abrir para dentro/fora); respeitar lado do **batente/dobradiça**.
* **Estrutura**: recorte não pode cruzar junções de salas inválidas; alinhamento em paredes diagonais deve respeitar espessura.
* **Orçamento/Estoque**: impedir Commit se fundos < preço ou **quantidade=0** (mostrar aviso e CTA para inventário/compra).
* **Roteamento**: após Commit, recalcular malha; portas devem criar passagem conectando salas válidas.

**Atalhos**

* **1 / 2 / 3**: alterna altura **Baixa/Média/Alta**
* **F**: inverte **mão/abrir** da porta (ou orientação da janela, se suportado)
* **Setas** (ou Shift+Scroll): desliza ao longo do segmento antes de aplicar
* **Alt**: desliga centralização no exato centro do azulejo (permite offsets válidos do modelo)
* **Enter**: confirmar; **Esc/RightClick**: cancelar etapa atual

**Erros comuns & mensagens**

* “Altura incompatível com o pé-direito atual.”
* “Muito próximo da quina / outra abertura.”
* “Área de swing da porta bloqueada por <objeto>.”
* “Sem estoque suficiente para este item.”
