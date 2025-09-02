import { useState, useMemo } from "react";
import type { HudCatalogItem } from "@core/types/ui/HudTypes";

/**
 * Hook para gerenciar filtros do catálogo
 * Centraliza lógica de busca por texto, categoria e tags
 */
export function useCatalogFilters(items: HudCatalogItem[]): {
    searchText: string;
    selectedCategory: string | null;
    filteredItems: HudCatalogItem[];
    availableCategories: string[];
    setSearchText: (text: string) => void;
    setSelectedCategory: (category: string | null) => void;
    clearFilters: () => void;
} {
    const [searchText, setSearchText] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    /**
     * Categorias disponíveis nos itens
     */
    const availableCategories = useMemo(() => {
        const categories = new Set(items.map((item) => item.category));
        return Array.from(categories).sort();
    }, [items]);

    /**
     * Itens filtrados baseado nos critérios
     */
    const filteredItems = useMemo(() => {
        return items.filter((item) => {
            // Filtro por texto (busca em label, tags e category)
            const matchesSearch =
                searchText === "" ||
                item.label.toLowerCase().includes(searchText.toLowerCase()) ||
                item.tags.some((tag) => tag.toLowerCase().includes(searchText.toLowerCase())) ||
                item.category.toLowerCase().includes(searchText.toLowerCase());

            // Filtro por categoria
            const matchesCategory = selectedCategory === null || item.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [items, searchText, selectedCategory]);

    /**
     * Limpa todos os filtros
     */
    function clearFilters(): void {
        setSearchText("");
        setSelectedCategory(null);
    }

    return {
        searchText,
        selectedCategory,
        filteredItems,
        availableCategories,
        setSearchText,
        setSelectedCategory,
        clearFilters,
    };
}
