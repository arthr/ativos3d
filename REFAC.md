Perfeito! Vou elaborar um planejamento estruturado para reconstruir o projeto de forma modular e correta, começando pela base e construindo camada por camada.

## **Planejamento de Reconstrução Modular - Ativos3D**

### **Fase 1: Fundação e Core (Base Sólida)**

#### **1.1 Estrutura de Projeto e Configuração**
- [x] Configurar estrutura de pastas modular
- [x] Configurar TypeScript com tipos estritos
- [x] Configurar ESLint e Prettier
- [x] Configurar Vite com React + R3F
- [x] Configurar testes (Vitest + Testing Library)

#### **1.2 Sistema de Tipos Base**
- [x] Definir tipos fundamentais (Vec3, Transform, etc.)
- [x] Definir tipos de domínio (Entity, Component, etc.)
- [x] Definir tipos de eventos
- [x] Definir tipos de comandos
- [x] Revisar e refatorar estrutura de tipos seguindo princípios de design
- [x] Revisão final completa da pasta types - todos os princípios respeitados
- [x] Refatoração da pasta geometry - separação de tipos e implementações
- [x] Definir tipos de geometria avançada
  - [x] Implementar interface AABB (Axis-Aligned Bounding Box)
  - [x] Implementar interface Transform completa (posição, rotação, escala)

#### **1.3 Sistema de Eventos**
- [x] Implementar EventBus base
- [x] Definir tipos de eventos do sistema
- [x] Revisar e refatorar eventos seguindo princípios de design
- [x] Modularizar eventos em arquivos separados por responsabilidade
- [x] Implementar sistema de assinatura/desassinatura
- [x] Testes unitários para EventBus

#### **1.4 Sistema de Comandos**
- [x] Implementar Command Pattern base
- [x] Definir interface Command
- [x] Modularizar comandos em arquivos separados por responsabilidade
- [x] Implementar CommandStack (undo/redo)
  - [x] Definir tipos para CommandStack
  - [x] Implementar CommandStack com undo/redo
- [x] Testes unitários para CommandStack

### **Fase 2: Domínio e Entidades**

#### **2.1 Sistema de Entidades**
- [x] Implementar Entity base
- [x] Implementar Component System
- [x] Implementar EntityManager
  - [x] Definir tipos para EntityManager
  - [x] Implementar EntityManager
- [x] Testes para Entity System

#### **2.2 Tipos de Entidades**
- [x] Implementar TransformComponent
  - [x] Definir interface TransformComponent
  - [x] Implementar TransformComponent
- [x] Implementar RenderComponent
  - [x] Definir interface RenderComponent
  - [x] Implementar RenderComponent
- [x] Implementar PhysicsComponent
  - [x] Definir interface PhysicsComponent
  - [x] Implementar PhysicsComponent
- [x] Implementar ToolComponent
  - [x] Definir interface ToolComponent
  - [x] Implementar ToolComponent

#### **2.3 Sistema de Geometria**
- [x] Implementar cálculos de geometria 3D
- [x] Modularizar Vec3 em arquivos separados por responsabilidade
- [x] Reorganizar diretório types seguindo princípios de design
- [x] Mover Vec2 para pasta geometry e criar estrutura completa
- [x] Implementar sistema de AABB
  - [x] Definir tipos para AABB
  - [x] Implementar sistema de AABB
- [x] Implementar sistema de colisão básico
  - [x] Definir tipos para deteção de colisão
  - [x] Implementar sistema de colisão básico
- [x] Testes para geometria

### **Fase 3: Renderização e Cena**

A renderização é controlada por React Three Fiber (R3F) com Drei. Cada parte da cena é isolada em camadas independentes que são combinadas no `<Canvas>`.

#### **3.1 Sistema de Renderização**
- [x] Canvas R3F/Drei como owner da cena
- [x] SceneBridge publica estado da cena
- [x] Implementar CameraSystem
- [x] Testes para renderização

#### **3.2 Camadas de Renderização**
- [x] GridLayer
- [x] ObjectsLayer
- [x] WallsLayer
- [x] FloorLayer
- [x] GizmoLayer
- [x] CameraLayer
- [x] ControlsLayer

#### **3.3 Sistema de Câmera**
- [x] Implementar CameraController
- [x] Implementar CameraModes (persp/ortho)
- [x] Implementar controles de câmera
- [x] Testes para câmera

### **Fase 4: Input e Interação**

#### **4.1 Sistema de Input**
- [x] Implementar InputManager
- [x] Implementar InputMapping
- [x] Implementar InputEvents
- [x] Testes para input

#### **4.2 Sistema de Picking**
- [x] Implementar Raycasting
- [x] Implementar ObjectSelection
- [x] Implementar HoverSystem
- [x] Testes para picking

#### **4.3 Sistema de Snap**
- [x] Implementar GridSnap
- [x] Implementar ObjectSnap
- [ ] Implementar WallSnap
- [ ] Testes para snap

### **Fase 5: Ferramentas e Estratégias**

#### **5.1 Sistema de Ferramentas**
- [ ] Implementar ToolManager
- [ ] Implementar ToolStrategy Pattern
- [ ] Implementar ToolState
- [ ] Testes para ferramentas

#### **5.2 Ferramentas Básicas**
- [ ] Implementar ViewTool
- [ ] Implementar SelectTool
- [ ] Implementar PlaceTool
- [ ] Implementar MoveTool
- [ ] Implementar DeleteTool

#### **5.3 Ferramentas de Construção**
- [ ] Implementar WallTool
- [ ] Implementar FloorTool
- [ ] Implementar EyedropperTool
- [ ] Testes para ferramentas

### **Fase 6: Validação e Física**

#### **6.1 Sistema de Validação**
- [ ] Implementar ValidationSystem
- [ ] Implementar PlacementValidator
- [ ] Implementar CollisionValidator
- [ ] Testes para validação

#### **6.2 Sistema de Física**
- [ ] Implementar PhysicsSystem
- [ ] Implementar CollisionDetection
- [ ] Implementar SpatialIndex
- [ ] Testes para física

### **Fase 7: Dados e Catálogo**

#### **7.1 Sistema de Dados**
- [ ] Implementar DataManager
- [ ] Implementar CatalogSystem
- [ ] Implementar AssetLoader
- [ ] Testes para dados

#### **7.2 Catálogo de Objetos**
- [ ] Definir schema de CatalogItem
- [ ] Implementar CategorySystem
- [ ] Implementar FilterSystem
- [ ] Testes para catálogo

### **Fase 8: Estado e Gerenciamento**

#### **8.1 Sistema de Estado**
- [ ] Implementar StateManager
- [ ] Implementar Store slices
- [ ] Implementar State persistence
- [ ] Testes para estado

#### **8.2 Sistema de Orçamento**
- [ ] Implementar BudgetSystem
- [ ] Implementar CostCalculation
- [ ] Implementar BudgetValidation
- [ ] Testes para orçamento

### **Fase 9: Interface do Usuário**

#### **9.1 Sistema de UI**
- [ ] Implementar UISystem
- [ ] Implementar ComponentLibrary
- [ ] Implementar ThemeSystem
- [ ] Testes para UI

#### **9.2 Painéis de Interface**
- [ ] Implementar Toolbar
- [ ] Implementar CatalogPanel
- [ ] Implementar InspectorPanel
- [ ] Implementar BudgetPanel

#### **9.3 Componentes de UI**
- [ ] Implementar Button
- [ ] Implementar Panel
- [ ] Implementar Modal
- [ ] Implementar Toast

### **Fase 10: Funcionalidades Avançadas**

#### **10.1 Sistema de Templates**
- [ ] Implementar TemplateSystem
- [ ] Implementar RoomTemplates
- [ ] Implementar TemplateLibrary
- [ ] Testes para templates

#### **10.2 Sistema de Sugestões**
- [ ] Implementar SuggestionSystem
- [ ] Implementar LayoutSuggestions
- [ ] Implementar FurnitureSuggestions
- [ ] Testes para sugestões

#### **10.3 Sistema de Relatórios**
- [ ] Implementar ReportSystem
- [ ] Implementar AssetReport
- [ ] Implementar CostReport
- [ ] Testes para relatórios

### **Fase 11: Integração e Testes**

#### **11.1 Integração de Sistemas**
- [ ] Integrar todos os sistemas
- [ ] Implementar Application class
- [ ] Configurar injeção de dependência
- [ ] Testes de integração

#### **11.2 Testes E2E**
- [ ] Configurar Playwright
- [ ] Implementar testes de fluxo completo
- [ ] Implementar testes de performance
- [ ] Implementar testes de acessibilidade

### **Fase 12: Otimização e Polimento**

#### **12.1 Otimizações**
- [ ] Implementar instancing
- [ ] Implementar frustum culling
- [ ] Implementar LOD system
- [ ] Otimizar renderização

#### **12.2 Polimento**
- [ ] Implementar loading states
- [ ] Implementar error handling
- [ ] Implementar logging
- [ ] Implementar analytics

## **Ordem de Execução Detalhada**

### **Sequencia 1-2: Fundação**
1. Configuração do projeto
2. Sistema de tipos base
3. Sistema de eventos
4. Sistema de comandos

### **Sequencia 3-4: Domínio**
1. Sistema de entidades
2. Tipos de entidades
3. Sistema de geometria

### **Sequencia 5-6: Renderização**
1. Sistema de renderização
2. Camadas de renderização
3. Sistema de câmera

### **Sequencia 7-8: Interação**
1. Sistema de input
2. Sistema de picking
3. Sistema de snap

### **Sequencia 9-10: Ferramentas**
1. Sistema de ferramentas
2. Ferramentas básicas
3. Ferramentas de construção

### **Sequencia 11-12: Validação**
1. Sistema de validação
2. Sistema de física

### **Sequencia 13-14: Dados**
1. Sistema de dados
2. Catálogo de objetos

### **Sequencia 15-16: Estado**
1. Sistema de estado
2. Sistema de orçamento

### **Sequencia 17-18: Interface**
1. Sistema de UI
2. Painéis de interface
3. Componentes de UI

### **Sequencia 19-20: Avançado**
1. Sistema de templates
2. Sistema de sugestões
3. Sistema de relatórios

### **Sequencia 21-22: Integração**
1. Integração de sistemas
2. Testes E2E

### **Sequencia 23-24: Polimento**
1. Otimizações
2. Polimento final

## **Critérios de Sucesso por Fase**

- **Código limpo** e bem documentado
- **Testes unitários** com cobertura >80%
- **Tipagem estrita** sem `any`
- **Performance** adequada
- **Arquitetura modular** e extensível
