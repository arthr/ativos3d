---
id: FLOW-SNAPPING-SLOTS
title: Snapping & Slots System
relates_to: [SNAP-070, SNAP-071, SNAP-072, SNAP-073, VAL-095, ACC-141]
status: draft
---

# Fluxo de estados — Ferramenta/Sistema: Snapping & Slots

**Estados (overlay, atuam sobre Build/Buy)**

1. Idle (snap padrão) → 2) Detecção de Âncoras (grid/guia/host) → 3) Ghost “magnético” → 4) Slotting (superfície/parede) → 5) Válido / 6) Inválido → 7) Aplicar (Commit) → 8) Ajuste Fino (alternar slot/alinhamento) → 9) Concluir / 10) Cancelar

**Eventos & Transições**

* Mover item/ghost próximo a **âncoras** (centro, quina, meio de azulejo, eixos, guias de outros objetos) → **Detecção de Âncoras**.
* Entrar na zona de snap (raio/threshold) → **Ghost magnético** com offset zeroado e rotação sugerida.
* Sobre **host** com slots (mesa/prateleira/parede/suporte) → **Slotting** (pré-reserva do slot).
* Alternar slot (**M**) / ciclo de altura em parede (Ctrl+9/0) → revalida → **Válido/Inválido**.
* Confirmar (Click/Enter) em **Válido** → **Aplicar (Commit)** (reserva definitiva do slot/posição).
* Ajuste fino pós-commit (nudge/rotacionar/distribuir) → **Ajuste Fino**.
* **Alt** pressionado a qualquer momento → cancela snap temporariamente (volta ao **Idle** livre).
* **Esc/RightClick** → **Cancelar** (libera pré-reservas).
* Undo/Redo → desfaz/refaz reservas e posições atomicamente.

**Ações por estado**

* **Detecção de Âncoras**: exibe marcadores (grid 1/½/¼; centros; margens; eixos do cômodo).
* **Ghost magnético**: cola no ponto/linha/guia mais “forte”; propõe rotação (ex.: cadeira vira p/ mesa).
* **Slotting**: mostra slots disponíveis (marcadores), ordem (1…N), capacidade/peso; destaca o slot alvo.
* **Ajuste Fino**:

  * Distribuição/Alinhamento (bordas/centros/equidistante) para grupos;
  * Nudge por teclas;
  * Troca de slot/altura mantendo validade.

**Guardas / Validações**

* **Prioridade de snap** (score): host & slots > guias de objetos > grid fino > grid grosso.
* **Compatibilidade** do slot: tipo (pequeno/médio/grande), peso, orientação, restrições do modelo (ex.: TV só em suporte/parede).
* **Capacidade**: bloquear quando slot cheio; permitir fila/ordem apenas se modelo suportar.
* **Margens mínimas**: respeitar afastos de portas/escadas/rotas; impedir “clip” em quinas.
* **Rotação sugerida**: aceitar se mantém acessos (routing) e não colide; caso contrário, degradar p/ grid.
* **Equidistância**: manter espaçamento inteiro em azulejos; se não couber, exibir aviso e propor contagem menor.
* **Pré-reserva**: liberar automaticamente ao sair da zona; confirmar só no Commit.

**Controles & Atalhos**

* **F5**: alterna granularidade de grid (1 ↔ ½ ↔ ¼).
* **Alt (hold)**: desliga snaps/guia temporariamente.
* **M**: alternar **slot** em superfícies.
* **R / Scroll**: rotacionar; **Shift** = passo fino.
* **Setas**: nudge (passo do grid atual).
* **G**: ligar/desligar **guias de alinhamento** visuais.
* **= / -**: aumentar/reduzir espaçamento na **distribuição** (quando ativa).
* **Enter** confirma; **Esc/RightClick** cancela.

**Mensagens comuns**

* “Slot incompatível (tamanho/peso/orientação).”
* “Capacidade esgotada nesta superfície.”
* “Equidistância impossível no espaço disponível — reduza N ou espaçamento.”
* “Afastamento mínimo de circulação não atendido.”
