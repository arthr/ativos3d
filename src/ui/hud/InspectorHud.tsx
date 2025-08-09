import { useMemo } from "react";
import { useStore } from "../../store/useStore";
import { catalog } from "../../core/catalog";

export function InspectorHud() {
	const selectedIds = useStore((s) => s.selectedIds);
	const idToItem = useMemo(() => {
		const map = new Map<string, any>();
		for (const item of catalog as any[]) map.set(item.id, item);
		return map;
	}, []);

	if (selectedIds.length === 0) return null;
	const selectedId = selectedIds[0];
	return (
		<div
			style={{
				background: "rgba(255,255,255,0.95)",
				border: "1px solid #e5e7eb",
				borderRadius: 8,
				padding: 8,
				boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
			}}>
			<div style={{ fontWeight: 700, marginBottom: 6 }}>Inspector</div>
			<div style={{ fontSize: 12 }}>Objeto: {selectedId}</div>
			{/* Extender com propriedades do objeto e variantes */}
		</div>
	);
}
