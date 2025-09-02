import type { JSX } from "react";
import type { ModePanelProps, HudMode } from "@core/types/ui/HudTypes";
import { MODE_LABEL } from "../constants/hudConstants";
import { ModeButton } from "./ModeButton";

/**
 * Painel com botões de seleção de modo
 * Renderiza todos os modos disponíveis com estado visual
 */
export function ModePanel({ currentMode, onModeToggle }: ModePanelProps): JSX.Element {
    const modes = Object.keys(MODE_LABEL) as Array<Exclude<HudMode, null>>;

    return (
        <div
            className="
                pointer-events-auto
                flex items-center gap-1
                rounded-2xl
                bg-white/70 dark:bg-neutral-900/60
                backdrop-blur-md
                ring-1 ring-black/10 dark:ring-white/10
                shadow-lg
                p-2
            "
        >
            {modes.map((mode) => (
                <ModeButton
                    key={mode}
                    mode={mode}
                    isActive={currentMode === mode}
                    onToggle={onModeToggle}
                />
            ))}
        </div>
    );
}
