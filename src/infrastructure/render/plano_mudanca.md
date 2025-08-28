Proponho migrar para um modelo “R3F como fonte única de renderização” e isolar nosso loop/estado — sem criar WebGLRenderer manualmente. Abaixo o plano completo, incremental e com rastreabilidade.

Decisão

Fonte de renderização: React Three Fiber + Drei (Canvas/Scene/Camera gerenciados pelo R3F).
Nosso “RenderSystem” passa a ser um “FrameLoop/RenderLoop” headless (callbacks + métricas), acionado pelo useFrame do R3F.
Mantemos o adapter WebGLRenderer apenas para cenários não‑React (ferramentas/headless), via DI.
Motivações

Evitar duplicação de responsabilidades e múltiplas instâncias de Three (warning observado nos testes).
Eliminar a fragilidade em jsdom (erro ao criar contexto WebGL; ver tests/unit/Application.test.ts).
Alinhar com o REFAC e CONTEXT (R3F como stack de UI e render).
Plano de Migração

Preparação e Mitigação
Objetivo: estabilizar a suíte enquanto migramos.
Opção rápida: tornar o adaptador createWebGLRenderAdapter no‑op em ambientes sem WebGL para remover a falha dos testes no jsdom (sem alterar a UI). Arquivo: src/infrastructure/render/createWebGLRenderAdapter.ts:1–20. Se preferir pular este passo, seguimos direto ao passo 2.
Referência de problema: src/index.tsx:17 chama application.resolve("renderSystem").start(); e dispara o erro no adapter.
Introduzir um Loop de Render Próprio (headless)
Criar core/types/render/RenderLoop.ts: interface minimalista com addCallback, removeCallback, tick(delta), getStats(). Referência do contrato atual de stats: src/core/types/render/RenderSystem.ts:71.
Implementar infrastructure/render/RenderLoop.ts: armazena callbacks, mede delta/FPS, não conhece Three/Canvas.
Justificativa: cumpre .cursorrules (simplicidade e reusabilidade) e remove acoplamento com renderer (/.cursor/.cursorrules
–16, 23–26).
Bridge com R3F
Criar src/presentation/providers/RenderLoopProvider.tsx:
Usa useFrame((_, delta) => renderLoop.tick(delta)) para dirigir nosso loop.
Injeta renderLoop via contexto/Application.
Criar src/presentation/bridges/SceneBridge.tsx:
const { scene, camera } = useThree() e publica via EventBus: sceneStateChanged/cameraUpdated quando necessário.
Futuro: coordenar modos de câmera com componentes do Drei (PerspectiveCamera/OrthographicCamera) ao invés do factory interno. Hoje, nosso CameraSystem cria a câmera (ver src/infrastructure/render/CameraSystem.ts:26–35).
Ajustar Inicialização da Aplicação (UI Path)
Em src/Application.ts:59–68, deixar de injetar adapter WebGL quando a UI React estiver ativa. Alternativas:
A) Por DI, escolher entre RenderSystem (headless/offscreen) e RenderLoop (UI/R3F). UI usa RenderLoop. Ferramentas headless seguem com RenderSystem.
B) Remover totalmente RenderSystem do caminho UI.
Em src/index.tsx:17, remover renderSystem.start() e, no lugar, garantir que o RenderLoopProvider esteja montado dentro do <Canvas>.
Atualizar src/presentation/App.tsx para incluir <RenderLoopProvider/> e <SceneBridge/> dentro do <Canvas>; manter GridLayer já adicionado.
Câmera: integração com R3F/Drei
Evoluir CameraSystem para aceitar uma câmera externa do R3F (método setExternalCamera(camera)), deixando de fabricar internamente quando em modo UI.
Hoje: fabrica via defaultCameraFactory (ver src/infrastructure/render/CameraSystem.ts:90+).
Com UI: Drei fornece a câmera; CameraSystem passa a notificar/gerenciar gestos e emitir cameraUpdated usando a instância externa.
Adicionar componentes de câmera do Drei (<PerspectiveCamera makeDefault/> e <OrthographicCamera makeDefault/>) e alternar via estado/eventos cameraModeChanged.
Atualizar Testes
Atualizar tests/unit/Application.test.ts para não depender de criação de WebGLRenderer na inicialização da UI.
Se mantivermos RenderSystem para cenários headless, os testes unitários de RenderSystem continuam válidos (já passam hoje).
Adicionar testes do RenderLoop (tick, callbacks, métricas) e do RenderLoopProvider (simular useFrame com stub).
Revisar tests/integration/RenderSystem.integration.test.ts: mantê-lo para caminho headless (já mocka WebGLRenderer, está passando).
Deprecar Caminho Antigo (UI)
Marcar createWebGLRenderAdapter como “não usado no modo UI”.
Remover renderSystem do container da UI quando concluirmos a migração (arquivo: src/Application.ts).
Documentar no README.md a arquitetura final de render (R3F owner; nossos sistemas são headless/event-driven).
Critérios de Aceite

UI renderiza via R3F/Drei sem WebGLRenderer manual.
Nenhum erro de WebGL no jsdom nos testes de UI.
RenderLoop fornece estatísticas similares às do RenderSystem (renderCount, lastRenderDelta/FPS).
CameraSystem opera sobre a câmera do R3F quando em modo UI (modo “persp/ortho” suportado).
GridLayer e demais camadas renderizam normalmente dentro do <Canvas>.
Impacto e Riscos

Alterar Application.ts e index.tsx muda o bootstrap; mitigado com DI e migração gradual.
CameraSystem precisará suportar câmera externa; tratar cuidadosamente eventos cameraModeChanged e “controls toggled”.
