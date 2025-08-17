# Contexto do Projeto Ativos3D

## **Visão Geral do Projeto**

O **Ativos3D** é uma ferramenta de simulação 3D para usuários comuns, inspirada no módulo de construção do jogo The Sims. Permite que usuários construam e visualizem imóveis, salas ou cômodos de forma interativa.

### **Objetivos Principais**
- **Para empresas**: Visualizar e gerenciar ativos físicos da empresa
- **Para usuários domésticos**: Simular e planejar mudanças na casa

### **Funcionalidades Core**
- Construção de paredes e pisos
- Colocação de móveis e objetos
- Sistema de orçamento
- Visualização 3D (perspectiva e ortográfica)
- Undo/Redo
- Exportação/Importação de projetos

## **Tecnologias e Stack**

### **Frontend**
- **React 19** - Framework principal
- **TypeScript** - Tipagem estrita
- **Vite** - Build tool e dev server
- **React Three Fiber (R3F)** - Renderização 3D
- **Three.js** - Engine 3D
- **Zustand** - Gerenciamento de estado
- **Zod** - Validação de schemas

### **Ferramentas de Desenvolvimento**
- **ESLint** - Linting
- **Prettier** - Formatação
- **Vitest** - Testes unitários
- **Playwright** - Testes E2E

## **Arquitetura Atual (Legacy)**

### **Estrutura de Pastas**
```
src/
├── app/                    # Componente principal
├── core/                   # Lógica de negócio
│   ├── events/            # Sistema de eventos
│   ├── placement/         # Validação de colocação
│   ├── spatial/           # Índice espacial
│   └── types.ts           # Tipos base
├── systems/               # Sistemas de renderização
│   ├── render/            # Camadas de renderização
│   ├── tools/             # Ferramentas de edição
│   └── controllers/       # Controladores
├── store/                 # Estado global (Zustand)
├── ui/                    # Interface do usuário
└── assets/                # Recursos 3D
```

### **Problemas Identificados**
1. **Acoplamento alto** - Muitos componentes dependem diretamente do store
2. **Responsabilidades misturadas** - Lógica de negócio com UI
3. **Falta de abstrações** - Dependências hardcoded
4. **Estado monolítico** - Zustand sendo usado para tudo
5. **Falta de testes** - Cobertura insuficiente

## **Arquitetura Alvo (Nova)**

### **Princípios Arquiteturais**
- **Separação de Responsabilidades** - Cada módulo tem uma responsabilidade clara
- **Injeção de Dependência** - Dependências injetadas, não hardcoded
- **Modularidade** - Módulos independentes e testáveis
- **Tipagem Estrita** - Zero `any`, tipos bem definidos
- **Testabilidade** - Cobertura >80% de testes

### **Estrutura Alvo**
```
src/
├── core/                   # Fundação
│   ├── types/             # Tipos fundamentais
│   ├── events/            # Sistema de eventos
│   ├── commands/          # Sistema de comandos
│   └── geometry/          # Matemática 3D
├── domain/                # Domínio de negócio
│   ├── entities/          # Entidades
│   ├── components/        # Componentes
│   └── systems/           # Sistemas de domínio
├── infrastructure/        # Infraestrutura
│   ├── render/            # Renderização
│   ├── input/             # Input e interação
│   ├── physics/           # Física e colisão
│   └── data/              # Dados e persistência
├── application/           # Camada de aplicação
│   ├── tools/             # Ferramentas
│   ├── validation/        # Validação
│   └── services/          # Serviços
├── presentation/          # Interface
│   ├── ui/                # Componentes UI
│   ├── panels/            # Painéis
│   └── hud/               # HUD 3D
└── shared/                # Utilitários compartilhados
```

## **Padrões de Design**

### **Padrões Implementados**
- **Command Pattern** - Para undo/redo
- **Strategy Pattern** - Para ferramentas
- **Observer Pattern** - Para eventos
- **Factory Pattern** - Para criação de entidades
- **Repository Pattern** - Para acesso a dados

### **Padrões a Implementar**
- **Dependency Injection** - Para desacoplamento
- **Event Sourcing** - Para histórico de mudanças
- **CQRS** - Para separação de comandos e queries
- **Builder Pattern** - Para construção de entidades complexas

## **Sistema de Tipos**

### **Tipos Fundamentais**
```typescript
// Matemática 3D
interface Vec3 {
  x: number;
  y: number;
  z: number;
}

interface Transform {
  position: Vec3;
  rotation: Vec3;
  scale: Vec3;
}

// Geometria
interface AABB {
  min: Vec3;
  max: Vec3;
}

// Identificação
interface Entity {
  id: string;
  components: Map<string, Component>;
}
```

### **Tipos de Domínio**
```typescript
// Objetos do catálogo
interface CatalogItem {
  id: string;
  name: string;
  category: string;
  price: number;
  footprint: Footprint;
  model?: string;
}

// Objetos colocados
interface PlacedObject {
  id: string;
  catalogId: string;
  transform: Transform;
  variant?: string;
}

// Construção
interface Wall {
  id: string;
  start: Vec3;
  end: Vec3;
  height: number;
}

interface Floor {
  id: string;
  position: Vec3;
  size: Vec3;
  material: string;
}
```

## **Sistema de Eventos**

### **Eventos do Sistema**
```typescript
interface SystemEvents {
  // Input
  pointerMove: { position: Vec3; screen: Vec2 };
  pointerDown: { position: Vec3; button: number };
  pointerUp: { position: Vec3; button: number };
  keyDown: { code: string; modifiers: Modifiers };
  keyUp: { code: string; modifiers: Modifiers };
  
  // Seleção
  objectSelected: { entityId: string };
  objectDeselected: { entityId: string };
  objectHovered: { entityId: string };
  
  // Ferramentas
  toolChanged: { tool: Tool };
  modeChanged: { mode: Mode };
  
  // Ações
  objectPlaced: { object: PlacedObject };
  objectMoved: { objectId: string; from: Transform; to: Transform };
  objectDeleted: { objectId: string };
  
  // Validação
  validationFailed: { reason: string; position: Vec3 };
  validationSucceeded: { position: Vec3 };
}
```

## **Sistema de Comandos**

### **Interface Command**
```typescript
interface Command {
  execute(): boolean;
  undo(): void;
  description: string;
  timestamp: number;
}
```

### **Tipos de Comandos**
- **PlaceObjectCommand** - Colocar objeto
- **MoveObjectCommand** - Mover objeto
- **DeleteObjectCommand** - Deletar objeto
- **CreateWallCommand** - Criar parede
- **CreateFloorCommand** - Criar piso
- **BatchCommand** - Comando composto

## **Sistema de Ferramentas**

### **Modos de Operação**
- **View** - Apenas visualização
- **Build** - Construção (paredes, pisos)
- **Buy** - Compra e colocação de objetos

### **Ferramentas**
- **ViewTool** - Navegação na cena
- **SelectTool** - Seleção de objetos
- **PlaceTool** - Colocação de objetos
- **MoveTool** - Movimento de objetos
- **DeleteTool** - Remoção de objetos
- **WallTool** - Criação de paredes
- **FloorTool** - Criação de pisos
- **EyedropperTool** - Copiar propriedades

## **Sistema de Validação**

### **Validadores**
- **BoundsValidator** - Verificar limites do lote
- **CollisionValidator** - Verificar colisões
- **BudgetValidator** - Verificar orçamento
- **PlacementValidator** - Verificar regras de colocação

### **Pipeline de Validação**
```typescript
interface ValidationPipeline {
  validate(context: ValidationContext): ValidationResult;
  addValidator(validator: Validator): void;
  removeValidator(validator: Validator): void;
}
```

## **Sistema de Renderização**

### **Camadas de Renderização**
- **GridLayer** - Grade de referência
- **FloorLayer** - Piso
- **WallsLayer** - Paredes
- **ObjectsLayer** - Objetos
- **UI3DLayer** - Interface 3D

### **Sistema de Câmera**
- **PerspectiveCamera** - Visualização em perspectiva
- **OrthographicCamera** - Visualização ortográfica
- **CameraController** - Controles de câmera

## **Sistema de Input**

### **Mapeamento de Input**
```typescript
interface InputMapping {
  key: string;
  action: string;
  modifiers?: Modifiers;
  context?: string;
}
```

### **Sistema de Snap**
- **GridSnap** - Snap para grade
- **ObjectSnap** - Snap para objetos
- **WallSnap** - Snap para paredes
- **EndpointSnap** - Snap para extremidades

## **Sistema de Estado**

### **Slices do Estado**
- **SceneSlice** - Objetos, paredes, pisos
- **ToolSlice** - Ferramenta ativa, modo
- **CameraSlice** - Posição, rotação, modo
- **BudgetSlice** - Orçamento, gastos
- **SelectionSlice** - Objetos selecionados
- **UISlice** - Estado da interface

## **Critérios de Qualidade**

### **Código**
- **Tipagem estrita** - Zero `any`
- **Documentação** - JSDoc para APIs públicas
- **Naming** - Nomes descritivos e consistentes
- **Complexidade** - Funções simples e focadas

### **Testes**
- **Cobertura** - >80% de cobertura
- **Unitários** - Para lógica de negócio
- **Integração** - Para sistemas
- **E2E** - Para fluxos completos

### **Performance**
- **Renderização** - 60 FPS
- **Memória** - Sem vazamentos
- **Carregamento** - <3s para inicialização
- **Interação** - <100ms para resposta

## **Convenções de Nomenclatura**

### **Arquivos**
- **PascalCase** para componentes React
- **camelCase** para utilitários e hooks
- **kebab-case** para arquivos de configuração

### **Variáveis e Funções**
- **camelCase** para variáveis e funções
- **PascalCase** para classes e interfaces
- **UPPER_SNAKE_CASE** para constantes

### **Pastas**
- **camelCase** para pastas de módulos
- **kebab-case** para pastas de recursos

## **Fluxo de Desenvolvimento**

### **Para Cada Tarefa**
1. **Análise** - Entender requisitos
2. **Design** - Definir interface e implementação
3. **Implementação** - Codificar com testes
4. **Teste** - Executar testes unitários
5. **Integração** - Testar com outros módulos
6. **Documentação** - Atualizar documentação

### **Critérios de Aceitação**
- [ ] Código implementado
- [ ] Testes passando
- [ ] Documentação atualizada
- [ ] Performance adequada
- [ ] Integração funcionando

## **Recursos e Referências**

### **Documentação**
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [Three.js](https://threejs.org/docs/)
- [Zustand](https://github.com/pmndrs/zustand)
- [TypeScript](https://www.typescriptlang.org/docs/)

### **Inspirações**
- **The Sims Builder** - Interface e ferramentas
- **SketchUp** - Sistema de ferramentas
- **Blender** - Sistema de câmera
- **Figma** - Sistema de seleção

### **Padrões de Design**
- **Clean Architecture** - Robert C. Martin
- **Domain-Driven Design** - Eric Evans
- **SOLID Principles** - Robert C. Martin

## **Notas Importantes**

### **Para o AGENT**
- Sempre manter tipagem estrita
- Implementar testes junto com o código
- Seguir os padrões estabelecidos
- Documentar APIs públicas
- Considerar performance desde o início
- Manter modularidade e baixo acoplamento

### **Prioridades**
1. **Funcionalidade** - Sistema funcionando
2. **Qualidade** - Código limpo e testado
3. **Performance** - Responsivo e eficiente
4. **Usabilidade** - Interface intuitiva
5. **Extensibilidade** - Fácil de expandir

### **Restrições**
- Não usar `any` em TypeScript
- Não implementar sem testes
- Não quebrar interfaces públicas
- Não comprometer performance
- Não ignorar acessibilidade
