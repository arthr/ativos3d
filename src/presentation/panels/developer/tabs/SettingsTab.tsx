import { useMemo, useState, type JSX } from "react";
import {
    FiTrash2,
    FiRefreshCcw,
    FiChevronUp,
    FiChevronDown,
    FiGrid,
    FiAperture,
    FiFilter,
} from "react-icons/fi";
import { DevButton } from "@presentation/panels/developer/components/DevButton";
import { DevInput } from "@presentation/panels/developer/components/DevInput";

/**
 * SettingsTab: configurações gerais do Dev Panel (persistências e resets).
 */
export function SettingsTab({
    open,
    onToggleOpenDefault,
    onResetPanelSize,
    onClearDevStorage,
    onResetViewDefaults,
    knownEventTypes,
    selectedEventTypes,
    onUpdateEventTypes,
}: {
    readonly open: boolean;
    onToggleOpenDefault(): void;
    onResetPanelSize(): void;
    onClearDevStorage(): void;
    onResetViewDefaults(): void;
    readonly knownEventTypes: string[];
    readonly selectedEventTypes: string[];
    onUpdateEventTypes(next: string[]): void;
}): JSX.Element {
    const [eventsFilterQuery, setEventsFilterQuery] = useState("");
    const list = useMemo(() => {
        const q = eventsFilterQuery.trim().toLowerCase();
        const base = knownEventTypes;
        if (!q) return base;
        return base.filter((t) => t.toLowerCase().includes(q));
    }, [eventsFilterQuery, knownEventTypes]);
    return (
        <div className="flex h-full flex-row p-3 gap-3">
            {/* Left Column */}
            <div className="flex flex-col gap-3 w-1/2">
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
                        <DevButton onClick={onResetViewDefaults} variant="primary">
                            <span className="inline-flex items-center gap-1">
                                <FiGrid size={12} /> <FiAperture size={12} /> Reset
                            </span>
                        </DevButton>
                    </div>
                </section>

                <section className="rounded border border-slate-200 bg-white p-2">
                    <div className="mb-1 text-[11px] font-semibold">Storage</div>
                    <div className="flex items-center gap-2">
                        <DevButton onClick={onClearDevStorage} variant="danger">
                            <span className="inline-flex items-center gap-1">
                                <FiTrash2 size={12} /> Clear devpanel storage
                            </span>
                        </DevButton>
                    </div>
                </section>
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-3 w-1/2">
                {/* Events filter */}
                <section className="rounded border border-slate-200 bg-white p-2">
                    <div className="mb-1 text-[11px] font-semibold flex items-center gap-1">
                        <FiFilter size={12} /> Events filter (whitelist)
                    </div>
                    <div className="mb-2 flex items-center gap-2">
                        <DevInput
                            placeholder="filter list…"
                            value={eventsFilterQuery}
                            onChange={(e) => setEventsFilterQuery(e.target.value)}
                            className="flex-1"
                        />
                        <DevButton onClick={() => onUpdateEventTypes([])}>Select none</DevButton>
                        <DevButton
                            onClick={() => onUpdateEventTypes(knownEventTypes)}
                            variant="primary"
                        >
                            Select all
                        </DevButton>
                    </div>
                    <div className="max-h-48 overflow-auto rounded border border-slate-200">
                        <ul className="divide-y divide-slate-100">
                            {list.map((t) => {
                                const checked = selectedEventTypes.includes(t);
                                return (
                                    <li
                                        key={t}
                                        className="flex items-center justify-between px-2 py-1"
                                    >
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={checked}
                                                onChange={(e) => {
                                                    const next = new Set(selectedEventTypes);
                                                    if (e.target.checked) next.add(t);
                                                    else next.delete(t);
                                                    onUpdateEventTypes(Array.from(next));
                                                }}
                                            />
                                            <span className="text-[11px] font-mono">{t}</span>
                                        </label>
                                        {checked ? (
                                            <span className="text-[10px] text-emerald-600">
                                                included
                                            </span>
                                        ) : (
                                            <span className="text-[10px] text-slate-400">
                                                excluded
                                            </span>
                                        )}
                                    </li>
                                );
                            })}
                            {list.length === 0 && (
                                <li className="px-2 py-1 text-[11px] text-slate-500">
                                    No event types found
                                </li>
                            )}
                        </ul>
                    </div>
                </section>
            </div>
        </div>
    );
}
