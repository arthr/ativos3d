import { useStore } from "../store/useStore";

export function BudgetBar() {
	const budget = useStore((s) => s.budget);
	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				gap: 12,
				padding: 8,
				background: "#ffffff",
				borderBottom: "1px solid #e5e5e5",
			}}>
			<strong>Budget:</strong>
			<span>Funds: R$ {budget.funds}</span>
			<span>Spent: R$ {budget.spent}</span>
		</div>
	);
}
