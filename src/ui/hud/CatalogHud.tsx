import { catalog } from "../../core/catalog";
import { useStore } from "../../store/useStore";

export function CatalogHud() {
	const selected = useStore((s) => s.selectedCatalogId);
	const setSelectedCatalogId = useStore((s) => s.setSelectedCatalogId);
	return (
		<div
			style={{
				background: "rgba(255,255,255,0.95)",
				border: "1px solid #e5e7eb",
				borderRadius: 8,
				padding: 8,
				boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
			}}>
			<div style={{ fontWeight: 700, marginBottom: 6 }}>Catálogo</div>
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
					gap: 6,
					maxHeight: 260,
					overflow: "auto",
				}}>
                {(catalog as unknown as Array<{ id: string; name: string; price: number }>).map((item) => (
					<button
						key={item.id}
						onClick={() => setSelectedCatalogId(item.id)}
						style={{
							textAlign: "left",
							border: "1px solid #e5e7eb",
							borderRadius: 6,
							padding: 8,
							background:
								selected === item.id ? "#e0f2fe" : "#fff",
						}}>
						<div style={{ fontWeight: 600, fontSize: 12 }}>
							{item.name}
						</div>
						<div style={{ fontSize: 11, color: "#475569" }}>
							R$ {item.price}
						</div>
					</button>
				))}
			</div>
		</div>
	);
}
