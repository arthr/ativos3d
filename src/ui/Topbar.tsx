import React from 'react';
import { useStore } from '../store/useStore';
import { Toolbar } from './Toolbar';
import { BudgetBar } from './BudgetBar';

export function Topbar() {
  const spent = useStore((s) => s.lot.budget.spent);
  const funds = useStore((s) => s.lot.budget.funds);
  return (
    <div style={{ display: 'flex', width: '100%', gap: 12, alignItems: 'center' }}>
      <Toolbar />
      <div style={{ marginLeft: 'auto' }}>
        <BudgetBar spent={spent} funds={funds} />
      </div>
    </div>
  );
}
