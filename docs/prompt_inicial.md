Objetivo

Implemente um MVP web (SPA) para construir um cômodo em uma grade no plano XZ (3D), posicionar/remover/mover/rotacionar objetos do catálogo, pintar piso, traçar paredes, com validação de colocação (colisão, encaixe, requisitos) e undo/redo. Tudo data‑driven em JSON. A câmera pode ser top‑down ortográfica ou isométrica leve (defina no README).

Stack (obrigatório)

- TypeScript + React + Vite
- React Three Fiber (Three.js) para renderização 3D
- Zustand para estado global
- ESLint + Prettier
- Sem backend: persistência local (LocalStorage/arquivo JSON)

Entregáveis

1. App rodando (pnpm dev) e build (pnpm build)
2. README com instruções, decisões e atalhos
3. Código organizado por domínios (core/systems/ui)
4. Catálogo JSON com ~20 itens (cadeira, mesa, estante, reunião, porta, janela, carpete, piso madeira/cerâmica, notebook, monitor, impressora, teclado, mouse, smart TV, vaso, etc.)
5. Export/Import do lote (JSON) + thumbnail (dataURL do canvas WebGL)

Escopo funcional do MVP

- Grade (mín. 30 x 50, 1 andar). Eixo Y é altura.
- Ferramentas:
  - Place Object (colocar do catálogo, preview verde/vermelho)
  - Move/Rotate (arrastar, R para rotacionar 90º em Y)
  - Remove (apagar objeto/parede/piso)
  - Paint Floor (pincel por tile)
  - Wall Tool (traçar paredes ortogonais por arrasto)
  - Copy (clonar definição/variante)
- Catálogo com categorias, busca e tags
- Validação em tempo real durante o hover:
  - Colisão por footprint 3D (box ou poly em XZ com altura)
  - Clearance (tiles livres ao redor, por item)
  - Requisitos:
    - needs_wall: encostado a parede/co-planar
    - door/window: apenas em segmento de parede
    - requires_slots:X: cadeiras encaixam em borda de mesa (slots)
- Undo/Redo ilimitado (em memória)
- Orçamento simples (soma de preços dos colocados)
- Mensagens de erro claras (ex.: “Requer parede”, “Colisão”, “Sem espaço frontal”)
- Salvar/Carregar lote e catálogo em JSON; gerar thumbnail do lote

Não escopo (MVP)

- Física, pathfinding, multiandar, iluminação complexa. Deixe hooks para futuro.

Arquitetura & Pastas

```
/src
  /app
    App.tsx
    routes.tsx
  /store
    useStore.ts   // Zustand (estado do lote, seleção, ferramenta, histórico)
  /core
    types.ts            // Tipos base
    catalog.ts          // Carrega catálogo, tipos CatalogItem
    spatialIndex.ts     // Octree simples p/ colisão + mapas de ocupação
    placement.ts        // Pipeline de validação
    commandStack.ts     // Padrão Command (execute/undo)
    geometry.ts         // Rotação/transform de footprints/slots (graus↔radianos)
    serialization.ts    // Export/Import + versionamento
  /systems/render
    Stage.tsx           // Canvas R3F + câmera + pan/zoom (useFrame)
    Grid.tsx            // Desenho da grade (plano XZ)
    WallsLayer.tsx      // Render de paredes (extrusão simples)
    FloorLayer.tsx      // Render de piso (tiles instanciados)
    ObjectsLayer.tsx    // Meshes dos objetos + preview fantasma
  /systems/tools
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
  /assets
    /models   // .glb/.gltf (opcional; pode usar geometria paramétrica)
    /textures // pisos, paredes, ícones
main.tsx
index.css
```

Modelos de dados (TypeScript)

```ts
export type Vec3 = { x: number; y: number; z: number };

export type Footprint3D =
  | { kind: "box"; w: number; d: number; h: number; clearance?: number }
  | { kind: "poly"; points: Vec3[]; clearance?: number };

export type Slot3D = {
  id: string;
  type: string;          // ex.: "chair_seat", "table_edge"
  localPos: Vec3;        // no espaço local do objeto
  yawDeg?: 0 | 45 | 90 | 135 | 180 | 225 | 270 | 315;
};

export type CatalogItem3D = {
  id: string;
  name: string;
  price: number;
  category: "seating" | "surface" | "bed" | "decor" | "door" | "window" | "light" | "floor";
  tags: string[];        // ex.: ["needs_wall"], ["snap_to_wall"], ["requires_slots:table_edge"]
  variants?: string[];   // swatches (cores/texturas)
  footprint?: Footprint3D;
  slots?: Slot3D[];
  art?: { modelUrl?: string; texture?: string; color?: string };
};

export type PlacedObject3D = {
  id: string;            // uuid
  defId: string;         // CatalogItem3D.id
  pos: Vec3;             // espaço do lote (tiles → metros conceituais)
  rot: { x: number; y: number; z: number }; // graus; converter p/ rad no render
  variant?: string;
};

export type WallSegment3D = {
  ax: number; ay: number; az: number;
  bx: number; by: number; bz: number;
};

export type FloorTile3D = { x: number; z: number; tex: string };

export type Lot3D = {
  width: number;   // X
  depth: number;   // Z
  height: number;  // Y máximo do cômodo (ex.: 3)
  objects: PlacedObject3D[];
  walls: WallSegment3D[];
  floor: FloorTile3D[];
  budget: { funds: number; spent: number };
  version: number;
};
```

Pipeline de validação (implementar)

1. Snap (grid/paredes/slots) em 3D
2. Colisão: footprint rotacionado vs. indexação espacial (octree + AABB)
3. Clearance: tiles vizinhos livres (buffer em XZ)
4. Requisitos:
   - needs_wall: parede colinear/co-planar atrás
   - door/window: substituir segmento de parede existente
   - requires_slots:X: se X for table_edge, localizar slot livre na mesa mais próxima
5. Retorno: `{ ok: boolean; reason?: string; warnings?: string[] }`

Helpers (3D)

- `rotateFootprint3D(fp, rotDeg): Footprint3D`
- `footprintAABB3D(fp, pos): {min:Vec3,max:Vec3}`
- `intersects3D(a, apos, b, bpos): boolean`
- `hasWallBehind3D(obj, walls): boolean`
- `findSnapSlot3D(item, pos, rotDeg, scene): { slotPos:Vec3, rot:{x:number,y:number,z:number} } | null`

Indexação espacial

- Octree para objetos (por AABB do footprint rotacionado)
- Mapas `occupiedTilesXZ: Set<string>` para ocupação por tile (clearance rápido)

Paredes

- Representar paredes como arestas entre tiles em XZ (ortogonais).
- WallTool: arrasto cria sequência ortogonal; evitar duplicadas.
- Portas/Janelas: ao colocar, dividir segmento (ou marcar abertura) para validações futuras.

Undo/Redo (Command Pattern)

```ts
interface Command { execute(): void; undo(): void; description: string }
// Exemplos: addObjectCmd, moveObjectCmd, rotateObjectCmd, deleteObjectCmd,
// paintFloorCmd, drawWallCmd, deleteWallCmd
```

- Pilhas `undo[]` e `redo[]` no Zustand; atalhos Ctrl+Z / Ctrl+Y.

Render/UX

- Preview fantasma (verde válido, vermelho inválido) em Place/MoveRotate
- Pan/Zoom do stage (wheel, arrasto com espaço pressionado)
- Cursor e tooltip com mensagem de erro ao invalidar
- Grid visível, snapping por tile
- Atalhos: 1 Place, 2 Move/Rotate, 3 Wall, 4 Floor, B Bulldoze, E Eyedropper, R Rotaciona

UI mínima

- Toolbar (ferramentas + Undo/Redo + Budget)
- CatalogPanel: categorias, busca por nome/tag, clique ativa Place com item selecionado
- Inspector: item selecionado, variante (dropdown), botão deletar
- BudgetBar: fundos e gasto atual; ao colocar/remover, atualiza gasto

Catálogo (exemplo em JSON)

Inclua itens com combinações de tags:

```json
[
  {
    "id": "chair_basic",
    "name": "Cadeira Básica",
    "price": 50,
    "category": "seating",
    "tags": ["requires_slots:table_edge"],
    "variants": ["oak", "black"],
    "footprint": { "kind": "box", "w": 1, "d": 1, "h": 1, "clearance": 1 },
    "art": { "modelUrl": "/assets/models/chair_basic.glb" }
  },
  {
    "id": "table_small",
    "name": "Mesa Pequena",
    "price": 120,
    "category": "surface",
    "tags": ["provides_slots:table_edge"],
    "slots": [
      { "id": "edge_n", "type": "table_edge", "localPos": {"x": 1, "y": 0, "z": -0.5 }, "yawDeg": 0 },
      { "id": "edge_s", "type": "table_edge", "localPos": {"x": 1, "y": 0, "z": 0.5 },  "yawDeg": 180 }
    ],
    "footprint": { "kind": "box", "w": 2, "d": 1, "h": 1 },
    "art": { "modelUrl": "/assets/models/table_small.glb" }
  },
  {
    "id": "door_1",
    "name": "Porta Simples",
    "price": 80,
    "category": "door",
    "tags": ["door", "needs_wall"],
    "footprint": { "kind": "box", "w": 1, "d": 0.2, "h": 2 }
  },
  {
    "id": "window_1",
    "name": "Janela",
    "price": 60,
    "category": "window",
    "tags": ["window", "needs_wall"],
    "footprint": { "kind": "box", "w": 1, "d": 0.2, "h": 1 }
  },
  {
    "id": "floor_wood",
    "name": "Piso Madeira",
    "price": 4,
    "category": "floor",
    "tags": ["floor"],
    "art": { "texture": "/assets/textures/floor_wood.jpg" }
  }
]
```

Fluxos principais (aceitação)

1. Colocar mesa + 2 cadeiras: cadeiras snap em slots `table_edge`; preview verde → Place ok
2. Colocar notebook sobre a mesa: notebook snap em slots `table_slots`: preview verde → Place ok
2. Tentar porta sem parede: preview vermelho + tooltip “Requer parede”
3. Traçar parede e colocar porta: permitido; segmento vira “abertura” naquela posição
4. Pintar piso em área; orçamento aumenta conforme tiles
5. Mover sofá próximo de parede com `snap_to_wall`; R rotaciona
6. Undo/Redo para todas as ações acima
7. Salvar/Carregar JSON preserva tudo; thumbnail gerada

Performance (mínimos)

- Evitar re-render desnecessário (seletor raso no Zustand, componentes memoizados)
- Octree para colisão; evitar O(n) em movimentos
- Usar instâncias (`drei/Instances`) para tiles/objetos repetidos quando possível
- Loop por `useFrame` com throttling de validação no `pointermove`

Persistência

- `exportLot(): string` retorna JSON com `version`
- `importLot(json: string)`: valida versão e normaliza
- `saveToLocalStorage()` automático a cada 5s ou ao Cmd
- `generateThumbnail()`: `gl.domElement.toDataURL("image/png")` via R3F/Three

Testes (mínimos)

- Unit: geometry (rotação de footprint), placement (colisão/clearance), operações de parede
- E2E leve (Playwright): colocar → undo → redo; porta em parede; snap de cadeira

Requisitos não funcionais

- Tipagem estrita TS (`noImplicitAny`)
- Dependências enxutas (R3F + Zustand + ESLint/Prettier; `@react-three/drei` opcional)
- Código comentado apenas nos pontos-chave (pipeline de validação e commands)

Tarefas passo a passo

1. Scaffold Vite + React + TS + Zustand + React Three Fiber
2. Stage + grade (Canvas, câmera ortográfica/perspectiva leve, pan/zoom)
3. Store (Zustand) e `commandStack`
4. WallTool e Floor (dados + render)
5. PlaceObjectTool com preview + pipeline (colisão/clearance/requisitos)
6. Move/Rotate + snapping (grid/parede/slots)
7. UI (Toolbar, CatalogPanel, Inspector, Budget)
8. Export/Import + thumbnail
9. README e testes

Observações de implementação

- Footprint ≠ malha: footprints podem ser assimétricos por rotação; trate 0/90/180/270
- Clearance aplica em torno do footprint já rotacionado (buffer em tiles XZ)
- Portas/Janelas: modelar como “abertura” em `WallSegment` para futuras salas/rota
- Mensagens de erro: retornar códigos padronizados e mapear para texto na UI
- Data‑driven: novos itens exigem JSON + modelo/texture (ou geometria paramétrica)

Saída esperada

- Código completo nas pastas indicadas
- Catálogo de exemplo preenchido
- Assets básicos (modelos ou placeholders paramétricos; texturas simples)
- README com GIFs ou instruções claras
- App pronto para `pnpm dev`