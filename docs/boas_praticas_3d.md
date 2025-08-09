### Boas Práticas 3D e React Three Fiber

Estas diretrizes devem orientar decisões técnicas e revisões de código. Mantemos compatibilidade com o MVP atual (câmera ortográfica top‑down com tilt leve), mas a base recomenda câmera perspective para compor vistas isométricas quando apropriado.

## Fundamentos 3D (mínimo viável)
- Sistema de coordenadas/Unidades: Three.js padrão (Y up), unidades em metros; origem e orientação consistentes.
- Scene graph: organizar hierarquia por função/domínio (ex.: piso → paredes → objetos → overlays).
- Geometrias e Materiais (PBR): meshes simples primeiro; usar materiais Standard/Lambert; garantir UVs e normais corretos; considerar instancing para repetidos.
- Luz e sombras: luz direcional + ambiente; sombras suaves com parcimônia (custo alto); evitar overdraw.
- Câmera: preference por Perspective para vista isométrica; ortográfica custom é aceitável e documentada.

## React Three Fiber & Ecossistema
- R3F básico: `Canvas`, ciclo de render, `useFrame`, `useThree`.
- `@react-three/drei`: considerar helpers (Orbit/MapControls para ortho, `Html`, `Text`, `Bounds`, `Instances`).
- Instancing: `<Instances>`/`InstancedMesh` para milhares de ativos leves.
- Suspense/Lazy: carregamento assíncrono de modelos (GLTF) com fallback.

## Pipeline de modelos/objetos
- Formato: glTF/GLB com Draco/Meshopt; usar LOD quando necessário.
- Authoring guide: naming consistente, pivôs em (0,0,0), escala em metros, materiais padronizados.
- Tiles/particionamento para cena grande.
- Texturas: boas resoluções/atlas; evitar PNGs gigantes; preferir KTX2/Basis.

## Integração com app de ativos
- Mapeamento ID↔mesh: `mesh.userData.idObjeto` para rastreabilidade.
- Estado: Zustand/Jotai/Recoil; cache de ativos; seleção múltipla.
- Data layer: REST/GraphQL para consultas; WebSocket/SSE para telemetria/estado online.
- Sincronização duas vias: clique no 3D atualiza painel; filtros/seleção no painel refletem na cena.

## Interação & UX 3D
- Picking (raycaster): hover/seleção, highlights, outline.
- Controles ortho custom: pan e zoom por wheel/pinch; limitar rotação (ou presets 4 vistas).
- Tooltips/labels: `Html`/`Text` em screen/world space com culling.
- Context menu & ações: ficha do ativo, navegar até, agrupar.
- Minimapa/planta 2D: visão top‑down rápida.
- Acessibilidade: foco via teclado; ARIA para UI (não 3D).

## Performance & Qualidade
- Instancing & batching para repetidos.
- Culling: frustum + BVH (`three-mesh-bvh`) para raycast rápido em cenas grandes.
- LOD/decimação: longe = simples, perto = detalhado.
- Render budget: alvo 60 fps; limitar draw calls; sombras dinâmicas só quando necessário.
- Color management: Linear/sRGB, tone mapping e exposição consistentes.
- Profiling: React Profiler, Spector.js, painel de stats.

## Segurança & Operação
- Limites de carga: paginação/streaming; cancelamento de requests.
- Fallbacks: detectar WebGL2, reduzir qualidade; considerar caminho WebGPU futuro.

## Extras úteis
- Medidas & snapping: régua, snapping a grid/anchors.
- Decals/heatmaps: status/criticidade por cor sobre a planta.
- IFC/CAD: avaliar `ifc.js` → glTF no build quando houver BIM.
- Exportar visão: screenshot/relatório do estado selecionado.


