# Plano de Migração — R3F como Owner de Renderização

Objetivo: Tornar o R3F/Drei o dono 100% da renderização, mantendo Core/Domain/Application headless e removendo o caminho legado de renderização manual.

## Fase 1 — Corte do Caminho Antigo (concluída)
- [x] Remover uso de `RenderSystem` no caminho da UI
  - `src/Application.ts` — não instancia mais `RenderSystem`/`RenderSync`/`RenderObjectManager` (ver imports e container)
- [x] Remover export de `RenderSystem` e do adapter do barrel `infrastructure/render/index.ts`
  - `src/infrastructure/render/index.ts:1` — removidos exports de `RenderSystem` e `createWebGLRenderAdapter`
- [x] Ajustar `Application` para não criar `RenderSystem`, `RenderSync`, nem `RenderObjectManager` para UI
  - `src/Application.ts` — container registra apenas `eventBus`, `commandStack`, `entityManager`, `cameraSystem`, `cameraController`, `renderLoop`
- [x] Atualizar testes unitários de `Application` para novos contadores de listeners
  - `tests/unit/Application.test.ts` — atualizados counts de `cameraModeChanged` e removido reset do `RenderSystem`
- [x] Remover testes do `RenderSystem` (unit e integration)
  - `tests/unit/render/RenderSystem.test.ts` removido
  - `tests/integration/RenderSystem.integration.test.ts` removido

## Fase 2 — Camadas R3F de Domínio (detalhada)

Prioridade: R3F/Drei é o owner da cena; Core/Domain permanecem headless. Use EventBus para sincronizar.

- [x] Hook `useRenderObjects`
  - Arquivo: `src/presentation/hooks/useRenderObjects.ts`
  - Objetivo: observar o `EventBus` e manter em estado local o mapa `{ entityId -> RenderComponent }`.
  - Onde buscar contratos:
    - `src/core/types/components/RenderComponent.ts` — shape e API do componente
    - `src/core/types/events/EntityEvents.ts` — eventos `componentAdded/componentRemoved/entityDestroyed`
    - `src/domain/entities/EntityManager.ts:176` (componentAdded), `:203` (componentRemoved), `:133` (entityDestroyed)
  - Implementação sugerida:
    - Receber `eventBus` e `entityManager` (via `application.resolve(...)` ou hook `useApplication` em `src/presentation/hooks/useApplication.ts:11`).
    - Inicialização: hidratar estado inicial consultando `entityManager.getEntitiesWithComponent("RenderComponent")` (`src/domain/entities/EntityManager.ts:272`). Extrair o `RenderComponent` de cada entidade.
    - Subscrições: on `componentAdded` se `component.type === "RenderComponent"` → add/atualiza; on `componentRemoved` com `componentType === "RenderComponent"` → remove; on `entityDestroyed` → remove.
    - Retorno: `{ list: Array<{entityId, component}>, map: Map<EntityId, RenderComponent> }`.

- [x] Camada `ObjectsLayer`
  - Arquivo: `src/presentation/layers/ObjectsLayer.tsx`
  - Objetivo: materializar a lista do `useRenderObjects` em JSX (R3F).
  - Regras de renderização:
    - Se `component.modelUrl` existir: use `@react-three/drei` `useGLTF` (lazy) e `primitive` para instanciar; caso contrário, use uma geometria simples (ex.: `boxGeometry`).
    - Aplicar `component.visible`, `component.color` e `component.material` (mapear para `meshStandardMaterial`/`meshBasicMaterial` conforme `material.type`).
    - Key estável por `entityId`.
  - Integração:
    - Importar o hook `useRenderObjects` e iterar `list` para renderizar.
    - Emissão de eventos de interação (ex.: `onPointerDown`) deve publicar no `EventBus` (ver `src/presentation/layers/ControlsLayer.tsx:28` como referência de emissão `cameraUpdated`).

- [ ] Camada `WallsLayer`
  - Arquivo: `src/presentation/layers/WallsLayer.tsx`
  - Objetivo: renderizar paredes com base no estado do domínio.
  - Contratos do domínio (CONTEXT.md): parede possui `{ start: Vec3; end: Vec3; height: number }`.
  - Duas opções (escolher a mais simples):
    1) Representar paredes como entidades com `RenderComponent` já configurado (mais simples, menos acoplamento). A lógica geométrica (comprimento/espessura) vira transform/escala da malha. O domínio mantém os dados sem que a UI precise conhecer tipos de parede.
    2) Introduzir `WallComponent` explícito no domínio:
       - Tipos: `src/core/types/components/WallComponent.ts` (novo) com shape do CONTEXT.md.
       - Implementação: `src/domain/components/WallComponent.ts` com API imutável e validações.
       - Registro no sistema de componentes: `src/domain/components/ComponentSystem.ts:209` (seguir padrão do `RenderComponent`).
       - Hook `useWalls` análogo ao `useRenderObjects` que observa `componentAdded/Removed` para `WallComponent` e fornece lista para a camada.
  - Renderização: utilizar `<mesh>` com geometria extrudada/box para cada parede; orientação pelo vetor `end-start`; altura mapeada na escala Y.

- [ ] Camada `FloorLayer`
  - Arquivo: `src/presentation/layers/FloorLayer.tsx`
  - Objetivo: renderizar pisos com base no domínio.
  - Contratos (CONTEXT.md): piso possui `{ position: Vec3; size: Vec3; material: string }`.
  - Mesma decisão das paredes:
    - Opção simples: modelar via `RenderComponent` (transform + material).
    - Opção explícita: `FloorComponent` (tipos/implementação/registro análogos a `WallComponent`).
  - Renderização: `<mesh>` plano/box conforme `size`, posicionado em `position`.

- [x] Integrar camadas ao `App.tsx`
  - Arquivo: `src/presentation/App.tsx:18`
  - Inserir `<ObjectsLayer/>`, `<WallsLayer/>`, `<FloorLayer/>` dentro do `<Canvas>`, após `<ControlsLayer/>` e `<GridLayer/>`.

- [x] Testes das camadas (ObjectsLayer)
- [ ] Testes das camadas (WallsLayer/FloorLayer)
  - Criar: `tests/unit/presentation/ObjectsLayer.test.tsx`, `WallsLayer.test.tsx`, `FloorLayer.test.tsx`.
  - Estratégia: mockar `useRenderObjects`/`useWalls`/`useFloors` para controlar fixtures; montar com `@testing-library/react` e `@react-three/fiber` test utils; validar número de meshes e props principais (`visible`, `color`).

## Fase 3 — Consolidação e Documentação (detalhada)

- [x] Testes do `RenderLoop`
  - Arquivo: `tests/unit/infrastructure/RenderLoop.test.ts`
  - Casos: registra callback, chama `tick(delta)` e verifica contadores (`renderCount`, `lastRenderDelta`, `lastRenderFPS`); remove callback e garantir que não é chamado.
  - Referência: `src/infrastructure/render/RenderLoop.ts:7`.

- [x] Testes do `RenderLoopProvider`
  - Arquivo: `tests/unit/presentation/RenderLoopProvider.test.tsx`
  - Estratégia: mockar `useFrame` para capturar função; injetar um `renderLoop` fake via `application.resolve` (ou criar provider de contexto); verificar que `tick` é chamado com deltas passados pelo stub.
  - Referência: `src/presentation/providers/RenderLoopProvider.tsx:9`.

- [x] Atualizar README
  - Seção “Arquitetura de Renderização”: declarar que R3F/Drei é o owner do loop e objetos Three; sistemas internos são headless e event-driven (EventBus) — ver `src/presentation/bridges/SceneBridge.tsx:9` e `src/presentation/layers/CameraLayer.tsx:1`.

- [x] Revisar remoção/isolamento de artefatos não usados na UI
  - Removidos: `RenderSystem`, `createWebGLRenderAdapter`, `RenderSync`, `SceneManager`, `RenderObjectManager` e testes relacionados.

## Como rodar e validar
- Lint: `pnpm lint`
- Testes: `pnpm vitest --run`
- Verificar ciclos: `npx -y madge --circular src --extensions ts,tsx --ts-config tsconfig.json`

## Referências rápidas
- EventBus: `src/core/events/EventBus.ts:6`
- EntityManager (emissão de eventos): `src/domain/entities/EntityManager.ts:176`, `:203`, `:133`
- RenderComponent (tipos): `src/core/types/components/RenderComponent.ts:9`
- Bridges/Layers existentes: `src/presentation/bridges/SceneBridge.tsx:9`, `src/presentation/layers/CameraLayer.tsx:1`, `src/presentation/layers/ControlsLayer.tsx:1`, `src/presentation/layers/GridLayer.tsx:7`

Notas de aderência
- Simplicidade e mudanças mínimas (/.cursor/.cursorrules)
- Core/Domain/Application permanecem headless (CONTEXT.md)
- UI React é a fonte única do ciclo de vida de objetos Three (boas práticas R3F/Drei)
