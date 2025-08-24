/**
 * Sistema de eventos principal
 *
 * Este arquivo agrega todos os tipos de eventos do sistema
 * e define os tipos principais para o EventBus.
 */

import type { InputEvents } from "./events/InputEvents";
import type { SelectionEvents } from "./events/SelectionEvents";
import type { ToolEvents } from "./events/ToolEvents";
import type { EntityEvents } from "./events/EntityEvents";
import type { BudgetEvents } from "./events/BudgetEvents";
import type { SnapEvents } from "./events/SnapEvents";
import type { ValidationEvents } from "./events/ValidationEvents";
import type { CameraEvents } from "./events/CameraEvents";
import type { UIEvents } from "./events/UIEvents";
import type { HistoryEvents } from "./events/HistoryEvents";
import type { SystemEvents } from "./events/SystemEvents";
import type { RenderEvents } from "./events/RenderEvents";

/**
 * Todos os eventos do sistema
 */
export type SystemEventMap = BudgetEvents &
    CameraEvents &
    EntityEvents &
    HistoryEvents &
    InputEvents &
    RenderEvents &
    SelectionEvents &
    SnapEvents &
    ToolEvents &
    SystemEvents &
    UIEvents &
    ValidationEvents;

/**
 * Tipo para qualquer evento do sistema
 */
export type SystemEvent = {
    [K in keyof SystemEventMap]: { type: K; payload: SystemEventMap[K] };
}[keyof SystemEventMap];

/**
 * Listener de eventos
 */
export type EventListener<T = unknown> = (payload: T) => void;

/**
 * Unsubscribe function
 */
export type Unsubscribe = () => void;
