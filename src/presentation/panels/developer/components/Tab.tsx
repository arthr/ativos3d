import type { JSX } from "react";

/**
 * Pequeno botão de Tab reutilizável no DeveloperPanel
 */
export function Tab({
    label,
    active,
    onClick,
}: {
    label: string;
    active: boolean;
    onClick(): void;
}): JSX.Element {
    return (
        <button
            className={`rounded-md px-3 py-1 text-[11px] transition-colors ${active ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
            onClick={onClick}
        >
            {label}
        </button>
    );
}

