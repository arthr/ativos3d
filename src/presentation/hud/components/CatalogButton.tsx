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
                "group inline-flex flex-col items-center gap-1 rounded-xl select-none overflow-hidden",
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
                    "grid place-items-center h-16 w-24",
                    "overflow-hidden",
                    enabled && isActive
                        ? "ring-white/40 bg-white/10"
                        : "ring-black/10 dark:ring-white/10 bg-black/5 dark:bg-white/5",
                )}
            >
                <img
                    src={`data:image/jpeg;base64,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`}
                    alt={label}
                    className="size-24 object-center object-fill rounded-b-md"
                />
                {/* <Icon className="text-lg" /> */}
            </div>

            <div className="flex flex-col items-center gap-0.5 pb-1">
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
