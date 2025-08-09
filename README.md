# Build/Buy MVP

## Stack
- React + TypeScript + Vite
- PixiJS para render
- Zustand para estado global

## Estrutura de Pastas
- /core – tipos, utilitários
- /systems – lógica de render e ferramentas
- /ui – componentes React
- /store – Zustand
- /docs – documentação técnica

## Comandos
- `pnpm install`
- `pnpm dev`
- `pnpm build`

## Fluxo de Desenvolvimento
1. Abrir catálogo em `catalog.json` para editar ou adicionar itens.
2. Implementar funcionalidades usando prompts prontos em `.cursor/prompts/`.
3. Usar snippets em `.cursor/snippets/` para código padrão.
4. Consultar mecânica em `/docs/` antes de mexer no pipeline de validação.