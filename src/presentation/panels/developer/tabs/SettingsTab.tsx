import type { JSX } from "react";
import { FiTrash2, FiRefreshCcw, FiChevronUp, FiChevronDown, FiGrid, FiAperture } from "react-icons/fi";

/**
 * SettingsTab: configurações gerais do Dev Panel (persistências e resets).
 */
export function SettingsTab({
    open,
    onToggleOpenDefault,
    onResetPanelSize,
    onClearDevStorage,
    onResetViewDefaults,
}: {
    readonly open: boolean;
    onToggleOpenDefault(): void;
    onResetPanelSize(): void;
    onClearDevStorage(): void;
    onResetViewDefaults(): void;
}): JSX.Element {
    return (
        <div className="flex h-full flex-col p-3 gap-3">
            <section className="rounded border border-slate-200 bg-white p-2">
                <div className="mb-1 text-[11px] font-semibold">Panel</div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={onToggleOpenDefault}
                        className="inline-flex items-center gap-1 rounded-md bg-slate-800 px-2 py-1 text-[11px] text-white hover:bg-black"
                    >
                        {open ? <FiChevronUp size={12} /> : <FiChevronDown size={12} />}
                        {open ? "Collapse on start" : "Expand on start"}
                    </button>
                    <button
                        onClick={onResetPanelSize}
                        className="inline-flex items-center gap-1 rounded-md bg-slate-800 px-2 py-1 text-[11px] text-white hover:bg-black"
                    >
                        <FiRefreshCcw size={12} /> Reset size
                    </button>
                </div>
            </section>

            <section className="rounded border border-slate-200 bg-white p-2">
                <div className="mb-1 text-[11px] font-semibold">View defaults</div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={onResetViewDefaults}
                        className="inline-flex items-center gap-1 rounded-md bg-slate-800 px-2 py-1 text-[11px] text-white hover:bg-black"
                    >
                        <FiGrid size={12} /> <FiAperture size={12} /> Reset
                    </button>
                </div>
            </section>

            <section className="rounded border border-slate-200 bg-white p-2">
                <div className="mb-1 text-[11px] font-semibold">Storage</div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={onClearDevStorage}
                        className="inline-flex items-center gap-1 rounded-md bg-rose-600 px-2 py-1 text-[11px] text-white hover:bg-rose-700"
                    >
                        <FiTrash2 size={12} /> Clear devpanel storage
                    </button>
                </div>
            </section>
        </div>
    );
}

