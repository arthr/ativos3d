import type { Command } from "@core/types";
import type { EventBus } from "@core/events/EventBus";
import type { CameraGesture } from "@core/types/camera";
import { useEffect, useMemo, useRef, useState, type JSX } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useApplication } from "@presentation/hooks/useApplication";
import { Tab } from "@presentation/panels/developer/components/Tab";
import { InspectorTab } from "@presentation/panels/developer/tabs/InspectorTab";
import { EventsTab } from "@presentation/panels/developer/tabs/EventsTab";
import { EntitiesTab } from "@presentation/panels/developer/tabs/EntitiesTab";
import { ViewTab } from "@presentation/panels/developer/tabs/ViewTab";
import { PerformanceTab } from "@presentation/panels/developer/tabs/PerformanceTab";
import { SettingsTab } from "@presentation/panels/developer/tabs/SettingsTab";
import { CommandsTab } from "@presentation/panels/developer/tabs/CommandsTab";

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

type TabKey =
    | "events"
    | "commands"
    | "entities"
    | "inspector"
    | "view"
    | "performance"
    | "settings";

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
    const [gestures, setGestures] = useState<ReadonlySet<CameraGesture>>(() =>
        cameraSystem.getGestures(),
    );

    /** Eventos */
    const [events, setEvents] = useState<Array<{ t: number; type: string; payload?: unknown }>>([]);
    const [paused, setPaused] = useLocalStorage<boolean>("devpanel:paused", false);
    const [autoscroll, setAutoscroll] = useLocalStorage<boolean>("devpanel:autoscroll", true);
    const [eventFilter, setEventFilter] = useLocalStorage<string>("devpanel:eventFilter", "");
    const [eventType, setEventType] = useState("");
    const [eventPayload, setEventPayload] = useState("");
    const [eventTypeWhitelist, setEventTypeWhitelist] = useLocalStorage<string[]>(
        "devpanel:events:types",
        [],
    );

    /** UI flags persistidos */
    const [showGizmo, setShowGizmo] = useLocalStorage<boolean>("devpanel:showGizmo", false);
    const [showStats, setShowStats] = useLocalStorage<boolean>("devpanel:showStats", false);
    const [statsPanel, setStatsPanel] = useLocalStorage<0 | 1 | 2>("devpanel:statsPanel", 0 as 0);
    const statsLabel = statsPanel === 0 ? "FPS" : statsPanel === 1 ? "MS" : "MB";
    // Grid flags
    const [gridFollow, setGridFollow] = useLocalStorage<boolean>(
        "devpanel:grid:followCamera",
        false,
    );
    const [gridInfinite, setGridInfinite] = useLocalStorage<boolean>(
        "devpanel:grid:infiniteGrid",
        true,
    );

    /** Comandos */
    const [history, setHistory] = useState(() => commandStack.getHistory());
    const [commandDesc, setCommandDesc] = useState("");

    /** Entidades */
    const [entities, setEntities] = useState(() => entityManager.getAllEntityIds());
    const [activeEntityId, setActiveEntityId] = useState<string | null>(null);
    const [entityFilter, setEntityFilter] = useLocalStorage<string>("devpanel:entityFilter", "");
    const [selected, setSelected] = useState<Record<string, boolean>>({});

    /** Intercepta emissões p/ log – limitado a 500 itens
     *  Aplica whitelist: se houver tipos selecionados em Settings, apenas
     *  computa eventos cujo tipo esteja incluso. Se whitelist vazia, não filtra.
     */
    useEffect(() => {
        const originalEmit = eventBus.emit.bind(eventBus);
        eventBus.emit = ((type, payload): void => {
            if (!paused) {
                const t = String(type);
                const allowAll = eventTypeWhitelist.length === 0;
                const isAllowed = allowAll || eventTypeWhitelist.includes(t);
                if (isAllowed) {
                    setEvents((prev) => {
                        const next = [...prev, { t: Date.now(), type: t, payload }];
                        return next.length > 500 ? next.slice(-500) : next;
                    });
                }
            }
            originalEmit(type, payload);
        }) as EventBus["emit"];
        return (): void => {
            eventBus.emit = originalEmit;
        };
    }, [eventBus, paused, eventTypeWhitelist]);

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

    /** Entidades, seleção e câmera */
    useEffect(() => {
        const upd = (): void => setEntities(entityManager.getAllEntityIds());
        const u1 = eventBus.on("entityCreated", upd);
        const u2 = eventBus.on("entityDestroyed", upd);
        const u3 = eventBus.on("cameraModeChanged", ({ mode }) => setCameraMode(mode));
        const u4 = eventBus.on("entitySelected", ({ entityId }) => setActiveEntityId(entityId));
        const u5 = eventBus.on("cameraGestureStarted", () =>
            setGestures(cameraSystem.getGestures()),
        );
        const u6 = eventBus.on("cameraGestureEnded", () => setGestures(cameraSystem.getGestures()));
        return (): void => {
            u1();
            u2();
            u3();
            u4();
            u5();
            u6();
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
    function handleTogglePan(): void {
        if (gestures.has("pan")) cameraSystem.endGesture("pan");
        else cameraSystem.startGesture("pan");
    }
    function handleToggleRotate(): void {
        if (gestures.has("rotate")) cameraSystem.endGesture("rotate");
        else cameraSystem.startGesture("rotate");
    }
    function handleToggleZoom(): void {
        if (gestures.has("zoom")) cameraSystem.endGesture("zoom");
        else cameraSystem.startGesture("zoom");
    }
    function handleToggleGizmo(): void {
        const next = !showGizmo;
        setShowGizmo(next);
        eventBus.emit("gizmoVisibilityChanged", { show: next });
    }
    function emitGridConfig(nextFollow?: boolean, nextInfinite?: boolean): void {
        eventBus.emit("gridConfigChanged", {
            followCamera: typeof nextFollow === "boolean" ? nextFollow : gridFollow,
            infiniteGrid: typeof nextInfinite === "boolean" ? nextInfinite : gridInfinite,
        });
    }
    function handleToggleGridFollow(): void {
        const next = !gridFollow;
        setGridFollow(next);
        emitGridConfig(next, undefined);
    }
    function handleToggleGridInfinite(): void {
        const next = !gridInfinite;
        setGridInfinite(next);
        emitGridConfig(undefined, next);
    }
    function handleToggleStats(): void {
        setShowStats((v) => !v);
    }
    function handleCycleStatsPanel(): void {
        setStatsPanel(((statsPanel + 1) % 3) as 0 | 1 | 2);
    }

    const filteredEvents = useMemo(() => {
        let base = events;
        if (eventTypeWhitelist.length > 0) {
            const set = new Set(eventTypeWhitelist.map(String));
            base = base.filter((e) => set.has(String(e.type)));
        }

        if (!eventFilter) return base;
        const q = eventFilter.toLowerCase();
        return base.filter(
            (e) =>
                e.type.toLowerCase().includes(q) ||
                JSON.stringify(e.payload ?? "")
                    .toLowerCase()
                    .includes(q),
        );
    }, [events, eventFilter, eventTypeWhitelist]);

    const knownEventTypes = useMemo<string[]>(() => {
        const fromEvents = Array.from(new Set(events.map((e) => String(e.type))));
        const fromBus = eventBus.getEventTypes ? (eventBus.getEventTypes() as string[]) : [];
        return Array.from(new Set([...fromEvents, ...fromBus])).sort();
    }, [events, eventBus]);

    // Entities filtering is handled inside EntitiesTab

    const canUndo = history.length > 0;
    const canRedo = commandStack.canRedo ? commandStack.canRedo() : true;

    if (!import.meta.env.DEV) return null;

    return (
        <div
            className={`absolute left-0 w-full text-xs md:w-2/3 ${open ? "bottom-0" : "bottom-[-1px]"}`}
        >
            {/* Handle de resize e toggle */}
            <div ref={dragRef} className="mx-auto h-2 w-full cursor-ns-resize bg-transparent" />
            <div
                className="mx-2 rounded-t-lg border border-slate-300 bg-white/95 shadow-xl backdrop-blur"
                style={{ height: open ? height : undefined, overflow: "hidden" }}
            >
                {/* Footer removido: controles reposicionados para o header */}

                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b border-slate-200 bg-white/90 font-medium px-3 py-2">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setOpen((v) => !v)}
                            className="rounded-md border border-slate-300 p-1 hover:bg-slate-50"
                            title={open ? "Collapse (Esc)" : "Expand"}
                            aria-label={open ? "Collapse" : "Expand"}
                        >
                            {open ? <FiChevronDown size={14} /> : <FiChevronUp size={14} />}
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
                        <Tab
                            label={`Inspector${activeEntityId ? "*" : ""}`}
                            active={tab === "inspector"}
                            onClick={() => setTab("inspector")}
                        />
                        <Tab label="View" active={tab === "view"} onClick={() => setTab("view")} />
                        <Tab
                            label="Performance"
                            active={tab === "performance"}
                            onClick={() => setTab("performance")}
                        />
                        <Tab
                            label="Settings"
                            active={tab === "settings"}
                            onClick={() => setTab("settings")}
                        />
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        Dev Panel
                    </div>
                </div>

                {!open ? null : (
                    <div className="h-[calc(100%-40px)] overflow-hidden">
                        {tab === "events" && (
                            <EventsTab
                                events={events}
                                filtered={filteredEvents}
                                eventFilter={eventFilter}
                                onChangeEventFilter={setEventFilter}
                                eventType={eventType}
                                onChangeEventType={setEventType}
                                eventPayload={eventPayload}
                                onChangeEventPayload={setEventPayload}
                                onEmit={handleEmitEvent}
                                paused={paused}
                                onTogglePaused={() => setPaused((v) => !v)}
                                autoscroll={autoscroll}
                                onToggleAutoscroll={() => setAutoscroll((v) => !v)}
                                onClear={() => setEvents([])}
                            />
                        )}

                        {tab === "commands" && (
                            <CommandsTab
                                history={history}
                                canUndo={canUndo}
                                canRedo={canRedo}
                                commandDesc={commandDesc}
                                onChangeCommandDesc={setCommandDesc}
                                onExec={handleExecuteCommand}
                                onUndo={handleUndo}
                                onRedo={handleRedo}
                                onClearHistory={() => setHistory([])}
                            />
                        )}

                        {tab === "entities" && (
                            <EntitiesTab
                                entities={entities}
                                entityFilter={entityFilter}
                                onChangeEntityFilter={setEntityFilter}
                                selected={selected}
                                onToggleSelected={(id, checked) =>
                                    setSelected((s) => ({ ...s, [id]: checked }))
                                }
                                activeEntityId={activeEntityId}
                                onInspect={setActiveEntityId}
                                onCreateEntity={handleCreateEntity}
                                onDestroyEntity={handleDestroyEntity}
                                onDestroySelected={handleDestroySelected}
                            />
                        )}

                        {tab === "inspector" && <InspectorTab activeEntityId={activeEntityId} />}
                        {tab === "view" && (
                            <ViewTab
                                showGizmo={showGizmo}
                                gridFollow={gridFollow}
                                gridInfinite={gridInfinite}
                                cameraMode={cameraMode}
                                gestures={gestures}
                                onTogglePan={handleTogglePan}
                                onToggleRotate={handleToggleRotate}
                                onToggleZoom={handleToggleZoom}
                                onToggleGizmo={handleToggleGizmo}
                                onToggleGridFollow={handleToggleGridFollow}
                                onToggleGridInfinite={handleToggleGridInfinite}
                                onToggleCameraMode={handleToggleCameraMode}
                            />
                        )}
                        {tab === "performance" && (
                            <PerformanceTab
                                show={showStats}
                                panel={statsPanel}
                                statsLabel={statsLabel}
                                onToggleStats={handleToggleStats}
                                onCyclePanel={handleCycleStatsPanel}
                            />
                        )}
                        {tab === "settings" && (
                            <SettingsTab
                                open={open}
                                onToggleOpenDefault={() => setOpen((v) => !v)}
                                onResetPanelSize={() => setHeight(280)}
                                onClearDevStorage={() => {
                                    try {
                                        const keys: string[] = [];
                                        for (let i = 0; i < globalThis.localStorage.length; i++) {
                                            const k = globalThis.localStorage.key(i);
                                            if (k && k.startsWith("devpanel:")) keys.push(k);
                                        }
                                        keys.forEach((k) => globalThis.localStorage.removeItem(k));
                                        setEventTypeWhitelist([]);
                                    } catch {
                                        /* noop */
                                    }
                                }}
                                onResetViewDefaults={() => {
                                    setShowGizmo(false);
                                    setGridFollow(false);
                                    setGridInfinite(true);
                                    try {
                                        eventBus.emit("gizmoVisibilityChanged", { show: false });
                                        eventBus.emit("gridConfigChanged", {
                                            followCamera: false,
                                            infiniteGrid: true,
                                        });
                                    } catch {
                                        /* noop */
                                    }
                                }}
                                knownEventTypes={knownEventTypes}
                                selectedEventTypes={eventTypeWhitelist}
                                onUpdateEventTypes={setEventTypeWhitelist}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
