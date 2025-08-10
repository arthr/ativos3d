import { useStore } from "../../../store/useStore";
import { useCurrencyBRL } from "../../hooks/useCurrencyBRL";

export function BudgetBar() {
  const budget = useStore((s) => s.budget);
  const fmt = useCurrencyBRL();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: 8,
        background: "#ffffff",
        borderBottom: "1px solid #e5e5e5",
        fontSize: 10,
      }}
    >
      <div style={{ display: "flex", flexDirection: "row", gap: 4 }}>
        <span>
          Saldo: <span style={{ color: "green", fontWeight: "bold" }}>{fmt(budget.funds)}</span>
        </span>
        <span>
          Gastos: <span style={{ color: "red", fontWeight: "bold" }}>{fmt(budget.spent, -1)}</span>{" "}
          (
          <span style={{ color: "red", fontSize: 10, fontWeight: "bold" }}>
            {((budget.spent / (budget.funds + budget.spent)) * 100).toFixed(2)}%
          </span>
          )
        </span>
      </div>
    </div>
  );
}

export default BudgetBar;
