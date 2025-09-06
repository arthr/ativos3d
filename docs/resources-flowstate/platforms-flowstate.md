---
id: FLOW-PLATFORMS
title: Internal Platforms Construction
relates_to: [CON-024, VAL-094, FB-081]
status: draft
---

# Fluxo de estados — Ferramenta: Plataformas (internas)

**Estados**

1. Idle → 2) Hover (área do piso) → 3) Ghost (contorno+altura) → 4) Desenhando (arrasto da área) → 5) Ajuste de Altura (handles) → 6) Válido / 7) Inválido → 8) Aplicar (Commit) → 9) Ajuste Fino (mover/bordas/altura/guarda-corpo) → 10) Selecionado → 11) Concluir / 12) Cancelar

**Eventos & Transições**

* Ativar ferramenta → **Idle**
* Cursor sobre piso editável → **Hover** (mostra grid e altura atual do piso)
* MouseDown + arrasto → **Desenhando** (retângulo/polígono\* com snap)
* MouseUp → gera **Ghost** da plataforma com **altura inicial** (padrão)
* Interagir com handles de altura → **Ajuste de Altura** (↑/↓ em incrementos)
* A cada mudança → valida → **Válido/Inválido**
* Confirmar (Click/Enter) em Válido → **Aplicar (Commit)**
* Selecionar após Commit → **Ajuste Fino** (mover, redimensionar bordas, trocar guarda-corpo, refinar altura)
* Esc/RightClick com alterações pendentes → **Cancelar**
* Undo/Redo em qualquer ponto → desfaz/refaz Commit atomicamente

\* Polígono opcional: retângulo no MVP; poligonal em pós-MVP.

**Ações por estado**

* **Hover**: exibe diferença de nível vs. piso base.
* **Desenhando**: mostra área, perímetro e custo estimado; snap a 1/½/¼ de azulejo.
* **Ghost**: volume translúcido, altura numérica, opção de **guarda-corpo** on/off.
* **Ajuste de Altura**: handles verticais; mostra “Δh” e necessidade de degraus.
* **Aplicar**: cria/atualiza geometria, **degraus automáticos** quando Δh > passo; atualiza colisões/routing.

**Guardas / Validações**

* **Limites**: não ultrapassar paredes estruturais sem união válida; respeitar portas (não bloquear swing) e janelas (sem cortar).
* **Altura**: dentro do range suportado; degrau obrigatório quando Δh excede altura máxima por passo.
* **Conectividade**: se plataforma cria desnível em passagem crítica, sugerir/gerar degraus; bloquear se impossível.
* **Bordas**: se “guarda-corpo obrigatório” estiver ativo para Δh acima de N, exigir corrimão/guarda-corpo livre de colisões.
* **Colisão**: não intersectar objetos existentes sem mover/ajustar (oferecer auto-empurrão opcional, pós-MVP).
* **Orçamento/Estoque**: custo de piso + guarda-corpo + degraus; bloquear se insuficiente.

**Snapping & Controles**

* **Snap** ao grid (1/½/¼); **Alt** = desenho livre (sem snap).
* **Setas/Scroll** durante Ghost: ajusta **altura** em passos.
* **G**: alterna **guarda-corpo** nas bordas elegíveis.
* **Shift**: restringe retângulo ortogonal durante desenho.
* **Ctrl**: modo **apagar** plataforma existente no arrasto.
* **Enter** confirma; **Esc/RightClick** cancela.

**Mensagens comuns**

* “Diferença de altura exige degraus — adicione ou reduza Δh.”
* “Borda colide com \<objeto/porta>; ajuste o contorno.”
* “Guarda-corpo obrigatório acima de Δh=N.”
* “Fundos/estoque insuficientes para altura/guarda-corpo selecionados.”
