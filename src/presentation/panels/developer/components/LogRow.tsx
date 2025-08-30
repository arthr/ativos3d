import { useEffect, useRef, useState, type JSX } from "react";

const fmt = (ts: number): string =>
    new Date(ts).toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });

function safePretty(v: unknown): string {
    try {
        return JSON.stringify(v, null, 2);
    } catch {
        return String(v);
    }
}

/**
 * LogRow: item da lista de eventos do DevPanel.
 */
export function LogRow({
    type,
    timestamp,
    payload,
    autoscroll,
}: {
    type: string;
    timestamp: number;
    payload?: unknown;
    autoscroll: boolean;
}): JSX.Element {
    const ref = useRef<HTMLLIElement | null>(null);
    const [open, setOpen] = useState(false);
    useEffect(() => {
        if (autoscroll) ref.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, [autoscroll]);
    return (
        <li ref={ref} className="rounded border border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between gap-2 px-2 py-1">
                <div className="flex items-center gap-2">
                    <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-medium text-white">
                        {type}
                    </span>
                    <span className="text-[10px] text-slate-500">{fmt(timestamp)}</span>
                </div>
                <button onClick={() => setOpen((v) => !v)} className="text-[11px] text-slate-600 hover:underline">
                    {open ? "Hide" : "Show"} payload
                </button>
            </div>
            {open && (
                <pre className="max-h-52 overflow-auto whitespace-pre-wrap break-words bg-white px-2 py-2 text-[11px] text-slate-800">
                    {safePretty(payload)}
                </pre>
            )}
        </li>
    );
}

