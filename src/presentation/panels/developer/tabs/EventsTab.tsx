import type { JSX } from "react";
import { FiSend, FiPlay, FiPause, FiChevronsDown, FiTrash2 } from "react-icons/fi";
import { DevInput } from "@presentation/panels/developer/components/DevInput";
import { DevButton } from "@presentation/panels/developer/components/DevButton";
import { LogRow } from "@presentation/panels/developer/components/LogRow";

export interface DevEventItem {
    t: number;
    type: string;
    payload?: unknown;
}

/**
 * EventsTab: filtros, emissão e stream de eventos.
 */
export function EventsTab({
    filtered,
    eventFilter,
    onChangeEventFilter,
    eventType,
    onChangeEventType,
    eventPayload,
    onChangeEventPayload,
    onEmit,
    paused,
    onTogglePaused,
    autoscroll,
    onToggleAutoscroll,
    onClear,
}: {
    readonly filtered: DevEventItem[];
    readonly eventFilter: string;
    onChangeEventFilter(value: string): void;
    readonly eventType: string;
    onChangeEventType(value: string): void;
    readonly eventPayload: string;
    onChangeEventPayload(value: string): void;
    onEmit(): void;
    readonly paused: boolean;
    onTogglePaused(): void;
    readonly autoscroll: boolean;
    onToggleAutoscroll(): void;
    onClear(): void;
}): JSX.Element {
    return (
        <div className="flex h-full flex-col">
            {/* Controls */}
            <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2">
                <DevInput
                    placeholder="filter by type/payload…"
                    value={eventFilter}
                    onChange={(e) => onChangeEventFilter(e.target.value)}
                    className="min-w-40 flex-1"
                />
                <DevInput
                    placeholder='emit: type (ex: "entityCreated")'
                    value={eventType}
                    onChange={(e) => onChangeEventType(e.target.value)}
                    className="w-48"
                />
                <DevInput
                    placeholder="emit: payload JSON (opcional)"
                    value={eventPayload}
                    onChange={(e) => onChangeEventPayload(e.target.value)}
                    className="w-64"
                />
                <DevButton
                    onClick={onEmit}
                    variant="success"
                    title="Emit event"
                    aria-label="Emit event"
                    className="p-1 px-2"
                >
                    <FiSend size={14} />
                </DevButton>
                <div className="mx-2 h-5 w-px bg-slate-200" />
                <DevButton
                    onClick={onTogglePaused}
                    variant="toggle"
                    active={paused}
                    title={paused ? "Resume logging" : "Pause logging"}
                    aria-label={paused ? "Resume logging" : "Pause logging"}
                    className="p-1 px-2"
                >
                    {paused ? <FiPlay size={14} /> : <FiPause size={14} />}
                </DevButton>
                <DevButton
                    onClick={onToggleAutoscroll}
                    variant={autoscroll ? "primary" : "neutral"}
                    title={autoscroll ? "Auto-scroll" : "Manual scroll"}
                    aria-label={autoscroll ? "Auto-scroll" : "Manual scroll"}
                    className="p-1 px-2"
                >
                    <FiChevronsDown size={14} />
                </DevButton>
                <DevButton
                    onClick={onClear}
                    variant="danger"
                    title="Clear events"
                    aria-label="Clear events"
                    className="p-1 px-2"
                >
                    <FiTrash2 size={14} />
                </DevButton>
            </div>
            {/* Stream */}
            <div className="h-full overflow-auto px-3 py-2 font-mono">
                <ul className="space-y-1">
                    {filtered.map((e, i) => (
                        <LogRow
                            key={`${e.t}-${i}`}
                            type={e.type}
                            timestamp={e.t}
                            payload={e.payload}
                            autoscroll={autoscroll && i === filtered.length - 1}
                        />
                    ))}
                </ul>
            </div>
        </div>
    );
}
