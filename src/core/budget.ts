import { useStore } from "../store/useStore";
import { useToastStore } from "../ui/hud";
import type { Command } from "../store/useStore";

/**
 * Decorador de orçamento: ajusta s.budget.spent e s.budget.funds no execute/undo
 * @param command - Comando a ser decorado
 * @param delta - Valor de custo a ser aplicado ao orçamento
 * @returns Comando decorado com controle de orçamento
 */
export function withBudget(command: Command, delta: number): Command {
  const updateBudget = (modifier: number) => {
    useStore.setState((state) => ({
      budget: {
        ...state.budget,
        spent: state.budget.spent + modifier * delta,
        funds: state.budget.funds - modifier * delta,
      },
    }));
  };

  return {
    description: command.description,
    execute: () => {
      if (delta > 0) {
        const { funds } = useStore.getState().budget;
        if (funds < delta) {
          try {
            useToastStore.getState().push({
              message: `Orçamento insuficiente!`,
              title: "Sem fundos",
              variant: "warning",
              durationMs: 3500,
            });
          } catch {}
          return false;
        }
      }

      const result = command.execute();
      if (result === false) return false;

      updateBudget(1);

      return result;
    },
    undo: () => {
      command.undo();
      updateBudget(-1);
    },
  };
}
