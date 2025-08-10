import { useStore } from "../store/useStore";
import type { Command } from "../store/useStore";

// Decorator de orçamento: ajusta s.budget.spent no execute/undo
export function withBudget(command: Command, delta: number): Command {
  return {
    description: command.description,
    execute: () => {
      command.execute();
      useStore.setState((s) => ({
        budget: { ...s.budget, spent: s.budget.spent + delta },
      }));
    },
    undo: () => {
      command.undo();
      useStore.setState((s) => ({
        budget: { ...s.budget, spent: s.budget.spent - delta },
      }));
    },
  };
}
