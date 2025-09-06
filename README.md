# 🏗️ Ativos3D - Simulador 3D Interativo

> Ferramenta de simulação 3D inspirada no The Sims Builder para visualização e gerenciamento de ativos físicos

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-000000?style=flat&logo=three.js&logoColor=white)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)

## 📋 Índice

- [🎯 Visão Geral](#-visão-geral)
- [🚀 Quick Start](#-quick-start)
- [🏗️ Arquitetura](#️-arquitetura)
- [📊 Funcionalidades](#-funcionalidades)
- [🛠️ Desenvolvimento](#️-desenvolvimento)
- [🧪 Testes](#-testes)
- [📚 Documentação](#-documentação)
- [🤝 Contribuição](#-contribuição)

## 🎯 Visão Geral

**Ativos3D** permite construir e visualizar imóveis de forma interativa com:

- 🏠 **Construção**: Paredes, pisos, escadas, plataformas
- 🪑 **Mobiliário**: Colocação e organização de objetos
- 💰 **Orçamento**: Sistema de custos e inventário
- 🎮 **Interface**: HUD intuitivo inspirado no The Sims
- 📱 **Responsivo**: Funciona em desktop e dispositivos móveis

### **Casos de Uso**
- **Empresas**: Visualizar e gerenciar ativos físicos
- **Usuários**: Simular e planejar mudanças residenciais
- **Arquitetos**: Prototipagem rápida de layouts

## 🚀 Quick Start

### **Pré-requisitos**
- Node.js 18+
- pnpm (recomendado) ou npm

### **Instalação**
```bash
# Clone o repositório
git clone https://github.com/seu-usuario/ativos3d.git
cd ativos3d

# Instale dependências
pnpm install

# Inicie o servidor de desenvolvimento
pnpm dev
```

### **Comandos Principais**
```bash
pnpm dev          # Servidor de desenvolvimento
pnpm build        # Build de produção
pnpm preview      # Preview do build
pnpm test         # Testes unitários
pnpm test:e2e     # Testes E2E
pnpm lint         # Linting
```

## 🏗️ Arquitetura

### **Clean Architecture + DDD**
Seguimos os princípios de **Clean Architecture** e **Domain-Driven Design**:

```
src/
├── 🧠 core/          # Tipos fundamentais, eventos, comandos
├── 🏛️ domain/        # Entidades, componentes, regras de negócio
├── 🔧 infrastructure/# Renderização, input, física, dados
├── 🎯 application/   # Ferramentas, validação, serviços
├── 🎨 presentation/  # Interface, painéis, HUD
└── 🔗 shared/        # Utilitários compartilhados
```

### **Status das Camadas**
| Camada | Status | Cobertura | Descrição |
|--------|--------|-----------|-----------|
| **Core** | 🟢 Completo | 95% | Tipos, eventos, comandos, geometria |
| **Domain** | 🟢 Completo | 90% | ECS, entidades, componentes |
| **Infrastructure** | 🟡 Parcial | 70% | Render (R3F), input, picking |
| **Application** | 🟡 Progresso | 60% | Tools, validation |
| **Presentation** | 🔴 Iniciado | 40% | UI, panels, HUD |

> 📖 **Detalhes**: Veja [REPOMAP.md](./REPOMAP.md) para navegação completa do código

## 📊 Funcionalidades

### **Implementadas** ✅
- Sistema de eventos e comandos (undo/redo)
- ECS (Entity Component System)
- Ferramentas básicas (View, Select, Place, Move, Delete)
- Sistema de input e picking
- Renderização 3D com React Three Fiber

### **Em Desenvolvimento** 🟡
- Ferramentas de construção (Wall, Floor, Stairs)
- Sistema de validação
- Interface de usuário (panels, HUD)
- Sistema de snap e slots

### **Planejadas** 🔴
- Sistema de física e colisão
- Catálogo de objetos
- Sistema de orçamento
- Persistência e templates

> 📋 **Matriz Completa**: Consulte [RESOURCES_MATRIX.md](./RESOURCES_MATRIX.md) para todos os requisitos e status

## 🛠️ Desenvolvimento

### **Para Novos Desenvolvedores**
1. 🧭 Leia [AGENTS.md](./AGENTS.md) - Bússola do projeto
2. 🗺️ Consulte [REPOMAP.md](./REPOMAP.md) - Mapa do código
3. 🏗️ Entenda a arquitetura em [docs/architecture/](./docs/architecture/)
4. 📋 Veja os requisitos em [docs/requirements/](./docs/requirements/)

### **Implementar Nova Funcionalidade**
```bash
# 1. Consulte o flowstate da funcionalidade
docs/requirements/resources-flowstate/[funcionalidade]-flowstate.md

# 2. Verifique os requisitos
docs/requirements/RESOURCES_MATRIX.md

# 3. Implemente seguindo a arquitetura
src/core/types/          # Tipos necessários
src/domain/              # Entidades e componentes
src/application/tools/   # Lógica da ferramenta
src/presentation/        # Interface

# 4. Adicione testes
tests/unit/              # Testes unitários
```

### **Convenções de Código**
- **TypeScript**: Tipagem estrita (zero `any`)
- **Nomenclatura**: PascalCase (classes), camelCase (funções), kebab-case (arquivos)
- **Testes**: Cobertura >80% obrigatória
- **Documentação**: JSDoc para APIs públicas

### **Ferramentas de Qualidade**
```bash
# Verificar dependências circulares
npx madge --circular src --extensions ts,tsx --ts-config tsconfig.json

# Análise de cobertura
pnpm test:coverage

# Linting completo
pnpm lint
```

## 🧪 Testes

### **Estrutura de Testes**
```
tests/
├── unit/         # 🟢 Testes unitários (95% cobertura)
├── integration/  # 🔴 Testes de integração (pendente)
└── e2e/          # 🔴 Testes E2E (pendente)
```

### **Executar Testes**
```bash
pnpm test              # Todos os testes unitários
pnpm test:watch        # Modo watch
pnpm test:coverage     # Com cobertura
pnpm test:e2e          # Testes E2E (Playwright)
```

### **Critérios de Qualidade**
- ✅ Cobertura >80% (atual: 75%)
- ✅ Zero `any` em TypeScript
- ✅ Testes para cada funcionalidade
- ✅ Performance: 60 FPS, <100ms resposta

## 📚 Documentação

### **Documentação Principal**
| Arquivo | Propósito | Audiência |
|---------|-----------|-----------|
| [AGENTS.md](./AGENTS.md) | 🧭 Bússola para agents | Desenvolvedores/AI |
| [REPOMAP.md](./REPOMAP.md) | 🗺️ Mapa do código | Desenvolvedores |
| [RELATION.md](./RELATION.md) | 🔗 Relações entre docs | Todos |

### **Arquitetura e Design**
- [docs/architecture/CONTEXT.md](./docs/architecture/CONTEXT.md) - Contexto do projeto
- [docs/architecture/REFAC.md](./docs/architecture/REFAC.md) - Plano de refatoração
- [docs/architecture/COMPARISON.md](./docs/architecture/COMPARISON.md) - Legado vs Novo

### **Requisitos e Especificações**
- [docs/requirements/RESOURCES_MATRIX.md](./docs/requirements/RESOURCES_MATRIX.md) - Matriz de requisitos
- [docs/requirements/CHECKLIST.md](./docs/requirements/CHECKLIST.md) - Checklist de funcionalidades
- [docs/requirements/resources-flowstate/](./docs/requirements/resources-flowstate/) - Flowstates das ferramentas

### **Guias de Desenvolvimento**
- [docs/development/boas_praticas_3d.md](./docs/development/boas_praticas_3d.md) - Boas práticas 3D
- [docs/development/build_mechanics.md](./docs/development/build_mechanics.md) - Mecânicas de construção
- [docs/development/validation_pipeline.md](./docs/development/validation_pipeline.md) - Pipeline de validação

## 🎮 Sistema de Ferramentas

### **Modos de Operação**
- **View** 👁️ - Navegação na cena
- **Build** 🏗️ - Construção (paredes, pisos, escadas)
- **Buy** 🛒 - Colocação de objetos e móveis

### **Ferramentas Disponíveis**
```typescript
// Ferramentas Básicas (✅ Implementadas)
ViewTool     // Navegação 3D
SelectTool   // Seleção de objetos
PlaceTool    // Colocação de objetos
MoveTool     // Movimento e rotação
DeleteTool   // Remoção de objetos

// Ferramentas de Construção (🟡 Em desenvolvimento)
WallTool     // Criação de paredes
FloorTool    // Criação de pisos
StairTool    // Escadas e rampas

// Ferramentas Avançadas (🔴 Planejadas)
EyedropperTool    // Copiar propriedades
SledgehammerTool  // Demolição
BulldozeTool      // Limpeza em massa
```

### **Sistema de Input**
```typescript
// Atalhos Globais
Ctrl+Z / Ctrl+Y  // Undo/Redo
F1/F2/F3         // Alternar modos
Esc              // Cancelar ação
Space            // Pausar/continuar

// Ferramentas
V  // View Tool
S  // Select Tool
P  // Place Tool
M  // Move Tool
D  // Delete Tool
```

## 🔧 Tecnologias

### **Core Stack**
- **[React 19](https://react.dev/)** - Framework UI
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática
- **[Vite](https://vitejs.dev/)** - Build tool
- **[React Three Fiber](https://docs.pmnd.rs/react-three-fiber)** - Renderização 3D
- **[Three.js](https://threejs.org/)** - Engine 3D
- **[Drei](https://github.com/pmndrs/drei)** - Utilitários R3F

### **Desenvolvimento**
- **[Vitest](https://vitest.dev/)** - Testes unitários
- **[Playwright](https://playwright.dev/)** - Testes E2E
- **[ESLint](https://eslint.org/)** - Linting
- **[Prettier](https://prettier.io/)** - Formatação

### **Padrões Arquiteturais**
- **Clean Architecture** - Separação de responsabilidades
- **Domain-Driven Design** - Modelagem do domínio
- **Command Pattern** - Undo/Redo
- **Strategy Pattern** - Ferramentas
- **Observer Pattern** - Eventos
- **ECS** - Entity Component System

## 🤝 Contribuição

### **Como Contribuir**
1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Implemente seguindo as [convenções](#️-desenvolvimento)
4. Adicione testes com cobertura >80%
5. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
6. Push para a branch (`git push origin feature/AmazingFeature`)
7. Abra um Pull Request

### **Diretrizes**
- ✅ Siga a [Clean Architecture](./docs/architecture/CONTEXT.md)
- ✅ Mantenha cobertura de testes >80%
- ✅ Use TypeScript estrito (zero `any`)
- ✅ Documente APIs públicas com JSDoc
- ✅ Teste em diferentes navegadores

### **Reportar Issues**
- Use templates de issue apropriados
- Inclua steps para reproduzir
- Adicione screenshots/vídeos quando relevante
- Mencione versão do navegador e OS

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 🔗 Links Úteis

- 🧭 **[AGENTS.md](./AGENTS.md)** - Bússola para desenvolvimento
- 🗺️ **[REPOMAP.md](./REPOMAP.md)** - Mapa completo do código
- 📊 **[RESOURCES_MATRIX.md](./RESOURCES_MATRIX.md)** - Matriz de requisitos
- 🔗 **[RELATION.md](./RELATION.md)** - Relações entre documentações
- 🏗️ **[docs/architecture/](./docs/architecture/)** - Documentação de arquitetura
- 📋 **[docs/requirements/](./docs/requirements/)** - Requisitos e flowstates

---

**🎯 Desenvolvido com Clean Architecture e princípios de qualidade para criar uma ferramenta robusta e extensível.**