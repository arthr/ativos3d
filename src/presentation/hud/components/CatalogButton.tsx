import type { JSX } from "react";
import type { CatalogButtonProps } from "@core/types/ui/HudTypes";
import { cn } from "@shared/utils/classNames";

/**
 * Botão para selecionar itens do catálogo
 * Exibe ícone, label, preço e estado enabled/disabled
 */
export function CatalogButton({ item, isActive, onSelect }: CatalogButtonProps): JSX.Element {
    const { Icon, label, price, enabled } = item;

    function handleClick(): void {
        if (enabled) {
            onSelect();
        }
    }

    return (
        <button
            aria-label={`${label} - R$ ${price}`}
            aria-pressed={isActive}
            disabled={!enabled}
            onClick={handleClick}
            className={cn(
                "group inline-flex flex-col items-center gap-1 p-3 rounded-xl select-none",
                "transition-all min-w-[80px]",
                !enabled && "opacity-50 cursor-not-allowed",
                enabled && isActive
                    ? "bg-emerald-500/90 text-white shadow-inner"
                    : "bg-white/80 dark:bg-neutral-800/80 text-neutral-800 dark:text-neutral-100",
                enabled && !isActive && "hover:bg-white dark:hover:bg-neutral-800",
            )}
        >
            <div
                className={cn(
                    "grid place-items-center h-12 w-12 rounded-lg",
                    "ring-1",
                    enabled && isActive
                        ? "ring-white/40 bg-white/10"
                        : "ring-black/10 dark:ring-white/10 bg-black/5 dark:bg-white/5",
                )}
            >
                <Icon className="text-lg" />
            </div>

            <div className="flex flex-col items-center gap-0.5">
                <span className="text-[11px] leading-none font-medium">{label}</span>
                {price > 0 && (
                    <span
                        className={cn(
                            "text-[10px] leading-none",
                            enabled && isActive
                                ? "text-white/80"
                                : "text-emerald-600 dark:text-emerald-400",
                        )}
                    >
                        R$ {price}
                    </span>
                )}
            </div>
        </button>
    );
}
