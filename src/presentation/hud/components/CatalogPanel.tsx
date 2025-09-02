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
                "pointer-events-auto w-[680px] transition-all",
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
                <div className="flex items-stretch gap-3 w-full overflow-x-auto">
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
                <div className="flex flex-col items-center w-full justify-center py-9.5 text-center">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        nenhum item encontrado
                    </p>
                </div>
            )}
        </div>
    );
}
