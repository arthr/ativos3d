import type { ButtonHTMLAttributes, JSX } from "react";

type Variant = "primary" | "secondary" | "danger" | "success" | "neutral" | "toggle";

/**
 * DevButton: botão padronizado para o DeveloperPanel.
 * - Mantém consistência visual e evita repetição de classes (DRY/KISS).
 */
export function DevButton({
    variant = "neutral",
    active = false,
    className = "",
    children,
    ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
    readonly variant?: Variant;
    readonly active?: boolean;
}): JSX.Element {
    const base = "rounded-md px-2 py-1 text-[11px] transition-colors";
    const theme = resolveTheme(variant, active);
    return (
        <button className={`${base} ${theme} ${className}`.trim()} {...rest}>
            {children}
        </button>
    );
}

function resolveTheme(variant: Variant, active: boolean): string {
    switch (variant) {
        case "primary":
            return "bg-slate-800 text-white hover:bg-black";
        case "secondary":
            return "bg-indigo-600 text-white hover:bg-indigo-700";
        case "danger":
            return "bg-rose-600 text-white hover:bg-rose-700";
        case "success":
            return "bg-emerald-600 text-white hover:bg-emerald-700";
        case "toggle":
            return active
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200";
        case "neutral":
        default:
            return "bg-slate-100 text-slate-700 hover:bg-slate-200";
    }
}

