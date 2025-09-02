import type { JSX } from "react";
import type { CatalogPanelProps } from "@core/types/ui/HudTypes";
import { CatalogButton } from "./CatalogButton";
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
            <div className="mb-2 flex items-center gap-2">
                <span className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                    Catálogo
                </span>
                {selectedKey && (
                    <span className="rounded-md bg-emerald-500/10 dark:bg-emerald-400/10 px-2 py-0.5 text-xs text-emerald-700 dark:text-emerald-300">
                        {items.find((item) => item.key === selectedKey)?.label || selectedKey}
                    </span>
                )}
            </div>

            <div className="flex items-stretch gap-3">
                {items.map((item) => (
                    <CatalogButton
                        key={item.key}
                        item={item}
                        isActive={selectedKey === item.key}
                        onSelect={() => handleCatalogSelect(item.key)}
                    />
                ))}
            </div>
        </div>
    );
}
