# Estrutura do Projeto Ativos3D

## **Visão Geral**

Esta é a nova estrutura do projeto Ativos3D, seguindo os princípios de Clean Architecture e Domain-Driven Design.

## **Estrutura de Pastas**

```
src/
├── core/                   # Fundação e tipos base
│   ├── types/             # Tipos fundamentais (Vec3, Transform, etc.)
│   ├── events/            # Sistema de eventos
│   ├── commands/          # Sistema de comandos (undo/redo)
│   └── geometry/          # Matemática e geometria 3D
├── domain/                # Domínio de negócio
│   ├── entities/          # Entidades principais (Object, Wall, Floor)
│   ├── components/        # Componentes de entidades
│   └── systems/           # Sistemas de domínio
├── infrastructure/        # Infraestrutura técnica
│   ├── render/            # Renderização 3D
│   ├── input/             # Input e interação
│   ├── physics/           # Física e colisão
│   └── data/              # Dados e persistência
├── application/           # Camada de aplicação
│   ├── tools/             # Ferramentas de edição
│   ├── validation/        # Validação de regras
│   └── services/          # Serviços de aplicação
├── presentation/          # Interface do usuário
│   ├── ui/                # Componentes UI reutilizáveis
│   ├── panels/            # Painéis de ferramentas
│   └── hud/               # HUD 3D
└── shared/                # Utilitários compartilhados
```

## **Como Navegar**

### **Para Desenvolvedores Novos**
1. Comece por `core/types/` para entender os tipos fundamentais
2. Explore `domain/entities/` para ver as entidades principais
3. Veja `application/tools/` para entender as ferramentas
4. Examine `presentation/` para a interface

### **Para Implementar Novas Funcionalidades**
1. **Tipos**: Adicione em `core/types/`
2. **Lógica de Negócio**: Implemente em `domain/`
3. **Ferramentas**: Crie em `application/tools/`
4. **Interface**: Adicione em `presentation/`

### **Para Testes**

Utilize o vitest para executar os testes. `pnpm vitest --run`  
- **Unitários**: `tests/unit/`
- **Integração**: `tests/integration/`
- **E2E**: `tests/e2e/`

## **Convenções**

### **Nomenclatura**
- **PascalCase**: Classes, interfaces, componentes React
- **camelCase**: Funções, variáveis, métodos
- **kebab-case**: Arquivos de configuração

### **Organização**
- Um arquivo por classe/interface principal
- Testes junto com o código implementado
- Documentação JSDoc para APIs públicas

### **Dependências**
- `core/` não depende de outras camadas
- `domain/` depende apenas de `core/`
- `infrastructure/` pode depender de `core/` e `domain/`
- `application/` pode depender de todas as camadas anteriores
- `presentation/` pode depender de todas as outras camadas

## **Desenvolvimento**

### **Para Adicionar Novos Tipos**
```typescript
// src/core/types/NewType.ts
export interface NewType {
  // definição
}
```

### **Para Adicionar Novas Entidades**
```typescript
// src/domain/entities/NewEntity.ts
import { Entity } from '../../core/types/Entity';

export class NewEntity implements Entity {
  // implementação
}
```

### **Para Adicionar Novas Ferramentas**
```typescript
// src/application/tools/NewTool.ts
import { Tool } from '../../core/types/Tool';

export class NewTool implements Tool {
  // implementação
}
```

### **Para Verificar Depedência Circular**
```bash
npx -y madge --circular src --extensions ts,tsx --ts-config tsconfig.json
``` 

### **Para Verificar o Lint**
```bash
pnpm lint
```

### **Para Executar os Testes**
```bash
pnpm vitest --run
```

## **Arquitetura de Renderização (R3F Owner)**

- Canvas: a renderização 3D é controlada exclusivamente pelo React Three Fiber (R3F) e Drei.
- Ciclo de frame: `useFrame` dirige um loop headless para métricas via `RenderLoopProvider` (`src/presentation/providers/RenderLoopProvider.tsx`).
- Câmera e controles: camadas R3F dedicadas (`CameraLayer`, `ControlsLayer`) integram com o `EventBus` e `CameraSystem`.
- Bridge: `SceneBridge` publica estado de cena/câmera para o ecossistema da aplicação.
- Headless: Core/Domain/Application permanecem desacoplados de React/Three, comunicando por eventos.
- Sem WebGL manual: não há `WebGLRenderer` manual na UI; R3F/Drei são os donos do ciclo de vida dos recursos Three.

Arquivos úteis:
- `src/presentation/App.tsx`
- `src/presentation/layers/CameraLayer.tsx`
- `src/presentation/layers/ControlsLayer.tsx`
- `src/presentation/bridges/SceneBridge.tsx`
- `src/presentation/providers/RenderLoopProvider.tsx`

## **Headless (Lógica) e Artefatos**

- Headless de lógica (Vitest): opcional. Quando priorizado, adicionar um runtime headless para executar comandos, validações e sistemas sem `<Canvas>`.
- Diretriz: definir uma interface de runtime (ex.: `SceneRuntime`) e uma implementação headless isolada de WebGL/DOM.
- Imagens/artefatos (Playwright): gerar screenshots (thumbnails/golden tests) abrindo a cena no browser em jobs específicos do CI (fase final do refactor).

## **Projecto Legacy (Legado)**

O código antigo está preservado em `legacy/` para referência durante a migração.
