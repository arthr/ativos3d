# HUD Components

## Visão Geral

O componente `ToolHud` foi construindo em subcomponentes menores e mais focados, extraindo lógica de estado para hooks customizados e organizando constantes e utilitários em locais apropriados.

## Estrutura Refatorada

### Arquivos Criados

```
src/
├── core/types/ui/
│   └── HudTypes.ts                    # Tipos TypeScript para HUD
├── shared/utils/
│   └── classNames.ts                  # Utilitário cn para classes condicionais
├── presentation/
│   ├── hooks/
│   │   └── useHudState.ts            # Hook para gerenciar estado do HUD
│   └── hud/
│       ├── constants/
│       │   └── hudConstants.ts       # Constantes (modos, ícones, opções)
│       ├── components/
│       │   ├── index.ts              # Exportações dos componentes
│       │   ├── ModeButton.tsx        # Botão individual de modo
│       │   ├── ToolButton.tsx        # Botão individual de ferramenta
│       │   ├── ModePanel.tsx         # Painel com botões de modo
│       │   └── ToolPanel.tsx         # Painel com ferramentas do modo
│       ├── ToolHud.tsx               # Componente principal refatorado
│       └── README.md                 # Esta documentação
```

## Componentes

### `ToolHud` (Principal)
- **Responsabilidade**: Orquestrar os painéis e gerenciar layout geral
- **Estado**: Delegado para `useHudState`
- **Renderização**: Composta por `ModePanel` e `ToolPanel`

### `ModePanel`
- **Responsabilidade**: Renderizar botões de seleção de modo
- **Props**: `currentMode`, `onModeToggle`
- **Composição**: Usa múltiplos `ModeButton`

### `ToolPanel`
- **Responsabilidade**: Renderizar ferramentas do modo ativo
- **Props**: `mode`, `selectedKey`, `onToolSelect`
- **Composição**: Usa múltiplos `ToolButton`

### `ModeButton`
- **Responsabilidade**: Botão individual para alternar modo
- **Props**: `mode`, `isActive`, `onToggle`
- **Estado**: Stateless, recebe dados via props

### `ToolButton`
- **Responsabilidade**: Botão individual para selecionar ferramenta
- **Props**: `option`, `isActive`, `onSelect`
- **Estado**: Stateless, recebe dados via props

## Hook Customizado

### `useHudState`
- **Responsabilidade**: Centralizar lógica de estado do HUD
- **Estado**: `mode`, `selected`, `activeSelectedKey`
- **Métodos**: `toggleMode`, `selectOption`
- **Benefícios**: Reutilizável, testável, separação de responsabilidades

## Utilitários e Constantes

### `classNames.ts`
- **Função**: `cn()` para concatenar classes condicionalmente
- **Localização**: `src/shared/utils/` (reutilizável em todo projeto)

### `hudConstants.ts`
- **Conteúdo**: `MODE_LABEL`, `MODE_ICON`, `MODE_OPTIONS`
- **Benefícios**: Centralizadas, fáceis de manter, tipadas

### `HudTypes.ts`
- **Conteúdo**: Todos os tipos TypeScript relacionados ao HUD
- **Localização**: `src/core/types/ui/` (seguindo arquitetura do projeto)

## Padrões Aplicados

### 1. **Arquitetura do Projeto**
- Tipos em `src/core/types/`
- Hooks em `src/presentation/hooks/`
- Componentes organizados por funcionalidade
- Utilitários em `src/shared/`

### 2. **Convenções de Nomenclatura**
- PascalCase para componentes React
- camelCase para funções e variáveis
- Nomes descritivos e consistentes

### 3. **TypeScript**
- Tipagem estrita sem `any`
- Interfaces bem definidas
- Props tipadas para todos os componentes

### 4. **React + Vite + Tailwind**
- Componentes funcionais com hooks
- Classes Tailwind organizadas
- Otimização para build com Vite

## Uso

```tsx
import { ToolHud } from './presentation/hud/ToolHud';

// No componente pai
<ToolHud />
```

