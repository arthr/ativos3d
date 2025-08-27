import { useEffect, useState } from "react";
import type { Command } from "@core/types";
import type { EventBus } from "@core/events/EventBus";
import { useApplication } from "@presentation/hooks/useApplication";

/**
 * Cria um comando de depuração que emite eventos ao executar e desfazer
 */
function createDebugCommand(bus: EventBus, description: string): Command {
    return {
        description,
        timestamp: Date.now(),
        execute() {
            bus.emit("debugCommand", { stage: "execute", description });
            return true;
        },
        undo() {
            bus.emit("debugCommand", { stage: "undo", description });
        },
    };
}

/**
 * Painel de desenvolvedor com abas de eventos, comandos e entidades
 */
export function DeveloperPanel() {
    const { eventBus, commandStack, entityManager, cameraSystem } = useApplication();
    const [tab, setTab] = useState<"events" | "commands" | "entities">("events");
    const [events, setEvents] = useState<string[]>([]);
    const [history, setHistory] = useState(() => commandStack.getHistory());
    const [entities, setEntities] = useState(() => entityManager.getAllEntityIds());
    const [cameraMode, setCameraMode] = useState(() => cameraSystem.getMode());
    const [eventType, setEventType] = useState("");
    const [eventPayload, setEventPayload] = useState("");
    const [commandDesc, setCommandDesc] = useState("");

    // Loga todos os eventos emitidos
    useEffect(() => {
        const originalEmit: EventBus["emit"] = eventBus.emit.bind(eventBus);
        eventBus.emit = ((type, payload) => {
            setEvents((prev) =>
                [...prev, `${String(type)}: ${JSON.stringify(payload)}`].slice(-100),
            );
            originalEmit(type, payload);
        }) as EventBus["emit"];
        return () => {
            eventBus.emit = originalEmit;
        };
    }, [eventBus]);

    // Atualiza histórico de comandos
    useEffect(() => {
        const update = () => setHistory(commandStack.getHistory());
        const exec = commandStack.execute.bind(commandStack);
        commandStack.execute = (cmd: Command) => {
            const ok = exec(cmd);
            update();
            return ok;
        };
        const undo = commandStack.undo.bind(commandStack);
        commandStack.undo = () => {
            const ok = undo();
            update();
            return ok;
        };
        const redo = commandStack.redo.bind(commandStack);
        commandStack.redo = () => {
            const ok = redo();
            update();
            return ok;
        };
        return () => {
            commandStack.execute = exec;
            commandStack.undo = undo;
            commandStack.redo = redo;
        };
    }, [commandStack]);

    // Atualiza lista de entidades
    useEffect(() => {
        const update = () => setEntities(entityManager.getAllEntityIds());
        const unsubCreated = eventBus.on("entityCreated", update);
        const unsubDestroyed = eventBus.on("entityDestroyed", update);
        return () => {
            unsubCreated();
            unsubDestroyed();
        };
    }, [eventBus, entityManager]);

    // Atualiza modo da câmera
    useEffect(() => {
        const unsub = eventBus.on("cameraModeChanged", ({ mode }) => setCameraMode(mode));
        return () => unsub();
    }, [eventBus]);

    /**
     * Altera a aba ativa
     */
    function handleTabChange(next: "events" | "commands" | "entities") {
        setTab(next);
    }

    /**
     * Emite um evento customizado
     */
    function handleEmitEvent(): void {
        if (!eventType) return;
        try {
            const payload = eventPayload ? JSON.parse(eventPayload) : undefined;
            eventBus.emit(eventType as never, payload as never);
        } catch {
            // Ignora payload inválido
        }
    }

    /**
     * Executa um comando de depuração
     */
    function handleExecuteCommand(): void {
        if (!commandDesc.trim()) return;
        commandStack.execute(createDebugCommand(eventBus, commandDesc));
        setCommandDesc("");
    }

    /**
     * Desfaz o último comando
     */
    function handleUndo(): void {
        commandStack.undo();
    }

    /**
     * Refaz o último comando desfeito
     */
    function handleRedo(): void {
        commandStack.redo();
    }

    /**
     * Cria uma nova entidade
     */
    function handleCreateEntity(): void {
        entityManager.createEntity();
    }

    /**
     * Remove uma entidade pelo ID
     */
    function handleDestroyEntity(id: string): void {
        entityManager.destroyEntity(id);
    }

    /**
     * Alterna o modo da câmera
     */
    function handleToggleCameraMode(): void {
        cameraSystem.setMode(cameraMode === "persp" ? "ortho" : "persp");
    }

    if (!import.meta.env.DEV) return null;

    return (
        <div
            style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                maxHeight: "40%",
                background: "#fff",
                fontSize: 12,
                overflow: "auto",
                borderTop: "1px solid #ccc",
            }}
        >
            <div style={{ display: "flex", gap: 8, padding: 4, borderBottom: "1px solid #ccc" }}>
                <button onClick={() => handleTabChange("events")}>Events</button>
                <button onClick={() => handleTabChange("commands")}>Commands</button>
                <button onClick={() => handleTabChange("entities")}>Entities</button>
            </div>
            {tab === "events" && (
                <div style={{ padding: 4 }}>
                    <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                        <input
                            placeholder="type"
                            value={eventType}
                            onChange={(e) => setEventType(e.target.value)}
                        />
                        <input
                            placeholder="payload"
                            value={eventPayload}
                            onChange={(e) => setEventPayload(e.target.value)}
                        />
                        <button onClick={handleEmitEvent}>Emit</button>
                    </div>
                    <ul>{events.map((e, i) => <li key={i}>{e}</li>)}</ul>
                </div>
            )}
            {tab === "commands" && (
                <div style={{ padding: 4 }}>
                    <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                        <input
                            placeholder="description"
                            value={commandDesc}
                            onChange={(e) => setCommandDesc(e.target.value)}
                        />
                        <button onClick={handleExecuteCommand}>Exec</button>
                        <button onClick={handleUndo}>Undo</button>
                        <button onClick={handleRedo}>Redo</button>
                    </div>
                    <ul>
                        {history.map((c, i) => (
                            <li key={c.timestamp + i}>{c.description}</li>
                        ))}
                    </ul>
                </div>
            )}
            {tab === "entities" && (
                <div style={{ padding: 4 }}>
                    <button onClick={handleCreateEntity}>Create</button>
                    <ul>
                        {entities.map((id) => (
                            <li key={id}>
                                {id} <button onClick={() => handleDestroyEntity(id)}>X</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <div style={{ padding: 4 }}>
                Camera: {cameraMode} <button onClick={handleToggleCameraMode}>Toggle</button>
            </div>
        </div>
    );
}
