# 📚 Documentação do Projeto Ativos3D

> Documentação organizada por categoria e propósito

## 📁 Estrutura da Documentação

### 🏗️ **Architecture** - Arquitetura e Design
Documentação sobre a arquitetura do sistema, contexto e planos de refatoração.

- **[CONTEXT.md](./architecture/CONTEXT.md)** - Contexto completo do projeto, tecnologias e arquitetura
- **[REFAC.md](./architecture/REFAC.md)** - Plano detalhado de refatoração do sistema legado
- **[COMPARISON.md](./architecture/COMPARISON.md)** - Comparação entre sistema legado e nova arquitetura

### 📋 **Requirements** - Requisitos e Especificações
Documentação de requisitos funcionais, matriz de funcionalidades e flowstates.

- **[RESOURCES_MATRIX.md](./requirements/RESOURCES_MATRIX.md)** - Matriz completa de requisitos funcionais
- **[CHECKLIST.md](./requirements/CHECKLIST.md)** - Checklist de funcionalidades implementadas
- **[resources-flowstate/](./requirements/resources-flowstate/)** - Flowstates detalhados de cada ferramenta

### 🛠️ **Development** - Guias de Desenvolvimento
Guias práticos para desenvolvimento, boas práticas e roadmaps.

- **[boas_praticas_3d.md](./development/boas_praticas_3d.md)** - Boas práticas para desenvolvimento 3D
- **[build_mechanics.md](./development/build_mechanics.md)** - Mecânicas de construção e ferramentas
- **[validation_pipeline.md](./development/validation_pipeline.md)** - Pipeline de validação e testes

### 🔄 **Legacy** - Documentação Legada
Documentação do sistema antigo preservada para referência durante a migração.

- **[LEGACY_AGENTS.md](./legacy/LEGACY_AGENTS.md)** - Instruções antigas para agents
- **[data_models.md](./legacy/data_models.md)** - Modelos de dados do sistema legado
- **[prompt_inicial.md](./legacy/prompt_inicial.md)** - Prompt inicial do projeto
- **[repo_map.md](./legacy/repo_map.md)** - Mapa antigo do repositório (desatualizado)

## 🧭 Como Navegar

### **Para Novos Desenvolvedores**
1. Comece com [../README.md](../README.md) - Visão geral do projeto
2. Leia [architecture/CONTEXT.md](./architecture/CONTEXT.md) - Contexto detalhado
3. Consulte [requirements/RESOURCES_MATRIX.md](./requirements/RESOURCES_MATRIX.md) - Requisitos
4. Explore [requirements/resources-flowstate/](./requirements/resources-flowstate/) - Comportamentos

### **Para Implementar Funcionalidades**
1. **Requisitos**: [requirements/RESOURCES_MATRIX.md](./requirements/RESOURCES_MATRIX.md)
2. **Comportamento**: [requirements/resources-flowstate/](./requirements/resources-flowstate/)
3. **Arquitetura**: [architecture/CONTEXT.md](./architecture/CONTEXT.md)
4. **Boas Práticas**: [development/boas_praticas_3d.md](./development/boas_praticas_3d.md)

### **Para Entender a Migração**
1. **Plano**: [architecture/REFAC.md](./architecture/REFAC.md)
2. **Comparação**: [architecture/COMPARISON.md](./architecture/COMPARISON.md)
3. **Sistema Antigo**: [legacy/](./legacy/)

## 🔗 Links Úteis

- 🧭 [AGENTS.md](../AGENTS.md) - Bússola para desenvolvimento
- 🗺️ [REPOMAP.md](../REPOMAP.md) - Mapa do código
- 🔗 [RELATION.md](../RELATION.md) - Relações entre documentações

## 📊 Status da Documentação

| Categoria | Status | Arquivos | Atualização |
|-----------|--------|----------|-------------|
| **Architecture** | 🟢 Completa | 3 | Recente |
| **Requirements** | 🟢 Completa | 22+ | Recente |
| **Development** | 🟡 Parcial | 3 | Média |
| **Legacy** | 🔴 Arquivada | 4 | Antiga |

---

**💡 Dica**: Use esta estrutura para encontrar rapidamente a documentação que precisa. Cada categoria tem um propósito específico e audiência definida.
