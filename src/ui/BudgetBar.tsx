import React from 'react';

export function BudgetBar({ spent, funds }: { spent: number; funds: number }) {
  return (
    <div className="badge">
      Orçamento: R$ {spent} / R$ {funds}
    </div>
  );
}
