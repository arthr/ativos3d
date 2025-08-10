### Roadmap de Melhorias (Ativos3D)

- Última atualização: 2025-08-10

### Visão Geral

- **Arquitetura**: consolidar mediadores de input, separar responsabilidades do `Stage`, formalizar Command/Strategy e camadas de render.
- **Qualidade**: tipagem estrita, ESLint/Prettier, remoção de `any`, slices do Zustand, testes.
- **Dados**: validação do `catalog.json` (zod), normalização de footprints/slots, serialização versionada do lote.
- **Interação/UX**: controles de câmera (pan/zoom/ortho), picking/hover estável, atalhos.
- **3D/Perf**: instancing, culling, índice espacial, validação de colisão, tone mapping e assets GLTF/KTX2.

### Tarefas Detalhadas

#### Estratégias adotadas (P0)

- **Validação em dois estágios**: checagem rápida via `SpatialIndex` (grid hashing) + confirmação com `validatePlacement`.
- **Cache do índice**: reconstrução do `SpatialIndex` somente quando a referência de `objects` mudar.
- **Command centralizado**: todas ações mutáveis usam `executeCommand`.

#### 1) Controladores e Eventos

- [ ] Extrair `InputController` do `Stage` para montagem em nível de app (quando houver múltiplos stages)
  - Arquivos: `src/systems/render/Stage.tsx`, `src/app/App.tsx`
  - Critérios: um único `InputController` ativo; nenhum leak de listeners; comentário TODO removido
- [ ] Unificar publicação de eventos e estado: garantir que eventos do `eventBus` espelhem o `useStore.input`
  - Arquivos: `src/systems/controllers/InputController.tsx`, `src/core/events.ts`
  - Critérios: testes unitários simples para `pointerDown/Up`, `keyDown/Up`, `click`

#### 2) Padrão Strategy para Ferramentas

- [x] Padronizar interface `ToolStrategy` (ativação, cleanup, frame, preview) e garantir cleanup de todos os `eventBus.on`
  - Arquivos: `src/systems/tools/strategies/*.tsx`, `src/systems/tools/strategies/types.ts`, `src/systems/tools/ToolManager.tsx`
  - Critérios: trocar de ferramenta não mantém listeners; adicionar smoke test manual
- [x] Completar estratégias: `move`, `wall`, `floor`, `bulldoze`, `eyedropper`
  - Arquivos: `src/systems/tools/strategies/*`
  - Critérios: operações básicas funcionando; integração com undo/redo em ações discretas (movimento contínuo será coalescido na seção 3)
  
  Novas tarefas:
  - [x] Otimizar reconstrução do índice no `MoveStrategy` para não ocorrer a cada frame (reutilizar cache quando `objects` não muda)
    - Arquivos: `src/systems/tools/strategies/MoveStrategy.tsx`
    - Critérios: manter suavidade do drag com cenas maiores

#### 3) Command Pattern e Undo/Redo

- [x] Centralizar execução via `core/commandStack.executeCommand`
  - Arquivos: `src/core/commandStack.ts`, chamadas nas estratégias
  - Critérios: todas ações mutáveis passam por `executeCommand`
- [ ] Coalescer movimento (drag) em um único comando por interação (commit no `pointerUp`) e garantir undo/redo do deslocamento
  - Arquivos: `src/systems/tools/strategies/MoveStrategy.tsx`, `src/store/useStore.ts`, `src/core/commandStack.ts`
  - Critérios: 1 entrada no histórico por movimento; desfaz/refaz deslocamento completo; sem jank durante drag
  - Status: implementado (MVP)
- [x] Limite de histórico (ex.: 100 comandos)
  - Arquivos: `src/store/useStore.ts`
  - Critérios: prevenção de OOM; histórico estável

#### 4) Store (Zustand)

- [ ] Remover `any`/casts indevidos nos componentes/estratégias
  - Arquivos: `src/systems/render/Stage.tsx`, `src/systems/render/ObjectsLayer.tsx`, `src/systems/tools/strategies/*`
  - Critérios: build sem `any` implícitos; tipagem de eventos/payloads
- [ ] Fatiar estado em slices (camera, input, scene, ui)
  - Arquivos: `src/store/useStore.ts`
  - Critérios: melhor legibilidade; selectors estáveis

#### 5) Renderização e Cena

- [ ] Separar responsabilidades do `Stage` (setup renderer/câmera, luzes, controles) em subcomponentes
  - Arquivos: `src/systems/render/Stage.tsx`
  - Critérios: `Stage` enxuto; fácil troca de câmera (persp/ortho)
- [ ] Implementar controles customizados de pan/zoom e modo ortográfico opcional
  - Arquivos: `src/systems/render/Stage.tsx`
  - Critérios: toggle persp/ortho; pan com Space; TODO removido
- [x] Padronizar `userData` em inglês (ex.: `idObjeto` -> `objectId`)
  - Arquivos: `src/systems/render/ObjectsLayer.tsx`
  - Critérios: consistência i18n no runtime

#### 6) Validação de Colocação (Placement)

- [x] Completar `validatePlacement` com AABB básico e bounds do lote (MVP)
  - Arquivos: `src/core/placement.ts`, `src/core/geometry.ts`, `src/core/types.ts`
  - Critérios: impedir interpenetração; mensagens de erro curtas; TODOs removidos (parcial)
- [x] Integrar validação na estratégia `place` (preview com feedback `valid/invalid`)
  - Arquivos: `src/systems/tools/strategies/PlaceStrategy.tsx`
  - Critérios: cor/outline no preview indicando validade

#### 7) Índice Espacial e Performance

- [x] Implementar `SpatialIndex` (grid hashing) para queries e colisão
  - Arquivos: `src/core/spatialIndex.ts`
  - Critérios: `insert/query` eficientes; remover TODO de placeholder
- [x] Integrar `SpatialIndex` ao `PlaceStrategy` para validação rápida
  - Arquivos: `src/systems/tools/strategies/PlaceStrategy.tsx`
  - Critérios: early-out em colisões; sem regressão de UX
- [x] Integrar `SpatialIndex` ao `MoveStrategy` para validar sobreposição durante drag
  - Arquivos: `src/systems/tools/strategies/MoveStrategy.tsx`
  - Critérios: impedir mover para posição inválida sem travar interação
- [x] Pré-validação de colisão no preview de `Wall` (MVP com AABB unitários)
  - Arquivos: `src/systems/tools/strategies/WallStrategy.tsx`
  - Critérios: feedback visual (vermelho) ao intersectar

  Novas tarefas:
  - [ ] Usar footprints reais dos objetos na validação de colisão do preview de `Wall` (parcial: índice centralizado criado)
    - Arquivos: `src/systems/tools/strategies/WallStrategy.tsx`, `src/core/geometry.ts`
    - Critérios: reduzir falsos positivos/negativos

#### 13) SRP e Reutilização

- [x] Extrair util compartilhado para índice espacial de objetos (`buildObjectAabbIndex`)
  - Arquivos: `src/core/sceneIndex.ts`
  - Critérios: Place/Move/Wall usando util; menos duplicação
- [ ] Usar `@react-three/drei/Instances` para piso e avaliar instancing para objetos repetidos
  - Arquivos: `src/systems/render/FloorLayer.tsx`, `ObjectsLayer.tsx`
  - Critérios: menor custo de draw calls; sem regressão visual
- [ ] Culling simples (frustum) e opção de desligar sombras em massa
  - Arquivos: `src/systems/render/*`
  - Critérios: ganho de FPS em lotes grandes

#### 8) Catálogo e Assets

- [ ] Validar `catalog.json` com zod; normalizar footprints/slots
  - Arquivos: `src/core/catalog.ts`, `catalog.json`
  - Critérios: throw em schema inválido; tipos alinhados a `core/types.ts`
- [ ] Suporte a GLTF/GLB (Draco/Meshopt) e KTX2 para texturas
  - Arquivos: `src/systems/render/ObjectsLayer.tsx`, assets em `src/assets/models/`
  - Critérios: carregamento lazy; fallback para caixa quando sem modelo

#### 9) Serialização

- [ ] Expandir `exportLot/importLot` para cobrir `Lot3D` completo e versionamento
  - Arquivos: `src/core/serialization.ts`, `src/core/types.ts`
  - Critérios: round-trip fiel; version bump documentado
- [ ] Botões de exportar/importar + thumbnail da cena
  - Arquivos: `src/ui/*`, `src/app/*`
  - Critérios: JSON válido; imagem via `gl.domElement.toDataURL()`

#### 10) UI/HUD e Fluxo

- [ ] Revisar HUDs (`Topbar`, `Toolbar`, `InspectorHud`, `CatalogHud`) e eventos para evitar conflitos com picking
  - Arquivos: `src/ui/*`, `src/systems/tools/toolUtils.ts`
  - Critérios: `isHudEventTarget` confiável; sem cliques vazando
- [ ] Reconciliação com `HudOverlay.tsx` removido (limpar referências ou recriar quando necessário)
  - Arquivos: grep por `HudOverlay`
  - Critérios: nenhum import quebrado; decisões registradas

- [x] Refino de seleção/picking no `Eyedropper` usando `userData.objectId` como fallback
  - Arquivos: `src/systems/tools/strategies/EyedropperStrategy.tsx`, `src/systems/render/ObjectsLayer.tsx`
  - Critérios: seleção estável dos itens do catálogo
- [x] Bulldoze com raycast dedicado em objetos (usa `userData.objectId`), fallback para tile via ground
  - Arquivos: `src/systems/tools/strategies/BulldozeStrategy.tsx`
  - Critérios: hover consistente em cenas densas

#### 11) Qualidade de Código e Build

- [x] Adicionar ESLint + Prettier + scripts
  - Arquivos: `package.json`, `.eslintrc`, `.prettierrc`
  - Critérios: lint sem erros; format consistente
- [x] `tsconfig` estrito (`strict: true`, `noImplicitAny`, `exactOptionalPropertyTypes`)
  - Arquivos: `tsconfig.json`
  - Critérios: build sem erros com flags ativas

#### 12) Testes

- [ ] Unitários para `geometry`, `placement`, `events` e slices do store
  - Arquivos: `src/core/*.ts`, `src/store/useStore.ts`
  - Critérios: cobertura básica (>60%)
- [ ] Testes de interação (playwright) para ferramentas principais
  - Critérios: place/move/bulldoze com undo/redo

### Consolidado de TODOs Mapeados

- `src/systems/render/Stage.tsx`: mover `InputController`; adicionar controles pan/zoom custom; tipar refs/handlers e remover `any`
- `src/core/catalog.ts`: validar schema em runtime (zod)
- `src/systems/tools/strategies/WallStrategy.tsx`: usar footprints reais no preview de colisão
- `src/systems/tools/strategies/MoveStrategy.tsx`: coalescer drag em comando único no `pointerUp` e garantir undo/redo
- `src/store/useStore.ts`: limite do histórico (ex.: 100) e compressão quando aplicável
- `src/core/placement.ts`: clearance, needs_wall, slots; lot bounds por argumento; buscar footprint por `defId`
- `README.md`: completar ferramentas; pipeline de validação 3D; evoluir `catalog.json`; export/import + thumb; lint/format

### Prioridades (P0–P2)

- **P0**: Mover `InputController` para `App`; coalescer movimento em comando e limitar histórico; remover `any` críticos; `validatePlacement` e `SpatialIndex` básicos já integrados
- **P1**: Controles ortho/pan/zoom; zod no catálogo; serialização completa; HUDs estáveis; instancing piso
- **P2**: GLTF/KTX2; culling/shadows toggles; testes e2e; instancing objetos; BVH/otimizações


