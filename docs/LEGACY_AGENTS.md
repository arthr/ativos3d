# AGENTS.md — Instruções para Codex

Você é um agente responsável por ler, compreender e modificar o código deste repositório seguindo as regras e diretrizes definidas.

## Contexto da Aplicação
- Todas as informações de contexto, arquitetura, integrações, fluxos de dados e decisões técnicas estão localizadas na pasta:
```

/docs

```
- Antes de sugerir, criar ou alterar qualquer código, **leia e entenda** o conteúdo de `/docs`.

## Diretrizes de Desenvolvimento
- As regras e padrões obrigatórios para escrita e organização do código estão no arquivo:
```

.cursorrules

```
- **Sempre** siga essas diretrizes ao gerar código, revisar PRs ou propor mudanças.

## Regras de Operação
1. **Consultar primeiro `/docs`** para entender o contexto antes de gerar qualquer resposta ou código.
2. **Seguir estritamente o `.cursorrules`** como fonte única de padrões e estilo de código.
3. **Nunca ignorar ou sobrescrever** as regras do `.cursorrules`.
4. Se houver divergência entre `/docs` e `.cursorrules`:
 - Use `/docs` para **contexto e entendimento da aplicação**.
 - Use `.cursorrules` para **padrões de código e estilo**.

## Objetivo
Gerar código funcional, coerente com o contexto da aplicação, consistente com as regras definidas e alinhado com as melhores práticas.

---
> **Nota para o Codex:** Toda sugestão, modificação ou código gerado deve considerar **ambos**: contexto (`/docs`) e diretrizes (`.cursorrules`) **antes** de ser apresentado.
