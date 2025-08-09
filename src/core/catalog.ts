import data from "../../catalog.json";
// Tipar levemente sem forçar migração completa do JSON 2D para 3D agora
export type AnyCatalogItem = Record<string, unknown>;
export const catalog: AnyCatalogItem[] = data as AnyCatalogItem[];
