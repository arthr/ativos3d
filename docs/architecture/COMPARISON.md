## Visão Geral

Este documento mapeia as funcionalidades implementadas no código legado (`/legacy`) com suas correspondências na nova arquitetura (`/src`), seguindo os princípios de Clean Architecture e Domain-Driven Design.

## Status Geral da Migração

| Categoria | Progresso | Observações |
|-----------|-----------|-------------|
| **Core Systems** | 90% | Tipos, eventos, comandos refatorados |
| **Domain Logic** | 60% | Entidades e componentes implementados |
| **Infrastructure** | 70% | Renderização e input funcionais |
| **Application** | 40% | Ferramentas parcialmente portadas |
| **UI/Presentation** | 20% | Interface básica implementada |

## Tabela de Comparação de Arquivos

| Funcionalidade | Código Legado | Nova Implementação | Status |
|----------------|---------------|-------------------|---------|
| **Tipos Fundamentais** | `/legacy/src/core/types.ts` | `/src/core/types/` | ✅ Refatorado |
| **Sistema de Eventos** | `/legacy/src/core/events/` | `/src/core/events/EventBus.ts` | ✅ Refatorado |
| **Sistema de Comandos** | `/legacy/src/core/commandStack.ts` | `/src/core/commands/CommandStack.ts` | ✅ Refatorado |
| **Gerenciamento de Estado** | `/legacy/src/store/useStore.ts` | Múltiplos sistemas | ⚠️ Parcial |
| **Catálogo de Objetos** | `/legacy/catalog.json` | A implementar | ❌ Pendente |
| **Validação de Colocação** | `/legacy/src/core/placement.ts` | `/src/application/validation/` | ✅ Implementado |
| **Índice Espacial** | `/legacy/src/core/spatialIndex.ts` | A implementar | ❌ Pendente |
| **Sistema de Orçamento** | `/legacy/src/core/budget.ts` | A implementar | ❌ Pendente |
| **Serialização** | `/legacy/src/core/serialization.ts` | A implementar | ❌ Pendente |
| **Geometria** | `/legacy/src/core/geometry.ts` | `/src/core/geometry/` | ✅ Refatorado |
| **Ferramentas** | `/legacy/src/systems/tools/` | `/src/application/tools/` | ✅ Implementado |
| **Renderização** | `/legacy/src/systems/render/` | `/src/presentation/layers/` | ✅ Implementado |
| **Input** | `/legacy/src/systems/controllers/` | `/src/infrastructure/input/` | ✅ Implementado |
| **UI/HUD** | `/legacy/src/ui/` | `/src/presentation/` | ⚠️ Parcial |

## Funcionalidades

### Ferramentas Implementadas
- [x] **ViewTool** - Navegação na cena
- [x] **SelectTool** - Seleção de objetos
- [x] **PlaceTool** - Colocação de objetos
- [x] **MoveTool** - Movimento de objetos
- [x] **DeleteTool** - Remoção de objetos
- [x] **WallTool** - Criação de paredes
- [x] **FloorTool** - Criação de pisos
- [x] **EyedropperTool** - Copiar propriedades

### HUD e Interface (Parcial)
- [x] **ToolHud** - Seleção de ferramentas básica
- [ ] **Topbar** - Ações de arquivo, configurações, import/export
- [ ] **InfoBar** (antiga BudgetBar) - Exibição de valor total do lote, quantidade de items (móveis, eletronicos, etc)
- [ ] **CatalogPanel** - Seletor de objetos do catálogo
- [ ] **InspectorPanel** - Propriedades do objeto selecionado
- [ ] **ToastSystem** - Notificações globais

### Sistema de Arquivos (Pendente)
- [ ] Exportar projeto em JSON
- [ ] Importar projeto JSON
- [ ] Exportar thumbnail PNG
- [ ] Versionamento de formato

### Validação Implementada
- [x] **ValidationSystem** - Pipeline extensível
- [x] **Validação de limites** - Bounds checking
- [x] **Detecção de colisão** - AABB básico
- [ ] **Validação de orçamento** - Budget constraints
- [ ] **Validação de slots** - Attachment points

### Controles e Interação
- [x] **Câmera perspectiva/ortográfica** - CameraSystem
- [x] **Pan, rotação e zoom** - ControlsLayer
- [x] **Sistema de input** - InputManager/InputMapper
- [x] **Picking/Raycasting** - ObjectSelection
- [x] **Sistema de Snap** - Grid/Object/Wall/Endpoint
- [ ] **Atalhos de teclado globais** - Parcialmente implementado

### Sistema de Undo/Redo
- [x] **CommandStack** - Histórico com limite
- [x] **Command Pattern** - Interface completa
- [x] **Batch Commands** - Operações compostas
- [x] **Async support** - Comandos assíncronos

### Renderização
- [x] **Camadas de cena** organizadas:
  - GridLayer
  - WallsLayer
  - FloorLayer
  - ObjectsLayer
  - GizmoLayer
  - CameraLayer
  - ControlsLayer
- [x] **React Three Fiber** - Owner do canvas
- [x] **SceneBridge** - Integração com eventos
- [ ] **Instancing avançado** - Otimização pendente
- [ ] **LOD System** - Level of detail

### Catálogo e Dados (Pendente)
- [ ] **Schema do catálogo** - Validação com Zod
- [ ] **CatalogSystem** - Gerenciamento de itens
- [ ] **AssetLoader** - Carregamento de modelos
- [ ] **CategorySystem** - Organização por categorias
- [ ] **FilterSystem** - Busca e filtros

### Sistema de Orçamento (Pendente)
- [ ] **BudgetSystem** - Controle de gastos
- [ ] **CostCalculation** - Cálculo de custos
- [ ] **BudgetValidation** - Validação de limites
- [ ] **Budget decorators** - Integração com comandos

## Melhorias Arquiteturais

### 1. Separação de Responsabilidades
- **Legado**: Lógica misturada com UI no Zustand store
- **Novo**: Clean Architecture com camadas bem definidas

### 2. Sistema de Componentes
- **Legado**: Objetos com estrutura fixa (`PlacedObject3D`)
- **Novo**: ECS flexível com componentes modulares

### 3. Type Safety
- **Legado**: Tipos parciais, uso de `any`
- **Novo**: Zero `any`, tipos estritos em todo o projeto

### 4. Testabilidade
- **Legado**: Difícil de testar, acoplamento alto
- **Novo**: >80% cobertura, componentes isolados

### 5. Performance
- **Legado**: Renderização básica, colisão O(n)
- **Novo**: Sistema otimizado, preparado para spatial indexing

## Roadmap de Implementação

### Próximas Prioridades

1. **Sistema de Catálogo** (Alta)
   - Definir schema com Zod
   - Implementar loader de catalog.json
   - Criar UI do catálogo

2. **Sistema de Orçamento** (Alta)
   - Implementar BudgetSystem
   - Integrar com comandos
   - Criar BudgetBar UI

3. **Serialização** (Média)
   - Export/Import JSON
   - Versionamento
   - Thumbnail generation

4. **UI Completa** (Média)
   - Topbar com file actions
   - Inspector panel
   - Toast notifications

5. **Otimizações** (Baixa)
   - Spatial indexing
   - Instancing avançado
   - LOD system

## Notas de Migração

### Para Desenvolvedores

1. **Não portar diretamente** - Refatore seguindo a nova arquitetura
2. **Manter type safety** - Zero `any` no código novo
3. **Testar enquanto migra** - Mínimo 80% cobertura
4. **Documentar mudanças** - Atualizar este documento

### Decisões Arquiteturais

1. **ECS vs Objetos fixos** - Escolhemos ECS para flexibilidade
2. **EventBus vs Zustand** - EventBus para desacoplamento
3. **Camadas vs Monolito** - Clean Architecture para manutenibilidade
4. **TypeScript estrito** - Para prevenir bugs em runtime
