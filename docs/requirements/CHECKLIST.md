# Checklist Funcional

Aplicação de Ativos 3D inspirado no “SimsBuilder”(The Sims), **sem** recursos de Terreno, Piscina/Água, Telhados e Área Externa.

# Grupos & Modos

* [ ] **Modos**: Build (arquitetura interna), Buy (objetos), Seleção/Manipulação.
* [ ] **Controle de andares**: subir/descer piso; visibilidade de paredes (baixa/média/alta).
* [ ] **HUD global**: Desfazer/Refazer, Conta-gotas, Marreta, Pincel de Estilo, Pesquisa, Filtros, Fundos da Empresa.

# Catálogo & Busca

* [ ] **Navegação**: Por Departamento, Por Categoria, Coleções/Favoritos.
* [ ] **Filtros**: preço, categoria, disponibilidade, tags.
* [ ] **Ficha do item**: nome, preço, quantidade, dimensões/footprint, tags (pendente/mesa/parede), requisitos (alturas, slots), variações.

# Construção (interna)

* [ ] **Paredes/Sala**: linhas retas/diagonais; arrasto para fechar sala; Shift=preencher/estender, Ctrl=remover.
* [ ] **Meias-paredes e Arcos**: alturas predefinidas, ligação automática.
* [ ] **Portas/Janelas**: encaixe em parede, alturas (baixa/média/alta), centralização, inversão de dobradiça (quando aplicável).
* [ ] **Escadas**: retas/L/U; corte automático do piso; edição por gizmos; validação de pé-direito.
* [ ] **Plataformas (internas)**: degraus, offsets de altura, guarda-corpo opcional.
* [ ] **Revestimentos**: pisos e paredes; pincel/balde, flood-fill por sala, remover (Ctrl).

# Colocação & Edição de Objetos

* [ ] **Movimentar/Rotacionar**: 15°/45° e rotação livre.
* [ ] **Grade & liberdade**: grade inteira, ½, ¼; **Alt** para livre (sem snap).
* [ ] **Altura (parede)**: mover vertical (ex.: quadros/prateleiras).
* [ ] **Escala**: aumentar/reduzir quando suportado (decorativos).
* [ ] **Multiposição**: Shift para repetir; arrasto linear (ex.: cadeiras ao longo da mesa).
* [ ] **Inventário da empresa**: enviar/recuperar itens.
* [ ] **Multi-seleção**: laço/marquee, duplicar, vender em lote.
* [ ] **Mover sala**: pegar sala como módulo; mover/girar preservando portas/janelas/itens.

# Snapping (encaixe) & Slots

* [ ] **Snaps contextuais**: cadeiras ↔ notebook ↔ mesas, TVs ↔ paredes/suportes.
* [ ] **Slots de superfície**: prateleiras/mesas com posições discretas e ordenação (M para alternar slot).
* [ ] **Snaps em parede**: quadros/cartazes com linhas-guia e margens.
* [ ] **Alinhamento**: guias a cantos/centros de parede, meio de azulejo, repetição equidistante.

# Estados de Ferramenta & Feedback

* [ ] **Estados**: Idle, Hover, Ghost Preview, Válido, Inválido, Selecionado, Arrastando.
* [ ] **Ghost**: preview translúcido, cor verde/vermelha; **tooltips de erro** (ex.: “sem espaço lateral”).
* [ ] **Gizmos**: setas para alongar cômodo, curvas de escada, handles de plataforma.
* [ ] **Regra de custo/disponibilidade**: somatório em tempo real; orçamento suficiente? disponível em estoque? feedback.

# Regras de Validação (colocação)

* [ ] **Footprint**: colisão com paredes/objetos; tolerância por categoria (decor x grande).
* [ ] **Acessos (routing)**: objetos interativos exigem “approach slots” livres (frente/lados); checagem rápida de caminho até porta/escada.
* [ ] **Portas/Janelas**: exigem parede válida; espaçamento mínimo de quinas e entre si; altura compatível com pé-direito/rodapé.
* [ ] **Escadas**: início/fim livres; headroom mínimo; patamar quando necessário.
* [ ] **Plataformas**: diferença máxima de altura entre áreas; bordas sem obstrução.
* [ ] **Superfícies/slots**: pesos/tamanhos compatíveis; limite por slot.
* [ ] **Sobreposição forçada (debug)**: modo opcional que ignora colisões não-críticas.

# Regras de Edição por Sala

* [ ] **Shift**: preencher sala (pisos/revestimentos) ou repetição de item.
* [ ] **Ctrl**: borracha/remover revestimento.
* [ ] **Alt**: colocação livre (desliga snap enquanto pressionado).
* [ ] **F5**: alternar granularidade de grade (inteira/½/¼).

# Visualização & UX

* [ ] **Paredes**: alternar aberta/média/alta por piso.
* [ ] **Camadas**: esconder ex.: paredes para trabalhar sem visão obstruída.
* [ ] **Hora do dia**: alternar iluminação para pré-visualização.
* [ ] **Indicadores**: linhas de centro, distâncias, alinhamento de grupo.

# Desempenho (funcional, lado usuário)

* [ ] **Seleção precisa**: picking por prioridade (alvo, atrás do alvo, parede).
* [ ] **Culling**: ocultar objetos fora do cômodo ativo ao editar (qualidade ↑).
* [ ] **Undo/Redo profundo**: passos de ações (colocação, rotação, pintura, mover cômodo).

# Persistência & Biblioteca

* [ ] **Salvar/Carregar**: lote, sala, conjuntos modulares.
* [ ] **Blueprints**: salas predefinidss; aplicar/rodar/espelhar.
* [ ] **Histórico de edições**: para desfazer/recuperar sessões.

# Acessibilidade & Qualidade de Vida

* [ ] **Tooltips contextuais** e atalhos exibidos no HUD.
* [ ] **Snaps assistidos** com tecla para **inibir** temporariamente.
* [ ] **Mensagens de conflito** claras (por que não pode colocar).
