// Fachada: reexporta tipos e instância, mantendo caminho de import estável
export type { Unsubscribe } from "./events/manager";
export { EventManager } from "./events/manager";
export type { AppEvents } from "./events/types";
export { eventBus } from "./events/bus";
export { useEventBus } from "./events/useEventBus";
