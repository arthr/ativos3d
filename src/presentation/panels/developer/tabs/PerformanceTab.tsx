import type { JSX } from "react";
import { DeveloperStats } from "@presentation/panels/developer/components/DeveloperStats";
import { FiActivity, FiRefreshCcw } from "react-icons/fi";
import { DevButton } from "@presentation/panels/developer/components/DevButton";

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
                <DevButton
                    onClick={onToggleStats}
                    variant="toggle"
                    active={show}
                    title="Toggle performance stats"
                    aria-label="Toggle performance stats"
                >
                    <span className="inline-flex items-center gap-1">
                        <FiActivity size={12} /> {show ? "Hide" : "Show"} stats
                    </span>
                </DevButton>
                <DevButton
                    onClick={onCyclePanel}
                    variant="primary"
                    title={`Cycle stats panel (${statsLabel})`}
                    aria-label="Cycle stats panel"
                >
                    <span className="inline-flex items-center gap-1">
                        <FiRefreshCcw size={12} /> Next panel
                    </span>
                </DevButton>
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
