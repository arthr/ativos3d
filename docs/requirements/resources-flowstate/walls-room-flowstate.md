---
id: FLOW-WALLS-ROOM
title: Walls & Room Construction
relates_to: [CON-020, CON-021, FB-080, VAL-090]
status: draft
---

# Fluxo de estados — Ferramenta: Paredes/Sala

**Estados**

1. Idle → 2) Hover → 3) Ghost(Segmento) → 4) Desenhando(Drag) → 5) Fechamento de Sala (loop detectado) → 6) Válido / 7) Inválido → 8) Aplicar(Commit) → 9) Ajuste por Gizmos (alongar/encolher) → 10) Seleção da Sala → 11) Concluir / 12) Cancelar

**Eventos & Transições (resumo)**

* Ativar ferramenta → **Idle**
* Mover cursor sobre piso/parede (com snap ativo) → **Hover** (mostra guias/azulejos)
* MouseDown em ponto válido → cria **Ghost(Segmento)**
* Arrastar (Snap on/off; Shift=estender reta/ortogonal) → **Desenhando(Drag)** (atualiza custo/length)
* Soltar mouse:

  * Se não fechou loop: fixa segmento, volta a **Hover**
  * Se fechou loop contíguo: **Fechamento de Sala** → valida
* Validação:

  * Se passa (sem colisões/aberturas inválidas) → **Válido**
  * Se falha (colisão, interseção, espessura mínima, corte impossível) → **Inválido** (tooltip com motivo)
* Confirmar (Enter/Click confirmar) → **Aplicar(Commit)** (gera sala, atualiza malha/custos/estoque)
* Passar para edição fina (selecionar sala recém-criada) → **Ajuste por Gizmos** (handles nos lados/cantos)

  * Drag de handle:

    * Se válido → aplica offset em tempo real; custo incremental
    * Se inválido → bloqueia e mantém tooltip
* Esc/RightClick em qualquer momento:

  * Se tem alterações não aplicadas → **Cancelar** (reverte ghost/drag)
* Selecionar sala (ferramenta de Seleção) → **Seleção da Sala** (permite mover sala inteira, ver métricas)
* Undo/Redo em qualquer estado: reexecuta/retira **Aplicar(Commit)** atomicamente

**Ações por estado (principais)**

* **Hover**: snap à grade/½/¼; exibe linha-guia e custo estimado por metro.
* **Ghost(Segmento)**: mostra espessura da parede, direções válidas, códigos de erro se fora de piso.
* **Desenhando**: preview dinâmico; interseção inteligente (auto-snap em paredes existentes e quinas).
* **Válido/Inválido**: coloração verde/vermelha do ghost; tooltip (“colide com porta”, “sem apoio”, “espessura mínima”).
* **Aplicar(Commit)**: atualiza navegação (rooms), recalcula contornos, ajusta revestimentos se “autopreencher” estiver ativo.
* **Ajuste por Gizmos**: mostra medidas (azulejos/metros), preserva ortogonalidade se Shift.

**Guardas (validações-chave)**

* Espessura mínima da parede; proibição de cruzar paredes sem união válida.
* Conexão apenas sobre piso existente do andar ativo.
* Fechamento de sala requer loop simples (sem self-intersection).
* Integração com portas/janelas: ao ajustar parede, verificar headroom e manter encaixes válidos (ou avisar remoção).
* Custo/orçamento e disponibilidade de material (se aplicável) antes do commit.

**Atalhos/Modos rápidos**

* **Shift**: restringir a ortogonal/estender reta; **Ctrl**: modo “remover segmento”; **Alt**: desenhar sem snap.
* **Enter**: confirmar; **Esc/RightClick**: cancelar etapa atual.
