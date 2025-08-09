# Ativos3D – MVP Builder 3D

SPA para construir um cômodo em grade 3D (plano XZ), posicionar objetos do catálogo, pintar piso, traçar paredes, com validação de colocação e undo/redo. Tudo data‑driven em JSON.

## Stack
- React + TypeScript + Vite
- React Three Fiber (Three.js)
- Zustand

Dependências opcionais: nenhuma no MVP. O projeto usa `OrbitControls` da Three (via `three/examples`), sem `@react-three/drei`.

## Decisões de Renderização
- Câmera ortográfica top‑down com leve tilt (isométrico leve): posição padrão `[20, 20, 20]`, apontando para `[0, 0, 0]`.
- Plano de trabalho em XZ (Y = altura). Grid renderizado com `gridHelper`.
- Unidades: 1 unidade = 1 tile.

## Atalhos
- 1 Place, 2 Move/Rotate, 3 Wall, 4 Floor, B Bulldoze, E Eyedropper, R Rotaciona
- Ctrl+Z / Ctrl+Y: Undo/Redo

## Estrutura de Pastas (inicial)
```
/src
  /app
    App.tsx
    routes.tsx
  /store
    useStore.ts
  /core
    types.ts
    catalog.ts
    spatialIndex.ts
    placement.ts
    commandStack.ts
    geometry.ts
    serialization.ts
  /systems
    /render
      Stage.tsx
      Grid.tsx
      WallsLayer.tsx
      FloorLayer.tsx
      ObjectsLayer.tsx
    /tools
      PlaceObjectTool.tsx
      MoveRotateTool.tsx
      PaintFloorTool.tsx
      WallTool.tsx
      BulldozeTool.tsx
      EyedropperTool.tsx
  /ui
    CatalogPanel.tsx
    Toolbar.tsx
    Inspector.tsx
    BudgetBar.tsx
    Topbar.tsx
main.tsx
index.css
```

## Como Rodar
1. `pnpm install`
2. `pnpm dev`
3. Abrir `http://localhost:5173`

## Catálogo
- Edite `catalog.json`. O MVP atual aceita os campos existentes e será evoluído para 3D (modelos/texturas) conforme `prompt_inicial.md`.

## Documentação
- Mecânica: `docs/build_mechanics.md`
- Modelos: `docs/data_models.md`
- Pipeline de validação: `docs/validation_pipeline.md`
- Mapa do repo: `docs/repo_map.md`

## Próximos Passos
- Completar ferramentas (Place/Move/Wall/Floor) e pipeline de validação 3D
- Evoluir `catalog.json` para footprints 3D (box/poly) e slots em XZ
- Implementar export/import e geração de thumbnail (`gl.domElement.toDataURL()`)