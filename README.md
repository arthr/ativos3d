### Ativos3D – MVP Builder 3D

Aplicação SPA para construir um cômodo em grade 3D (plano XZ), posicionar objetos do catálogo, pintar piso, traçar paredes, com validação básica de colocação e histórico de ações (undo/redo). Data‑driven em JSON (`catalog.json` e export/import de lote).

### Stack
- **Base**: React 19 + TypeScript + Vite
- **3D**: React Three Fiber (Three.js) + `@react-three/drei`
- **Estado**: Zustand (undo/redo com Command Pattern)
- **Utilidades**: Zod para validar `catalog.json`, `r3f-perf` para monitor de performance

### Como rodar
```bash
pnpm install
pnpm dev
# abrir http://localhost:5173
```

### Funcionalidades (MVP)
- **Ferramentas**: `place`, `move`, `wall`, `floor`, `bulldoze`, `eyedropper`
  - Place: posiciona item do catálogo com preview e validação de colisão/bordas
  - Move: arrasta item selecionado com validação em tempo real; rota com R
  - Wall: desenha paredes ortogonais por arraste (preview com detecção simples de colisão)
  - Floor: pinta um tile de piso por clique
  - Bulldoze: remove objeto com raycast ou limpa tile do piso
  - Eyedropper: coleta tipo do objeto sob o cursor e alterna para `place`
- **HUD/UI**: Topbar (câmera e ações de arquivo), BudgetBar, Toolbar (modos e ferramentas), Catálogo (seletor de item), Inspector flutuante ancorado ao objeto selecionado
- **Arquivos**: exporta/importa o lote em JSON e exporta thumbnail PNG do Canvas
- **Validação**: índice espacial (grid hashing) para checagem rápida + validação AABB de bounds e colisões

### Controles e interação
- **Câmera**: Perspective/Orthographic via Topbar; pan segurando Space; rotação com botão direito (apenas no modo perspectiva); zoom habilitado
- **Ferramentas**:
  - Clique esquerdo executa ação da ferramenta ativa
  - Tecla R: rotaciona o item em `place`/`move` (Shift+R = −90°)
  - ESC: cancela preview/seleção em `place`
- **Undo/Redo**: botões na Toolbar. Atalhos de teclado globais para undo/redo ainda não foram mapeados no MVP

### Decisões de renderização
- Plano de trabalho: eixo XZ com Y para altura; 1 unidade = 1 tile
- Iluminação: `ambientLight` + `directionalLight` (sombras ativas)
- Color management: sRGB + ACESFilmic tone mapping
- Grid: `drei/Grid` centralizado no lote
- Instancing: `drei/Instances` para piso, paredes e objetos (caixas) no MVP

### Estrutura de pastas (atual)
```txt
/src
  /app
    App.tsx
    routes.tsx
  /assets
    /models
    /textures
  /core
    catalog.ts          # valida e expõe o catálogo (zod)
    commandStack.ts     # execução de comandos (undo/redo)
    events.ts           # event bus tipado
    geometry.ts         # AABB/rotação/auxiliares
    modeMachine.ts      # modos ⇄ ferramentas e cursores
    placement.ts        # validação de colocação (bounds/colisão)
    sceneIndex.ts       # util para índice AABB de objetos
    serialization.ts    # export/import versionado
    spatialIndex.ts     # índice espacial (grid hashing)
    types.ts            # modelos de dados 3D
  /store
    useStore.ts         # Zustand + histórico/undo/redo
  /systems
    /controllers
      InputController.tsx
    /render
      StageLayer.tsx
      GridLayer.tsx
      FloorLayer.tsx
      WallsLayer.tsx
      ObjectsLayer.tsx
      index.ts
    /tools
      toolUtils.ts
      ToolManager.tsx
      /strategies
        types.ts
        PlaceStrategy.tsx
        MoveStrategy.tsx
        WallStrategy.tsx
        FloorStrategy.tsx
        BulldozeStrategy.tsx
        EyedropperStrategy.tsx
  /ui
    /components         # Button, Panel, ToolbarGroup, tokens
    /hooks              # useCurrencyBRL
    /hud
      /Budget/BudgetBar.tsx
      /Catalog/{CatalogContainer.tsx, CatalogPanel.tsx}
      /Topbar/{Topbar.tsx, CameraModeToggle.tsx, FileActions.tsx}
      HudRoot.tsx
      index.ts
    /inworld/Inspector  # Inspector flutuante (Html)
      {Panel.tsx, view.tsx, index.ts}
  index.css
  main.tsx
```

### Catálogo (`catalog.json`)
- Validado em runtime com Zod em `core/catalog.ts`
- Campos principais: `id`, `name`, `price`, `category`, `tags`, `variants?`, `footprint?` (box|poly), `slots?`, `art?`
- MVP renderiza objetos como caixas dimensionadas pelo `footprint`. Texturas/modelos GLTF ainda são roadmap

### Serialização e ações de arquivo
- Exporta o lote atual como JSON versionado (`core/serialization.ts`)
- Importa lote de um arquivo `.json`
- Exporta thumbnail PNG do Canvas
- UI: ver Topbar → Exportar/Importar/Thumbnail ou usar serviços em `ui/services/fileActions.ts`

### Qualidade e scripts
- TypeScript estrito (`strict: true`)
- Lint/format:
```bash
pnpm lint
pnpm format
```

### Documentação complementar
- Mecânica: `docs/build_mechanics.md`
- Modelos: `docs/data_models.md`
- Pipeline de validação: `docs/validation_pipeline.md`
- Boas práticas 3D/R3F: `docs/boas_praticas_3d.md`
- Mapa do repositório: `docs/repo_map.md`
- Roadmap: `docs/roadmap_melhorias.md`

### Limitações e próximos passos
- Validação: ainda não aplica `clearance`, `needs_wall` e `requires_slots` — ver roadmap
- Render: objetos em GLTF/texturas (KTX2/Basis) ainda pendentes; piso não aplica texturas
- Atalhos globais de teclado para troca de ferramenta/undo/redo não estão implementados