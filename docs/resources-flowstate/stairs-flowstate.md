---
id: FLOW-STAIRS
title: Stairs Construction
relates_to: [CON-023, VAL-093, FB-081]
status: draft
---

# Fluxo de estados — Ferramenta: Escadas

**Estados**

1. Idle → 2) Hover (piso inicial) → 3) Ghost (trajeto projetado) → 4) Ajuste de Trajeto (reta/L/U) → 5) Válido / 6) Inválido → 7) Aplicar (Commit) → 8) Ajuste Fino (gizmos: comprimento, rotação, patamar, largura) → 9) Selecionado → 10) Concluir / 11) Cancelar

**Eventos & Transições**

* Ativar ferramenta → **Idle**
* Cursor sobre piso válido → **Hover** (mostra direção sugerida e setas)
* Click para definir **ponto inicial** → **Ghost** (gera lance padrão)
* Arrastar para definir **trajeto** (reta; pressionar teclas para L/U) → **Ajuste de Trajeto**
* A cada mudança, valida → **Válido/Inválido**
* Confirmar (Click/Enter) em **Válido** → **Aplicar (Commit)** (recorte de laje, corrimãos, custo/estoque)
* Selecionar após Commit → **Ajuste Fino** (gizmos e painel de parâmetros)
* Esc/RightClick com alterações pendentes → **Cancelar** (reverte etapa)
* Undo/Redo reverte/aplica Commit atomicamente (inclui recortes e navegação)

**Ações por estado**

* **Hover**: destaca área inicial, mostra orientação do primeiro degrau.
* **Ghost**: visualiza inclinação, número de degraus, patamar automático quando necessário.
* **Ajuste de Trajeto**:

  * Drag frontal: comprimento/elevação;
  * Drag lateral (com tecla): cria quina **L**; segunda quina cria **U**;
  * Ajuste de **largura** por gizmo lateral;
  * Alternar **tipo de corrimão** no painel.
* **Válido/Inválido**: verde/vermelho + tooltip (“headroom insuficiente”, “colisão com objeto”, “sem piso de chegada”).
* **Aplicar**: executa **corte de piso** no andar-alvo, gera corrimãos/guarda-corpo, atualiza **navmesh** entre andares.
* **Ajuste Fino**: handles para mover ponto inicial/final, girar conjunto, ajustar largura, trocar patamar (auto/manual).

**Guardas / Validações**

* **Headroom** mínimo em todo o trajeto (considerar teto, platôs e luminárias).
* **Piso de chegada** existente e livre; início/fim com área de aproximação.
* **Colisão** com paredes/portas/janelas/objetos/colunas.
* **Largura mínima** por regra do produto/modelo.
* **Inclinação** dentro do range do modelo (nº de degraus e espelho).
* **Recortes** de laje não podem intersectar elementos estruturais bloqueados.
* **Orçamento/Estoque**: bloquear Commit se insuficiente; exibir quantidades de corrimãos/deg/degraus.

**Snapping & Controles**

* Snap ao **centro de azulejo**, quinas de sala e eixos principais; **Alt** para livre.
* **Tab**: alterna direção do lance inicial.
* **1/2/3**: alterna forma (reta/L/U).
* **\[ / ]**: ajusta **largura** em passos.
* **R / Scroll**: gira o conjunto ao redor do ponto inicial.
* **Shift**: restringe a ângulos ortogonais; **Ctrl**: modo apagar escada existente.
* **Enter** confirma; **Esc/RightClick** cancela etapa.

**Mensagens comuns**

* “Headroom insuficiente entre degraus e teto em X azulejos.”
* “Sem piso de chegada livre.”
* “Colisão com \<objeto/parede> no lance Y.”
* “Largura abaixo do mínimo permitido.”
