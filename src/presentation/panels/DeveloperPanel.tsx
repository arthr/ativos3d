import { useEffect, useMemo, useRef, useState, type JSX } from "react";
import type { Command } from "@core/types";
import type { EventBus } from "@core/events/EventBus";
import { useApplication } from "@presentation/hooks/useApplication";

/** Utils */
const fmt = (ts: number): string =>
    new Date(ts).toLocaleTimeString([], {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

function useLocalStorage<T>(key: string, initial: T): [T, (val: T | ((prev: T) => T)) => void] {
    const [val, setVal] = useState<T>(() => {
        try {
            const raw = globalThis.localStorage.getItem(key);
            return raw ? (JSON.parse(raw) as T) : initial;
        } catch {
            return initial;
        }
    });
    useEffect(() => {
        try {
            globalThis.localStorage.setItem(key, JSON.stringify(val));
        } catch {
            console.error(`Failed to set localStorage item ${key}`, val);
        }
    }, [key, val]);
    return [val, setVal] as const;
}

/** Cria um comando simples que loga no bus */
function createDebugCommand(eventBus: EventBus, description: string): Command {
    return {
        description,
        timestamp: Date.now(),
        execute(): boolean {
            eventBus.emit("commandExecuted", {
                commandId: description,
                description,
                timestamp: Date.now(),
            });
            return true;
        },
        undo(): void {
            eventBus.emit("commandUndone", {
                commandId: description,
                description,
                timestamp: Date.now(),
            });
        },
    };
}

type TabKey = "events" | "commands" | "entities";

export function DeveloperPanel(): JSX.Element | null {
    const { eventBus, commandStack, entityManager, cameraSystem } = useApplication();

    /** Visibilidade e tamanho do painel */
    const [open, setOpen] = useLocalStorage<boolean>("devpanel:open", true);
    const [height, setHeight] = useLocalStorage<number>("devpanel:height", 280);
    const dragRef = useRef<HTMLDivElement | null>(null);
    const startY = useRef<number>(0);
    const startH = useRef<number>(0);

    /** Estado geral */
    const [tab, setTab] = useLocalStorage<TabKey>("devpanel:tab", "events");
    const [cameraMode, setCameraMode] = useState(() => cameraSystem.getMode());

    /** Eventos */
    const [events, setEvents] = useState<Array<{ t: number; type: string; payload?: unknown }>>([]);
    const [paused, setPaused] = useLocalStorage<boolean>("devpanel:paused", false);
    const [autoscroll, setAutoscroll] = useLocalStorage<boolean>("devpanel:autoscroll", true);
    const [eventFilter, setEventFilter] = useLocalStorage<string>("devpanel:eventFilter", "");
    const [eventType, setEventType] = useState("");
    const [eventPayload, setEventPayload] = useState("");

    /** UI flags persistidos */
    const [showGizmo, setShowGizmo] = useLocalStorage<boolean>("devpanel:showGizmo", false);

    /** Comandos */
    const [history, setHistory] = useState(() => commandStack.getHistory());
    const [commandDesc, setCommandDesc] = useState("");

    /** Entidades */
    const [entities, setEntities] = useState(() => entityManager.getAllEntityIds());
    const [entityFilter, setEntityFilter] = useLocalStorage<string>("devpanel:entityFilter", "");
    const [selected, setSelected] = useState<Record<string, boolean>>({});

    /** Intercepta emissões p/ log – limitado a 500 itens */
    useEffect(() => {
        const originalEmit = eventBus.emit.bind(eventBus);
        eventBus.emit = ((type, payload): void => {
            if (!paused) {
                setEvents((prev) => {
                    const next = [...prev, { t: Date.now(), type: String(type), payload }];
                    return next.length > 500 ? next.slice(-500) : next;
                });
            }
            originalEmit(type, payload);
        }) as EventBus["emit"];
        return (): void => {
            eventBus.emit = originalEmit;
        };
    }, [eventBus, paused]);

    /** Atualiza histórico de comandos */
    useEffect(() => {
        const update = (): void => setHistory(commandStack.getHistory());
        const exec = commandStack.execute.bind(commandStack);
        const undo = commandStack.undo.bind(commandStack);
        const redo = commandStack.redo.bind(commandStack);
        commandStack.execute = (c: Command): boolean => {
            const ok = exec(c);
            update();
            return ok;
        };
        commandStack.undo = (): boolean => {
            const ok = undo();
            update();
            return ok;
        };
        commandStack.redo = (): boolean => {
            const ok = redo();
            update();
            return ok;
        };
        return (): void => {
            commandStack.execute = exec;
            commandStack.undo = undo;
            commandStack.redo = redo;
        };
    }, [commandStack]);

    /** Entidades e câmera */
    useEffect(() => {
        const upd = (): void => setEntities(entityManager.getAllEntityIds());
        const u1 = eventBus.on("entityCreated", upd);
        const u2 = eventBus.on("entityDestroyed", upd);
        const u3 = eventBus.on("cameraModeChanged", ({ mode }) => setCameraMode(mode));
        return (): void => {
            u1();
            u2();
            u3();
        };
    }, [eventBus, entityManager]);

    /** Atalhos */
    useEffect(() => {
        const onKey = (e: KeyboardEvent): void => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                setEvents([]);
            }
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") {
                e.preventDefault();
                setPaused((v) => !v);
            }
            if (e.key === "Escape") setOpen((v) => !v);
        };
        window.addEventListener("keydown", onKey);
        return (): void => window.removeEventListener("keydown", onKey);
    }, [setOpen, setPaused]);

    /** Resize (arrastar borda superior) */
    useEffect(() => {
        const onDown = (e: MouseEvent): void => {
            startY.current = e.clientY;
            startH.current = height;
            document.body.style.userSelect = "none";
        };
        const onMove = (e: MouseEvent): void => {
            if (!document.body.style.userSelect) return;
            const dy = startY.current - e.clientY;
            const next = Math.min(window.innerHeight * 0.9, Math.max(160, startH.current + dy));
            setHeight(next);
        };
        const onUp = (): void => {
            document.body.style.userSelect = "";
        };
        const el = dragRef.current;
        el?.addEventListener("mousedown", onDown);
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
        return (): void => {
            el?.removeEventListener("mousedown", onDown);
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
        };
    }, [height, setHeight]);

    /** Ações */
    function handleEmitEvent(): void {
        if (!eventType.trim()) return;
        try {
            const payload = eventPayload ? JSON.parse(eventPayload) : undefined;
            eventBus.emit(eventType as never, payload as never);
        } catch {
            /* payload inválido */
        }
    }
    function handleExecuteCommand(): void {
        if (!commandDesc.trim()) return;
        commandStack.execute(createDebugCommand(eventBus, commandDesc.trim()));
        setCommandDesc("");
    }
    function handleUndo(): void {
        commandStack.undo();
    }
    function handleRedo(): void {
        commandStack.redo();
    }
    function handleCreateEntity(): void {
        entityManager.createEntity();
    }
    function handleDestroyEntity(id: string): void {
        entityManager.destroyEntity(id);
    }
    function handleDestroySelected(): void {
        Object.keys(selected).forEach((id) => selected[id] && entityManager.destroyEntity(id));
        setSelected({});
    }
    function handleToggleCameraMode(): void {
        cameraSystem.setMode(cameraMode === "persp" ? "ortho" : "persp");
    }
    function handleToggleGizmo(): void {
        const next = !showGizmo;
        setShowGizmo(next);
        eventBus.emit("gizmoVisibilityChanged", { show: next });
    }

    const filteredEvents = useMemo(() => {
        if (!eventFilter) return events;
        const q = eventFilter.toLowerCase();
        return events.filter(
            (e) =>
                e.type.toLowerCase().includes(q) ||
                JSON.stringify(e.payload ?? "")
                    .toLowerCase()
                    .includes(q),
        );
    }, [events, eventFilter]);

    const filteredEntities = useMemo(() => {
        if (!entityFilter) return entities;
        const q = entityFilter.toLowerCase();
        return entities.filter((id) => id.toLowerCase().includes(q));
    }, [entities, entityFilter]);

    const canUndo = history.length > 0;
    const canRedo = commandStack.canRedo ? commandStack.canRedo() : true;

    if (!import.meta.env.DEV) return null;

    return (
        <div className={`absolute left-0 w-full text-xs ${open ? "bottom-0" : "bottom-[-1px]"}`}>
            {/* Handle de resize e toggle */}
            <div ref={dragRef} className="mx-auto h-2 w-full cursor-ns-resize bg-transparent" />
            <div
                className="mx-2 rounded-t-lg border border-slate-300 bg-white/95 shadow-xl backdrop-blur"
                style={{ height: open ? height : undefined, overflow: "hidden" }}
            >
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b border-slate-200 bg-white/90 px-3 py-2">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setOpen((v) => !v)}
                            className="rounded-md border border-slate-300 px-2 py-1 hover:bg-slate-50"
                            title={open ? "Collapse (Esc)" : "Expand"}
                        >
                            {open ? "▾" : "▴"}
                        </button>
                        <Tab
                            label={`Events (${events.length})`}
                            active={tab === "events"}
                            onClick={() => setTab("events")}
                        />
                        <Tab
                            label={`Commands (${history.length})`}
                            active={tab === "commands"}
                            onClick={() => setTab("commands")}
                        />
                        <Tab
                            label={`Entities (${entities.length})`}
                            active={tab === "entities"}
                            onClick={() => setTab("entities")}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="hidden sm:block text-[11px] text-slate-500">
                            Dev Panel
                        </span>
                    </div>
                </div>

                {!open ? null : (
                    <div className="h-[calc(100%-40px)] overflow-hidden">
                        {tab === "events" && (
                            <div className="flex h-full flex-col">
                                {/* Controls */}
                                <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2">
                                    <input
                                        placeholder="filter by type/payload…"
                                        value={eventFilter}
                                        onChange={(e) => setEventFilter(e.target.value)}
                                        className="min-w-40 flex-1 rounded-md border border-slate-300 bg-white px-2 py-1 outline-none focus:ring-2 focus:ring-slate-400"
                                    />
                                    <input
                                        placeholder='emit: type (ex: "entityCreated")'
                                        value={eventType}
                                        onChange={(e) => setEventType(e.target.value)}
                                        className="w-48 rounded-md border border-slate-300 bg-white px-2 py-1 outline-none focus:ring-2 focus:ring-slate-400"
                                    />
                                    <input
                                        placeholder="emit: payload JSON (opcional)"
                                        value={eventPayload}
                                        onChange={(e) => setEventPayload(e.target.value)}
                                        className="w-64 rounded-md border border-slate-300 bg-white px-2 py-1 outline-none focus:ring-2 focus:ring-slate-400"
                                    />
                                    <button
                                        onClick={handleEmitEvent}
                                        className="rounded-md bg-emerald-600 px-3 py-1 text-[11px] text-white hover:bg-emerald-700"
                                    >
                                        Emit
                                    </button>
                                    <div className="mx-2 h-5 w-px bg-slate-200" />
                                    <button
                                        onClick={() => setPaused((v) => !v)}
                                        className={`rounded-md px-3 py-1 text-[11px] ${paused ? "bg-amber-500 text-white hover:bg-amber-600" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
                                    >
                                        {paused ? "Resume" : "Pause"}
                                    </button>
                                    <button
                                        onClick={() => setAutoscroll((v) => !v)}
                                        className={`rounded-md px-3 py-1 text-[11px] ${autoscroll ? "bg-slate-800 text-white hover:bg-black" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
                                    >
                                        {autoscroll ? "Auto-scroll" : "Manual"}
                                    </button>
                                    <button
                                        onClick={() => setEvents([])}
                                        className="rounded-md bg-rose-600 px-3 py-1 text-[11px] text-white hover:bg-rose-700"
                                    >
                                        Clear
                                    </button>
                                </div>
                                {/* Stream */}
                                <div className="h-full overflow-auto px-3 py-2 font-mono">
                                    <ul className="space-y-1">
                                        {filteredEvents.map((e, i) => (
                                            <LogRow
                                                key={`${e.t}-${i}`}
                                                type={e.type}
                                                timestamp={e.t}
                                                payload={e.payload}
                                                autoscroll={
                                                    autoscroll && i === filteredEvents.length - 1
                                                }
                                            />
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {tab === "commands" && (
                            <div className="flex h-full flex-col">
                                <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2">
                                    <input
                                        placeholder="new command description"
                                        value={commandDesc}
                                        onChange={(e) => setCommandDesc(e.target.value)}
                                        className="flex-1 rounded-md border border-slate-300 bg-white px-2 py-1 outline-none focus:ring-2 focus:ring-slate-400"
                                    />
                                    <button
                                        onClick={handleExecuteCommand}
                                        className="rounded-md bg-slate-800 px-3 py-1 text-[11px] text-white hover:bg-black"
                                    >
                                        Exec
                                    </button>
                                    <button
                                        onClick={handleUndo}
                                        disabled={!canUndo}
                                        className={`rounded-md px-3 py-1 text-[11px] ${canUndo ? "bg-slate-100 text-slate-700 hover:bg-slate-200" : "bg-slate-50 text-slate-300 cursor-not-allowed"}`}
                                    >
                                        Undo
                                    </button>
                                    <button
                                        onClick={handleRedo}
                                        disabled={!canRedo}
                                        className={`rounded-md px-3 py-1 text-[11px] ${canRedo ? "bg-slate-100 text-slate-700 hover:bg-slate-200" : "bg-slate-50 text-slate-300 cursor-not-allowed"}`}
                                    >
                                        Redo
                                    </button>
                                    <button
                                        onClick={() => setHistory([])}
                                        className="rounded-md bg-rose-600 px-3 py-1 text-[11px] text-white hover:bg-rose-700"
                                    >
                                        Clear history
                                    </button>
                                </div>
                                <ul className="max-h-full space-y-1 overflow-auto px-3 py-2">
                                    {history.map((c, i) => (
                                        <li
                                            key={c.timestamp + i}
                                            className="rounded border border-slate-200 bg-slate-50 px-2 py-1"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-[11px]">{c.description}</span>
                                                <span className="text-[10px] text-slate-500">
                                                    {fmt(c.timestamp)}
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {tab === "entities" && (
                            <div className="flex h-full flex-col">
                                <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2">
                                    <input
                                        placeholder="search by id…"
                                        value={entityFilter}
                                        onChange={(e) => setEntityFilter(e.target.value)}
                                        className="flex-1 rounded-md border border-slate-300 bg-white px-2 py-1 outline-none focus:ring-2 focus:ring-slate-400"
                                    />
                                    <button
                                        onClick={handleCreateEntity}
                                        className="rounded-md bg-blue-600 px-3 py-1 text-[11px] text-white hover:bg-blue-700"
                                    >
                                        Create
                                    </button>
                                    <button
                                        onClick={handleDestroySelected}
                                        disabled={!Object.values(selected).some(Boolean)}
                                        className={`rounded-md px-3 py-1 text-[11px] ${Object.values(selected).some(Boolean) ? "bg-rose-600 text-white hover:bg-rose-700" : "bg-slate-50 text-slate-300 cursor-not-allowed"}`}
                                    >
                                        Remove selected
                                    </button>
                                </div>
                                <ul className="max-h-full space-y-1 overflow-auto px-3 py-2">
                                    {filteredEntities.map((id) => {
                                        const checked = !!selected[id];
                                        return (
                                            <li
                                                key={id}
                                                className="flex items-center justify-between rounded border border-slate-200 bg-slate-50 px-2 py-1"
                                            >
                                                <label className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={checked}
                                                        onChange={(e) =>
                                                            setSelected((s) => ({
                                                                ...s,
                                                                [id]: e.target.checked,
                                                            }))
                                                        }
                                                    />
                                                    <span className="font-mono text-[11px]">
                                                        {id}
                                                    </span>
                                                </label>
                                                <button
                                                    onClick={() => handleDestroyEntity(id)}
                                                    className="rounded bg-rose-600 px-2 py-0.5 text-[11px] text-white hover:bg-rose-700"
                                                >
                                                    Remove
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-slate-200 px-3 py-2">
                    <span className="flex items-center gap-2">
                        Camera:{" "}
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px]">
                            {cameraMode}
                        </span>
                        <span className="ml-3">Gizmo:</span>
                        <button
                            onClick={handleToggleGizmo}
                            className={`rounded-md px-2 py-0.5 text-[11px] ${showGizmo ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
                        >
                            {showGizmo ? "On" : "Off"}
                        </button>
                    </span>
                    <button
                        onClick={handleToggleCameraMode}
                        className="rounded-md bg-indigo-600 px-3 py-1 text-[11px] text-white hover:bg-indigo-700"
                    >
                        Toggle
                    </button>
                </div>
            </div>
        </div>
    );
}

/** Sub-componentes */
function Tab({
    label,
    active,
    onClick,
}: {
    label: string;
    active: boolean;
    onClick(): void;
}): JSX.Element {
    return (
        <button
            className={`rounded-md px-3 py-1 text-[11px] transition-colors ${active ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
            onClick={onClick}
        >
            {label}
        </button>
    );
}

function LogRow({
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
                <button
                    onClick={() => setOpen((v) => !v)}
                    className="text-[11px] text-slate-600 hover:underline"
                >
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

function safePretty(v: unknown): string {
    try {
        return JSON.stringify(v, null, 2);
    } catch {
        return String(v);
    }
}
