import type { JSX } from "react";
import type { ToolButtonProps } from "@core/types/ui/HudTypes";
import { cn } from "@shared/utils/classNames";

/**
 * Botão para selecionar ferramentas dentro de um modo
 * Exibe ícone e label da ferramenta com estado visual ativo/inativo
 */
export function ToolButton({ option, isActive, onSelect }: ToolButtonProps): JSX.Element {
    const { Icon, label } = option;

    return (
        <button
            aria-label={label}
            aria-pressed={isActive}
            onClick={onSelect}
            className={cn(
                "group inline-flex items-center gap-2 px-3 py-2 rounded-xl select-none",
                "transition-all",
                isActive
                    ? "bg-emerald-500/90 text-white shadow-inner"
                    : "bg-white/80 dark:bg-neutral-800/80 text-neutral-800 dark:text-neutral-100 hover:bg-white dark:hover:bg-neutral-800",
            )}
        >
            <div
                className={cn(
                    "grid place-items-center h-12 w-12 rounded-xl",
                    "ring-1",
                    isActive
                        ? "ring-white/40 bg-white/10"
                        : "ring-black/10 dark:ring-white/10 bg-black/5 dark:bg-white/5",
                )}
            >
                <Icon className="text-xl" />
                <span className="text-[11px] leading-none">{label}</span>
            </div>
        </button>
    );
}
