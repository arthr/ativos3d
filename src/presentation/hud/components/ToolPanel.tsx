import type { JSX } from "react";
import type { ToolPanelProps } from "@core/types/ui/HudTypes";
import { MODE_OPTIONS } from "../constants/hudConstants";
import { ToolButton } from "./ToolButton";
import { cn } from "@shared/utils/classNames";

/**
 * Painel com ferramentas disponíveis para o modo selecionado
 * Renderiza botões de ferramentas com scroll horizontal se necessário
 */
export function ToolPanel({ mode, selectedKey, onToolSelect }: ToolPanelProps): JSX.Element {
    const options = MODE_OPTIONS[mode];

    function handleToolSelect(key: string): void {
        onToolSelect(key);
    }

    return (
        <div
            className={cn(
                "pointer-events-auto max-w-[78vw] overflow-x-auto",
                "rounded-2xl bg-white/75 dark:bg-neutral-900/60",
                "backdrop-blur-md ring-1 ring-black/10 dark:ring-white/10 shadow-xl",
                "px-3 py-2",
            )}
        >
            <div className="flex items-stretch gap-2">
                {options.map((option) => (
                    <ToolButton
                        key={option.key}
                        option={option}
                        isActive={selectedKey === option.key}
                        onSelect={() => handleToolSelect(option.key)}
                    />
                ))}
            </div>
        </div>
    );
}
