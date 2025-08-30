import type { JSX } from "react";
import { DevInput } from "@presentation/panels/developer/components/DevInput";
import { DevButton } from "@presentation/panels/developer/components/DevButton";

import type { Command } from "@core/types";

/**
 * CommandsTab: execução, undo/redo e histórico de comandos.
 */
export function CommandsTab({
    history,
    canUndo,
    canRedo,
    commandDesc,
    onChangeCommandDesc,
    onExec,
    onUndo,
    onRedo,
    onClearHistory,
}: {
    readonly history: readonly Command[];
    readonly canUndo: boolean;
    readonly canRedo: boolean;
    readonly commandDesc: string;
    onChangeCommandDesc(value: string): void;
    onExec(): void;
    onUndo(): void;
    onRedo(): void;
    onClearHistory(): void;
}): JSX.Element {
    const fmt = (ts: number): string =>
        new Date(ts).toLocaleTimeString([], {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });

    return (
        <div className="flex h-full flex-col">
            <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2">
                <DevInput
                    placeholder="new command description"
                    value={commandDesc}
                    onChange={(e) => onChangeCommandDesc(e.target.value)}
                    className="flex-1"
                />
                <DevButton onClick={onExec} variant="primary">
                    Exec
                </DevButton>
                <DevButton onClick={onUndo} disabled={!canUndo}>
                    Undo
                </DevButton>
                <DevButton onClick={onRedo} disabled={!canRedo}>
                    Redo
                </DevButton>
                <DevButton onClick={onClearHistory} variant="danger">
                    Clear history
                </DevButton>
            </div>
            <ul className="max-h-full space-y-1 overflow-auto px-3 py-2">
                {history.map((c, i) => (
                    <li key={c.timestamp + i} className="rounded border border-slate-200 bg-slate-50 px-2 py-1">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px]">{c.description}</span>
                            <span className="text-[10px] text-slate-500">{fmt(c.timestamp)}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
