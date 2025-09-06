---
id: FLOW-FEEDBACK-OVERLAY
title: Visual Feedback & States Overlay
relates_to: [FB-080, FB-081, FB-082, PERF-120, VIS-111, ACC-142, VAL-096]
status: draft
---

# Fluxo de estados — Overlay: Estados & Feedback

**Estados (linha do tempo típica)**

1. **Idle** → 2) **Hover** → 3) **Ghost Preview** → 4a) **Válido** | 4b) **Inválido** → 5) **Aplicar (Commit)** → 6) **Selecionado** → 7) **Ajuste Fino** (mover/rotacionar/altura/escala) → 8) **Concluir** / 9) **Cancelar**

**Transições & eventos**

* Cursor entra em alvo elegível → **Hover**
* Press down / iniciar arrasto / pegar item do catálogo → **Ghost**
* A cada movimento: revalidação → **Válido/Inválido**
* Click/Enter em **Válido** → **Commit** (única transação p/ Undo)
* Click no objeto recém-colocado ou já na cena → **Selecionado**
* Drag / R / setas / handles → **Ajuste Fino** (revalida continuamente)
* **Esc/RightClick**: cancela etapa corrente (reverte ghost/arrasto)
* **Undo/Redo**: reverte/reaplica **Commit** atomicamente (geometria/objetos/fundos/estoque)

**Feedback visual/sonoro/háptico**

* **Idle**: cursor padrão + dica contextual no HUD (nome da ferramenta, atalhos-chave).
* **Hover**: highlight sutil do alvo (borda fina), guias de snap; tooltip curta (“Clique para colocar / Shift: repetir”).
* **Ghost**: modelo translúcido, **cor**: cinza base; **Válido**: **verde**; **Inválido**: **vermelho** com ícone ⚠.
* **Tooltips de erro** (Inválido): frase ativa + causa (“Sem espaço lateral — colisão com parede”). Persistem enquanto condição durar.
* **Selecionado**: outline mais espesso + **gizmos** (mover/rotacionar/altura/escala) e medidas (Δx/Δy/Â).
* **Commit**: microanimação (fade-in) + som de confirmação; erro: som distinto e shake leve do ghost.
* **Custos/estoque**: badge flutuante próximo ao cursor (Δfundos, Δqtd). Vermelho quando insuficiente.
* **Acessibilidade**: todas as cores têm alternativa por **textura/padrão**; tooltips legíveis (WCAG AA), tempo ajustável.

**Regras de priorização de feedback**

1. **Erro bloqueante** (Inválido) > aviso (degradação) > dicas (UX).
2. Mensagens **uma por vez**; empilhar apenas se causas distintas, com numeração “1/2”.
3. Duração alvo: dicas 2–4s, avisos 4–6s, erros enquanto persistirem.

**Guardas/validações no overlay**

* Troca de modo/HUD com **ghost ativo** → **auto-cancel** com aviso.
* Colisão/footprint, slots, altura, routing, orçamento/estoque → determinam Válido/Inválido.
* Drag contínuo agrega em **um** passo de Undo; ao soltar, fecha transação.

**Latência alvo**

* Atualização de estado visual ≤ **16 ms** (60 FPS).
* Revalidação (broad-phase) ≤ **4 ms**; precise só quando estável por 1 frame (debounce).
* Exibição de tooltip ≤ **100 ms** após mudança de estado.

**Controles globais**

* **Enter** confirma; **Esc/RightClick** cancela etapa.
* **Shift/Ctrl/Alt**: modificadores (preencher/remover/snap livre) refletem **imediatamente** em ghost/tooltip.
* **?** (ou F1): sobreposição de ajuda com mapa de estados + atalhos da ferramenta atual.

**Mensagens padrão (exemplos)**

* Válido: “Enter para confirmar. Shift: repetir.”
* Inválido: “Afastamento mínimo não atendido (0,5 azulejo).”
* Aviso: “Capacidade de slots quase cheia (2/3).”
* Erro financeiro: “Fundos insuficientes — faltam §120.”
