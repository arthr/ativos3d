Vamos adotar R3F/Drei como dono 100% da renderização, dá para remover o que não é aderente e ainda cumprir o objetivo do CONTEXT.md. S

Plano de migração enxuto priorizando boas práticas:

Viabilidade

Core/Domain/Application seguem headless (eventos, comandos, validação, geometria) sem dependência de Three/React — aderente ao CONTEXT.md.
R3F/Drei controla ciclo de vida, loop e objetos Three — já operante em src/presentation/App.tsx:18, src/presentation/providers/RenderLoopProvider.tsx:9, src/presentation/bridges/SceneBridge.tsx:9, src/presentation/layers/CameraLayer.tsx:1, src/presentation/layers/ControlsLayer.tsx:1.
O que remover (UI R3F‑only)

RenderSystem e dependências:
src/infrastructure/render/RenderSystem.ts:22
src/infrastructure/render/createWebGLRenderAdapter.ts:7
src/infrastructure/render/RenderObjectManager.ts:19
src/infrastructure/render/RenderSync.ts:11
src/infrastructure/render/SceneManager.ts:10
Tipos relacionados: src/core/types/render/RenderSystem.ts:1, reexports em src/core/types/render/index.ts:6, src/infrastructure/render/index.ts:1
Integrações na Application (remover registros e imports):
src/Application.ts:12 (imports RenderObjectManager/RenderSync/RenderSystem/createWebGLRenderAdapter)
src/Application.ts:53 (getInstance RenderObjectManager)
src/Application.ts:58 (new RenderSync)
src/Application.ts:62 (getInstance RenderSystem + adapter)
src/Application.ts:117 (tipos do mapa de dependências)
Motivo: com R3F owner, não precisamos de um loop/adapter paralelo. Mantemos somente bridges/providers na camada Presentation.

Substituições mínimas (apoiando legacy/headless)

Se quiser manter um registro headless de “objetos renderizáveis” para o domínio:
Substituir RenderObjectManager + RenderSync por um hook em Presentation que observe EventBus e mantenha um mapa local:
presentation/hooks/useRenderObjects.ts (escuta renderObjectAdded/Updated/Removed e expõe lista).
presentation/layers/RenderObjectsLayer.tsx (consome hook e materializa JSX).
Caso não precise de registro genérico: mapear diretamente eventos de domínio para camadas R3F específicas (WallsLayer, FloorLayer, ObjectsLayer).
Impacto nos testes

Remover/atualizar testes que dependem do RenderSystem:
Deletar tests/integration/RenderSystem.integration.test.ts:12.
Ajustar tests/unit/Application.test.ts:39–53: asserções de cameraModeChanged assumem um listener adicional do RenderSystem. Sem RenderSystem, espere 1 antes e 1 depois do dispose() (apenas o CameraController).
Adicionar testes:
RenderLoop (se mantido como métrica): add/remove/tick/getStats.
RenderLoopProvider: stub de useFrame para verificar chamada a tick.
Camadas R3F críticas: alternância persp/ortho e OrbitControls emitindo cameraUpdated.
Plano de Migração (R3F‑only)

Fase 1 — Corte do caminho antigo
Remover RenderSystem, adapter e reexports. Limpar Application para não instanciar nada de render infra.
Atualizar tests/unit/Application.test.ts:39 para o novo count de listeners.
Remover tests/integration/RenderSystem.integration.test.ts:12.
Fase 2 — Camadas R3F para o legado
Criar presentation/hooks/useRenderObjects.ts (ou mapear eventos diretamente).
Criar presentation/layers/ObjectsLayer.tsx, WallsLayer.tsx, FloorLayer.tsx e adicioná-las no App.tsx:18.
Fase 3 — Consolidação e docs
Testes de RenderLoop/Provider e camadas.
Atualizar README com “R3F é o owner do render; bridges/headless para eventos/estado”.
Riscos e mitigação

Quebra de testes de integração do RenderSystem: substituímos por testes de camadas R3F.
jsdom/WebGL: eliminar o createWebGLRenderAdapter no caminho UI remove a causa (não dependemos mais dele).
HMR/StrictMode: manter cleanups nos useEffect (padrão já seguido em ControlsLayer.tsx:22 e CameraLayer.tsx:22).

Decisão

RenderSystem e seu adapter não são necessários no caminho R3F‑only; recomendo remova com a Fase 1 acima