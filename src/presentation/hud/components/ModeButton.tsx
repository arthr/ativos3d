import type { JSX } from "react";
import type { ModeButtonProps } from "@core/types/ui/HudTypes";
import { MODE_LABEL, MODE_ICON } from "../constants/hudConstants";
import { cn } from "@shared/utils/classNames";

/**
 * Botão para alternar entre modos do HUD
 * Exibe ícone e label do modo com estado visual ativo/inativo
 */
export function ModeButton({ mode, isActive, onToggle }: ModeButtonProps): JSX.Element {
    const Icon = MODE_ICON[mode];
    const label = MODE_LABEL[mode];

    function handleClick(): void {
        onToggle(mode);
    }

    return (
        <button
            aria-label={`${label} (modo)`}
            aria-pressed={isActive}
            onClick={handleClick}
            className={cn(
                "group inline-flex items-center gap-2 px-3 py-2 rounded-xl select-none",
                "transition-all",
                isActive
                    ? "bg-emerald-500 text-white shadow-inner"
                    : "bg-white/70 dark:bg-neutral-800/70 text-neutral-800 dark:text-neutral-200 hover:bg-white dark:hover:bg-neutral-800",
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
                <Icon className="text-lg" />
                <span className="text-xs font-medium">{label}</span>
            </div>
        </button>
    );
}
