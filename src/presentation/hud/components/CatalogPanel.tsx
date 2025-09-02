import type { JSX } from "react";
import type { CatalogPanelProps } from "@core/types/ui/HudTypes";
import { CatalogButton } from "./CatalogButton";
import { CatalogFilters } from "./CatalogFilters";
import { useCatalogFilters } from "../../hooks/useCatalogFilters";
import { cn } from "@shared/utils/classNames";

/**
 * Painel com itens do catálogo para seleção
 * Renderiza grid de itens com scroll horizontal se necessário
 */
export function CatalogPanel({
    items,
    selectedKey,
    onCatalogSelect,
}: CatalogPanelProps): JSX.Element {
    const {
        searchText,
        selectedCategory,
        filteredItems,
        availableCategories,
        setSearchText,
        setSelectedCategory,
        clearFilters,
    } = useCatalogFilters(items);

    function handleCatalogSelect(key: string): void {
        onCatalogSelect(key);
    }

    return (
        <div
            className={cn(
                "pointer-events-auto max-w-[85vw] overflow-x-auto",
                "rounded-2xl bg-white/75 dark:bg-neutral-900/60",
                "backdrop-blur-md ring-1 ring-black/10 dark:ring-white/10 shadow-xl",
                "px-4 py-3",
            )}
        >
            <CatalogFilters
                searchText={searchText}
                selectedCategory={selectedCategory}
                availableCategories={availableCategories}
                onSearchChange={setSearchText}
                onCategoryChange={setSelectedCategory}
                onClearFilters={clearFilters}
                totalItems={items.length}
                filteredCount={filteredItems.length}
            />

            {filteredItems.length > 0 ? (
                <div className="flex items-stretch gap-3">
                    {filteredItems.map((item) => (
                        <CatalogButton
                            key={item.key}
                            item={item}
                            isActive={selectedKey === item.key}
                            onSelect={() => handleCatalogSelect(item.key)}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="text-neutral-400 dark:text-neutral-500 mb-2">
                        <svg
                            className="w-12 h-12 mx-auto mb-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">
                        Nenhum item encontrado
                    </p>
                    <p className="text-xs text-neutral-400 dark:text-neutral-500">
                        Tente ajustar os filtros de busca
                    </p>
                </div>
            )}
        </div>
    );
}
