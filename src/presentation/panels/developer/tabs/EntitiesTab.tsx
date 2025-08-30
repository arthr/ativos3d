import type { JSX } from "react";
import { DevInput } from "@presentation/panels/developer/components/DevInput";
import { DevButton } from "@presentation/panels/developer/components/DevButton";

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
                <DevButton onClick={onCreateEntity} variant="primary">
                    Create
                </DevButton>
                <DevButton onClick={onDestroySelected} variant="danger" disabled={!anySelected}>
                    Remove selected
                </DevButton>
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
                                <DevButton onClick={() => onInspect(id)}>
                                    Inspect
                                </DevButton>
                                <DevButton onClick={() => onDestroyEntity(id)} variant="danger">
                                    Remove
                                </DevButton>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
