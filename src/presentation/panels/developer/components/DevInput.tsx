import type { InputHTMLAttributes, JSX } from "react";

const INPUT_BASE =
    "rounded-md border border-slate-300 bg-white px-2 py-1 text-[11px] outline-none focus:ring-2 focus:ring-slate-400";

/**
 * DevInput: input padronizado para o DeveloperPanel (DRY/KISS).
 */
export function DevInput({ className = "", ...rest }: InputHTMLAttributes<HTMLInputElement>): JSX.Element {
    return <input className={`${INPUT_BASE} ${className}`.trim()} {...rest} />;
}

export const DEV_INPUT_BASE_CLASS = INPUT_BASE;

