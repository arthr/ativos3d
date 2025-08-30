import type { JSX } from "react";
import { DevInput } from "@presentation/panels/developer/components/DevInput";

/**
 * EntitiesTab: lista e ações sobre entidades (SRP).
 */
export function EntitiesTab({
    entities,
    entityFilter,
    onChangeEntityFilter,
    selected,
    onToggleSelected,
    activeEntityId,
    onInspect,
    onCreateEntity,
    onDestroyEntity,
    onDestroySelected,
}: {
    readonly entities: string[];
    readonly entityFilter: string;
    onChangeEntityFilter(value: string): void;
    readonly selected: Record<string, boolean>;
    onToggleSelected(id: string, checked: boolean): void;
    readonly activeEntityId: string | null;
    onInspect(id: string): void;
    onCreateEntity(): void;
    onDestroyEntity(id: string): void;
    onDestroySelected(): void;
}): JSX.Element {
    const filtered = entityFilter
        ? entities.filter((id) => id.toLowerCase().includes(entityFilter.toLowerCase()))
        : entities;

    const anySelected = Object.values(selected).some(Boolean);

    return (
        <div className="flex h-full flex-col">
            <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2">
                <DevInput
                    placeholder="search by id…"
                    value={entityFilter}
                    onChange={(e) => onChangeEntityFilter(e.target.value)}
                    className="flex-1"
                />
                <button
                    onClick={onCreateEntity}
                    className="rounded-md bg-blue-600 px-3 py-1 text-[11px] text-white hover:bg-blue-700"
                >
                    Create
                </button>
                <button
                    onClick={onDestroySelected}
                    disabled={!anySelected}
                    className={`rounded-md px-3 py-1 text-[11px] ${anySelected ? "bg-rose-600 text-white hover:bg-rose-700" : "bg-slate-50 text-slate-300 cursor-not-allowed"}`}
                >
                    Remove selected
                </button>
            </div>
            <ul className="max-h-full space-y-1 overflow-auto px-3 py-2">
                {filtered.map((id) => {
                    const checked = !!selected[id];
                    const isActive = activeEntityId === id;
                    return (
                        <li
                            key={id}
                            className={`flex items-center justify-between rounded border px-2 py-1 ${isActive ? "border-blue-400 bg-blue-50" : "border-slate-200 bg-slate-50"}`}
                        >
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={(e) => onToggleSelected(id, e.target.checked)}
                                />
                                <span className="font-mono text-[11px]">{id}</span>
                            </label>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => onInspect(id)}
                                    className="rounded bg-slate-200 px-2 py-0.5 text-[11px] hover:bg-slate-300"
                                >
                                    Inspect
                                </button>
                                <button
                                    onClick={() => onDestroyEntity(id)}
                                    className="rounded bg-rose-600 px-2 py-0.5 text-[11px] text-white hover:bg-rose-700"
                                >
                                    Remove
                                </button>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

