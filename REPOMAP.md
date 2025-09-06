# 🗺️ REPOMAP - Mapa do Repositório Ativos3D

> Navegação estruturada do código-fonte e arquitetura atual

## 📊 Status Geral

| Camada | Status | Cobertura | Arquivos | Descrição |
|--------|--------|-----------|----------|-----------|
| **Core** | 🟢 Completo | 95% | 45+ | Tipos, eventos, comandos, geometria |
| **Domain** | 🟢 Completo | 90% | 15+ | Entidades, componentes, ECS |
| **Infrastructure** | 🟡 Parcial | 70% | 25+ | Render, input, picking, snap |
| **Application** | 🟡 Em progresso | 60% | 20+ | Tools, validation, services |
| **Presentation** | 🔴 Iniciado | 40% | 35+ | UI, panels, HUD, layers |

## 🏗️ Estrutura Principal

### 📁 `/src` - Código Principal

#### 🧠 **Core** (Fundação) - `src/core/`
```
core/
├── types/              # 🟢 Tipos fundamentais
│   ├── index.ts           # Exports principais
│   ├── Command.ts         # Interface de comandos
│   ├── Events.ts          # Tipos de eventos
│   ├── camera/            # Tipos de câmera (4 arquivos)
│   ├── commands/          # Tipos de comandos (5 arquivos)
│   ├── components/        # Tipos de componentes (7 arquivos)
│   ├── ecs/              # Entity Component System (6 arquivos)
│   ├── events/           # Eventos do sistema (13 arquivos)
│   ├── input/            # Input e interação (5 arquivos)
│   ├── picking/          # Seleção de objetos (3 arquivos)
│   ├── render/           # Renderização (2 arquivos)
│   ├── scene/            # Cena 3D (2 arquivos)
│   ├── snap/             # Sistema de snap (6 arquivos)
│   ├── tools/            # Ferramentas (4 arquivos)
│   ├── ui/               # Interface (3 arquivos)
│   └── validation/       # Validação (2 arquivos)
├── events/             # 🟢 Sistema de eventos
│   └── EventBus.ts        # Barramento de eventos
├── commands/           # 🟢 Sistema de comandos
│   ├── index.ts           # Exports
│   ├── CommandStack.ts    # Pilha undo/redo
│   ├── BatchCommandFactory.ts
│   ├── ConstructionCommandFactory.ts
│   ├── ObjectCommandFactory.ts
│   └── TestCommand.ts
└── geometry/           # 🟢 Matemática 3D
    ├── index.ts           # Exports
    ├── types/            # Tipos geométricos (7 arquivos)
    ├── math/             # Operações matemáticas (4 arquivos)
    ├── operations/       # Operações geométricas (6 arquivos)
    ├── utils/            # Utilitários (4 arquivos)
    └── factories/        # Factories (5 arquivos)
```

#### 🏛️ **Domain** (Domínio) - `src/domain/`
```
domain/
├── entities/           # 🟢 Entidades principais
│   ├── index.ts           # Exports
│   ├── Entity.ts          # Entidade base
│   ├── EntityFactory.ts   # Factory de entidades
│   └── EntityManager.ts   # Gerenciador ECS
├── components/         # 🟢 Componentes ECS
│   ├── index.ts           # Exports
│   ├── BaseComponent.ts   # Componente base
│   ├── ComponentSystem.ts # Sistema de componentes
│   ├── TransformComponent.ts
│   ├── RenderComponent.ts
│   ├── PhysicsComponent.ts
│   ├── ToolComponent.ts
│   ├── FloorComponent.ts
│   └── WallComponent.ts
└── systems/            # 🔴 Sistemas de domínio (vazio)
```

#### 🔧 **Infrastructure** (Infraestrutura) - `src/infrastructure/`
```
infrastructure/
├── render/             # 🟡 Renderização 3D (4 arquivos)
├── input/              # 🟢 Sistema de input
│   ├── index.ts
│   ├── InputManager.ts
│   └── InputMapper.ts
├── picking/            # 🟢 Seleção de objetos
│   ├── index.ts
│   ├── HoverSystem.ts
│   └── ObjectSelection.ts
├── snap/               # 🟢 Sistema de snap (5 arquivos)
├── physics/            # 🔴 Física (vazio)
└── data/               # 🔴 Dados (vazio)
```

#### 🎯 **Application** (Aplicação) - `src/application/`
```
application/
├── tools/              # 🟡 Ferramentas de edição
│   ├── ToolManager.ts     # Gerenciador de ferramentas
│   ├── basic/            # Ferramentas básicas (6 arquivos)
│   └── strategies/       # Estratégias (1 arquivo)
├── validation/         # 🟡 Sistema de validação
│   ├── ValidationSystem.ts
│   └── validators/       # Validadores (3 arquivos)
└── services/           # 🔴 Serviços (vazio)
```

#### 🎨 **Presentation** (Apresentação) - `src/presentation/`
```
presentation/
├── App.tsx             # 🟢 Componente principal
├── bridges/            # 🟢 Pontes de comunicação
│   └── SceneBridge.tsx
├── hooks/              # 🟡 Hooks customizados (7 arquivos)
├── layers/             # 🟢 Camadas de renderização (11 arquivos)
├── panels/             # 🟡 Painéis de interface (13 arquivos)
├── hud/                # 🟡 HUD 3D (11 arquivos)
├── providers/          # 🟢 Providers React (1 arquivo)
└── ui/                 # 🔴 Componentes UI (vazio)
```

### 📁 `/tests` - Testes

```
tests/
├── setup.ts            # Configuração de testes
├── unit/               # 🟢 Testes unitários
│   ├── Application.test.ts
│   ├── EventBus.test.ts
│   ├── application/       # Tests da camada application (8 arquivos)
│   ├── commands/         # Tests de comandos (1 arquivo)
│   ├── components/       # Tests de componentes (5 arquivos)
│   ├── entities/         # Tests de entidades (2 arquivos)
│   ├── geometry/         # Tests de geometria (15 arquivos)
│   ├── infrastructure/   # Tests de infraestrutura (9 arquivos)
│   ├── presentation/     # Tests de apresentação (10 arquivos)
│   └── render/           # Tests de renderização (2 arquivos)
├── integration/        # 🔴 Testes de integração (vazio)
└── e2e/                # 🔴 Testes E2E (vazio)
```

### 📁 `/docs` - Documentação

```
docs/
├── architecture/          # 🟢 Arquitetura e design
│   ├── CONTEXT.md            # Contexto do projeto
│   ├── REFAC.md              # Plano de refatoração
│   └── COMPARISON.md         # Legado vs Novo
├── requirements/          # 🟢 Requisitos e especificações
│   ├── RESOURCES_MATRIX.md   # Matriz de requisitos
│   ├── CHECKLIST.md          # Checklist de funcionalidades
│   └── resources-flowstate/  # Flowstates das ferramentas
│       ├── README.md            # Tabela de cobertura
│       └── [20 flowstates].md   # Comportamentos das ferramentas
├── development/           # 🟡 Guias de desenvolvimento
│   ├── boas_praticas_3d.md   # Boas práticas 3D
│   ├── build_mechanics.md    # Mecânicas de construção
│   ├── validation_pipeline.md # Pipeline de validação
│   ├── roadmap_melhorias.md  # Roadmap
│   └── small_tasks.md        # Tarefas pequenas
├── legacy/                # 🔴 Documentação legada
│   ├── LEGACY_AGENTS.md      # Agents antigo
│   ├── data_models.md        # Modelos de dados antigos
│   ├── prompt_inicial.md     # Prompt inicial
│   └── repo_map.md           # Mapa antigo (desatualizado)
└── hud_idea.png           # 🟡 Imagem conceitual do HUD
```

### 📁 `/legacy` - Sistema Legado

```
legacy/
├── README.md           # Documentação do legado
├── catalog.json        # Catálogo de objetos
├── lot_example.json    # Exemplo de lote
├── index.html          # HTML do legado
└── src/                # Código legado completo
    ├── app/               # App principal
    ├── core/              # Core antigo
    ├── systems/           # Sistemas antigos
    ├── store/             # Estado Zustand
    └── ui/                # UI antiga
```

## 🎯 Pontos de Entrada Principais

### **Para Desenvolvedores**
1. **`src/core/types/index.ts`** - Todos os tipos fundamentais
2. **`src/domain/entities/index.ts`** - Entidades principais
3. **`src/application/tools/ToolManager.ts`** - Sistema de ferramentas
4. **`src/presentation/App.tsx`** - Componente raiz

### **Para Testes**
1. **`tests/unit/`** - Testes unitários por camada
2. **`tests/setup.ts`** - Configuração global de testes

### **Para Documentação**
1. **`docs/requirements/resources-flowstate/`** - Comportamentos das funcionalidades
2. **`docs/requirements/RESOURCES_MATRIX.md`** - Matriz de requisitos
3. **`RELATION.md`** - Relações entre documentações

## 🔍 Como Navegar

### **Implementar Nova Funcionalidade**
```
1. docs/requirements/resources-flowstate/[funcionalidade]-flowstate.md  # Comportamento
2. docs/requirements/RESOURCES_MATRIX.md                               # Requisitos
3. src/core/types/                                                    # Tipos necessários
4. src/domain/                                                        # Entidades/componentes
5. src/application/tools/                                             # Implementação
6. src/presentation/                                                  # Interface
7. tests/unit/                                                       # Testes
```

### **Debuggar Problema**
```
1. src/core/events/EventBus.ts        # Sistema de eventos
2. src/application/tools/ToolManager.ts # Ferramentas ativas
3. src/infrastructure/input/           # Input do usuário
4. src/presentation/layers/            # Renderização
```

### **Entender Arquitetura**
```
1. docs/architecture/CONTEXT.md       # Contexto geral
2. docs/architecture/REFAC.md         # Plano de refatoração
3. src/core/                          # Fundação
4. src/domain/                        # Regras de negócio
```

## 📈 Métricas de Qualidade

### **Cobertura de Testes**
- **Core**: 95% (45+ testes)
- **Domain**: 90% (12+ testes)
- **Infrastructure**: 70% (15+ testes)
- **Application**: 60% (10+ testes)
- **Presentation**: 40% (10+ testes)

### **Complexidade**
- **Dependências circulares**: 0
- **Arquivos sem testes**: <20%
- **Uso de `any`**: 0
- **Cobertura JSDoc**: >80% (APIs públicas)

## 🚀 Próximos Passos

### **Prioridade Alta**
1. Completar **Application Layer** (tools, services)
2. Implementar **Presentation Layer** (UI components)
3. Adicionar **Integration Tests**

### **Prioridade Média**
1. Implementar **Physics System**
2. Adicionar **Data Layer**
3. Completar **E2E Tests**

### **Prioridade Baixa**
1. Otimizações de performance
2. Documentação adicional
3. Ferramentas de desenvolvimento

---

**💡 Dica**: Use este mapa para navegar rapidamente pelo código. Cada camada tem responsabilidades bem definidas seguindo Clean Architecture.
