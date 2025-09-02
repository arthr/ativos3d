import type { JSX, ChangeEvent } from "react";
import { FiSearch, FiX, FiFilter } from "react-icons/fi";
import { cn } from "@shared/utils/classNames";

/**
 * Props para componente de filtros do catálogo
 */
interface CatalogFiltersProps {
    searchText: string;
    selectedCategory: string | null;
    availableCategories: string[];
    onSearchChange: (text: string) => void;
    onCategoryChange: (category: string | null) => void;
    onClearFilters: () => void;
    totalItems: number;
    filteredCount: number;
}

/**
 * Componente de filtros para o catálogo
 * Inclui busca por texto e filtro por categoria
 */
export function CatalogFilters({
    searchText,
    selectedCategory,
    availableCategories,
    onSearchChange,
    onCategoryChange,
    onClearFilters,
    totalItems,
    filteredCount,
}: CatalogFiltersProps): JSX.Element {
    const hasActiveFilters = searchText !== "" || selectedCategory !== null;

    function handleSearchChange(event: ChangeEvent<HTMLInputElement>): void {
        onSearchChange(event.target.value);
    }

    function handleCategoryChange(event: ChangeEvent<HTMLSelectElement>): void {
        const value = event.target.value;
        onCategoryChange(value === "" ? null : value);
    }

    function handleClearSearch(): void {
        onSearchChange("");
    }

    return (
        <div className="mb-3 space-y-2">
            {/* Linha superior: Busca e contador */}
            <div className="flex items-center gap-2">
                {/* Campo de busca */}
                <div className="relative flex-1">
                    <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 text-sm" />
                    <input
                        type="text"
                        placeholder="Buscar itens..."
                        value={searchText}
                        onChange={handleSearchChange}
                        className={cn(
                            "w-full pl-8 pr-8 py-1.5 text-sm",
                            "bg-white/50 dark:bg-neutral-800/50",
                            "border border-neutral-200/50 dark:border-neutral-700/50",
                            "rounded-lg",
                            "placeholder:text-neutral-400 dark:placeholder:text-neutral-500",
                            "text-neutral-800 dark:text-neutral-200",
                            "focus:outline-none focus:ring-2 focus:ring-emerald-500/50",
                            "transition-all",
                        )}
                    />
                    {searchText && (
                        <button
                            onClick={handleClearSearch}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                            aria-label="Limpar busca"
                        >
                            <FiX className="text-sm" />
                        </button>
                    )}
                </div>

                {/* Contador de resultados */}
                <div className="text-xs text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                    {filteredCount} de {totalItems}
                </div>
            </div>

            {/* Linha inferior: Filtros e ações */}
            <div className="flex items-center gap-2">
                {/* Filtro por categoria */}
                <div className="relative">
                    <FiFilter className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 text-sm pointer-events-none" />
                    <select
                        value={selectedCategory || ""}
                        onChange={handleCategoryChange}
                        className={cn(
                            "pl-8 pr-8 py-1.5 text-sm",
                            "bg-white/50 dark:bg-neutral-800/50",
                            "border border-neutral-200/50 dark:border-neutral-700/50",
                            "rounded-lg",
                            "text-neutral-800 dark:text-neutral-200",
                            "focus:outline-none focus:ring-2 focus:ring-emerald-500/50",
                            "transition-all",
                            "cursor-pointer",
                        )}
                    >
                        <option value="">Todas categorias</option>
                        {availableCategories.map((category) => (
                            <option key={category} value={category}>
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Botão limpar filtros */}
                {hasActiveFilters && (
                    <button
                        onClick={onClearFilters}
                        className={cn(
                            "px-2 py-1.5 text-xs",
                            "bg-neutral-100/50 dark:bg-neutral-700/50",
                            "border border-neutral-200/50 dark:border-neutral-600/50",
                            "rounded-lg",
                            "text-neutral-600 dark:text-neutral-300",
                            "hover:bg-neutral-200/50 dark:hover:bg-neutral-600/50",
                            "transition-all",
                        )}
                    >
                        Limpar
                    </button>
                )}
            </div>
        </div>
    );
}
