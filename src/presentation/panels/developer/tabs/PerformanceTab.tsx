import type { JSX } from "react";
import { DeveloperStats } from "@/presentation/panels/developer/components/DeveloperStats";

/**
 * PerformanceTab: mostra métricas e oferece toggles de stats.
 */
export function PerformanceTab({
    show,
    panel,
    statsLabel,
    onToggleStats,
    onCyclePanel,
}: {
    readonly show: boolean;
    readonly panel: 0 | 1 | 2;
    readonly statsLabel: string;
    onToggleStats(): void;
    onCyclePanel(): void;
}): JSX.Element {
    return (
        <div className="flex h-full flex-col">
            <div className="border-b border-slate-100 px-3 py-2 flex items-center gap-2">
                <button
                    onClick={onToggleStats}
                    className={`rounded-md p-1 ${show ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
                    title="Toggle performance stats"
                    aria-label="Toggle performance stats"
                >
                    {show ? "Hide" : "Show"} stats
                </button>
                <button
                    onClick={onCyclePanel}
                    className="rounded-md bg-slate-800 p-1 text-white hover:bg-black"
                    title={`Cycle stats panel (${statsLabel})`}
                    aria-label="Cycle stats panel"
                >
                    Next panel
                </button>
                <span className="rounded size-6 bg-slate-100 text-[10px] flex items-center justify-center">
                    {statsLabel}
                </span>
            </div>
            <div className="flex-1 overflow-auto p-3">
                <DeveloperStats show={show} panel={panel} onCyclePanel={onCyclePanel} />
            </div>
        </div>
    );
}
