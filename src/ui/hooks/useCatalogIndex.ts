import { useMemo } from "react";
import { catalog } from "../../core/catalog";
import type { CatalogItem3D } from "../../core/types";

export function useCatalogIndex(): Map<string, CatalogItem3D> {
  return useMemo(() => {
    const map = new Map<string, CatalogItem3D>();
    for (const item of catalog as unknown as CatalogItem3D[]) map.set(item.id, item);
    return map;
  }, []);
}
