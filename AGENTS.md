# 🧭 AGENTS - Bússola para Desenvolvimento

> **ARQUIVO CORE** - Guia essencial para agents e desenvolvedores no projeto Ativos3D

## 🎯 Missão do Projeto

**Ativos3D** é uma ferramenta de simulação 3D inspirada no The Sims Builder, permitindo construção e visualização interativa de imóveis para empresas e usuários domésticos.

## 📋 Diretivas Globais

### **Precedência de Documentação**
```
1. /.cursor/.cursorrules    # Regras do sistema (ABSOLUTA)
2. AGENTS.md               # Este arquivo (CORE)
3. README.md               # Porta de entrada
4. REPOMAP.md              # Navegação do código
5. docs/architecture/      # Contexto e arquitetura
6. docs/requirements/      # Requisitos e especificações
```

### **Regras Fundamentais**
- ✅ **Tipagem estrita** - Zero `any` em TypeScript
- ✅ **Testes obrigatórios** - Cobertura >80%
- ✅ **Clean Architecture** - Separação clara de responsabilidades
- ✅ **Modularidade** - Baixo acoplamento, alta coesão
- ✅ **Performance** - 60 FPS, <100ms resposta

## 🏗️ Arquitetura Atual

### **Status da Refatoração**
- 🟢 **Core/Types** - Completo (eventos, comandos, geometria)
- 🟢 **Domain/Entities** - Completo (ECS implementado)
- 🟢 **Infrastructure** - Parcial (render, input, picking)
- 🟡 **Application** - Em progresso (tools, validation)
- 🔴 **Presentation** - Iniciado (UI, panels, HUD)

### **Estrutura de Camadas**
```
src/
├── core/          # 🟢 Tipos fundamentais, eventos, comandos
├── domain/        # 🟢 Entidades, componentes, sistemas
├── infrastructure/# 🟡 Render, input, physics, data
├── application/   # 🟡 Tools, validation, services
├── presentation/  # 🔴 UI, panels, HUD
└── shared/        # 🟢 Utilitários
```

## 🛠️ Ferramentas e Stack

### **Core Technologies**
- **React 19** + **TypeScript** (strict mode)
- **React Three Fiber (R3F)** + **Drei** (3D rendering)
- **Vite** (build) + **Vitest** (tests) + **Playwright** (E2E)
- **ESLint** + **Prettier** (code quality)

### **Padrões Implementados**
- **Command Pattern** (undo/redo)
- **Strategy Pattern** (tools)
- **Observer Pattern** (events)
- **ECS** (Entity Component System)

## 📚 Navegação Rápida

### **Para Novos Desenvolvedores**
1. 📖 [README.md](./README.md) - Visão geral e setup
2. 🗺️ [REPOMAP.md](./REPOMAP.md) - Mapa do código
3. 🏗️ [docs/architecture/CONTEXT.md](./docs/architecture/CONTEXT.md) - Contexto detalhado
4. 📋 [docs/requirements/RESOURCES_MATRIX.md](./docs/requirements/RESOURCES_MATRIX.md) - Requisitos

### **Para Implementar Funcionalidades**
1. 🔍 Consulte [docs/requirements/resources-flowstate/](./docs/requirements/resources-flowstate/) para o flowstate
2. 📊 Verifique [docs/requirements/RESOURCES_MATRIX.md](./docs/requirements/RESOURCES_MATRIX.md) para requisitos
3. 🏗️ Implemente seguindo a arquitetura em [docs/architecture/](./docs/architecture/)
4. ✅ Teste com cobertura >80%

### **Para Debugging**
1. 🔧 [docs/development/validation_pipeline.md](./docs/development/validation_pipeline.md)
2. 🎯 [docs/development/boas_praticas_3d.md](./docs/development/boas_praticas_3d.md)
3. 🚀 [docs/development/build_mechanics.md](./docs/development/build_mechanics.md)

## 🎮 Sistema de Ferramentas

### **Modos Principais**
- **View** - Navegação na cena
- **Build** - Construção (paredes, pisos, escadas)
- **Buy** - Colocação de objetos

### **Ferramentas Implementadas**
```typescript
// Core Tools (✅ Implementadas)
- ViewTool, SelectTool, PlaceTool, MoveTool, DeleteTool

// Construction Tools (🟡 Em progresso)
- WallTool, FloorTool, EyedropperTool

// Advanced Tools (🔴 Pendentes)
- StairTool, PlatformTool, BulldozeTool
```

## 🧪 Testes e Qualidade

### **Comandos Essenciais**
```bash
# Desenvolvimento
pnpm dev                    # Servidor de desenvolvimento
pnpm build                  # Build de produção
pnpm preview                # Preview do build

# Qualidade
pnpm lint                  # Linting
pnpm vitest                # Testes unitários
pnpm test:e2e              # Testes E2E
pnpm test:coverage         # Cobertura de testes

# Análise
npx madge --circular src --extensions ts,tsx --ts-config tsconfig.json
```

### **Critérios de Aceitação**
- [ ] Código implementado seguindo Clean Architecture
- [ ] Testes unitários com cobertura >80%
- [ ] Testes E2E para fluxos principais
- [ ] Performance: 60 FPS, <100ms resposta
- [ ] Zero `any` em TypeScript
- [ ] Documentação JSDoc para APIs públicas

## 🚨 Alertas Importantes

### **Não Fazer**
- ❌ Usar `any` em TypeScript
- ❌ Implementar sem testes
- ❌ Quebrar interfaces públicas
- ❌ Ignorar performance
- ❌ Misturar responsabilidades entre camadas

### **Sempre Fazer**
- ✅ Seguir a hierarquia de camadas
- ✅ Implementar testes junto com o código
- ✅ Documentar APIs públicas
- ✅ Validar performance
- ✅ Manter baixo acoplamento

## 🔄 Fluxo de Desenvolvimento

### **Para Cada Task**
1. **Análise** - Entender requisitos no flowstate
2. **Design** - Definir interface seguindo Clean Architecture
3. **Implementação** - Codificar com testes
4. **Validação** - Executar testes e verificar performance
5. **Documentação** - Atualizar JSDoc e documentação

### **Resolução de Conflitos**
Se houver divergência entre documentações:
1. Consulte `/.cursor/.cursorrules` (precedência absoluta)
2. Siga este arquivo (AGENTS.md)
3. Consulte README.md e REPOMAP.md
4. Use docs/architecture/ para contexto
5. Se ainda houver dúvida, proponha 2-3 opções

## 📞 Recursos de Apoio

- 🔗 [RELATION.md](./RELATION.md) - Relações entre documentações
- 🏛️ [docs/architecture/REFAC.md](./docs/architecture/REFAC.md) - Plano de refatoração
- 📊 [docs/requirements/](./docs/requirements/) - Requisitos e flowstates
- 🛠️ [docs/development/](./docs/development/) - Guias de desenvolvimento

---

**🎯 Lembre-se: Este é o arquivo CORE. Sempre consulte aqui primeiro para orientação no desenvolvimento.**