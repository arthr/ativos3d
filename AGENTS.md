## Diretivas Globais do Sistema

- **Siga estritamente** as regras contidas no arquivo `/.cursor/.cursorrules`. Em caso de conflito, **pare** e **ajuste o plano** para cumprir `/.cursor/.cursorrules`.
- **Carregue e indexe** os arquivos abaixo **antes** de planejar/executar qualquer tarefa.
- **Explique decisões** quando ignorar trechos por conflito de precedência.
- **Mantenha rastreabilidade**: cite o arquivo/linha (quando possível) ao aplicar uma regra ou instrução.

```txt
Se detectar divergência entre arquivos:
1) Priorize `/.cursor/.cursorrules`.
2) Em seguida, `README.md`.
3) Depois, `REFAC.md`.
4) Depois, `CONTEXT.md`.
5) Por fim, demais fontes.
Se ainda houver ambiguidade: proponha 2–3 opções e escolha a mais aderente a `/.cursor/.cursorrules` e ao `CONTEXT.md`.