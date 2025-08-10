import React, { useMemo } from "react";
import { useStore } from "../../../store/useStore";
import { catalog } from "../../../core/catalog";
import { useCurrencyBRL } from "../../hooks/useCurrencyBRL";
import CatalogPanel from "./CatalogPanel";

export function CatalogContainer() {
  const selected = useStore((s) => s.selectedCatalogId);
  const setSelectedCatalogId = useStore((s) => s.setSelectedCatalogId);
  const fmt = useCurrencyBRL();

  const items = useMemo(
    () =>
      (catalog as Array<{ id: string; name: string; price: number }>).map((it) => ({
        id: it.id,
        name: it.name,
        price: it.price,
      })),
    [],
  ).map((it) => ({ ...it, price: Number.isFinite(it.price) ? fmt(it.price) : it.price }) as any);

  return (
    <CatalogPanel
      items={items as any}
      selectedId={selected}
      onSelect={(id) => setSelectedCatalogId(id)}
    />
  );
}

export default CatalogContainer;
