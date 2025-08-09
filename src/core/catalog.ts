import type { CatalogItem } from './types';

export type Catalog = {
  items: CatalogItem[];
  byId: Map<string, CatalogItem>;
  categories: Map<CatalogItem['category'], CatalogItem[]>;
};

export async function loadCatalog(): Promise<Catalog> {
  const resp = await fetch('/catalog.json');
  const items = (await resp.json()) as CatalogItem[];
  const byId = new Map(items.map((i) => [i.id, i] as const));
  const categories = new Map<CatalogItem['category'], CatalogItem[]>();
  for (const it of items) {
    const list = categories.get(it.category) ?? [];
    list.push(it);
    categories.set(it.category, list);
  }
  return { items, byId, categories };
}
