import type { Vec3 } from "./Vec3";
import type { EntityId } from "./Entity";

/**
 * Modificadores de teclado
 */
export interface Modifiers {
    readonly shift: boolean;
    readonly ctrl: boolean;
    readonly alt: boolean;
    readonly meta: boolean;
    readonly space: boolean;
}

/**
 * Coordenadas de tela 2D
 */
export interface Vec2 {
    readonly x: number;
    readonly y: number;
}

/**
 * Eventos de input do sistema
 */
export interface InputEvents {
    // Mouse/Pointer
    pointerMove: { position: Vec3; screen: Vec2 };
    pointerDown: { position: Vec3; screen: Vec2; button: number; modifiers: Modifiers };
    pointerUp: { position: Vec3; screen: Vec2; button: number; modifiers: Modifiers };
    click: { position: Vec3; screen: Vec2; button: number };

    // Teclado
    keyDown: { code: string; modifiers: Modifiers };
    keyUp: { code: string; modifiers: Modifiers };
}

/**
 * Eventos de seleção
 */
export interface SelectionEvents {
    objectSelected: { entityId: EntityId };
    objectDeselected: { entityId: EntityId };
    objectHovered: { entityId: EntityId };
    selectionCleared: {};
}

/**
 * Eventos de ferramentas
 */
export interface ToolEvents {
    toolChanged: { tool: string };
    modeChanged: { mode: string };
}

/**
 * Eventos de ações
 */
export interface ActionEvents {
    objectPlaced: { entityId: EntityId; position: Vec3 };
    objectMoved: { entityId: EntityId; from: Vec3; to: Vec3 };
    objectRotated: { entityId: EntityId; angle: number };
    objectDeleted: { entityId: EntityId };
    wallCreated: { entityId: EntityId; start: Vec3; end: Vec3 };
    wallDeleted: { entityId: EntityId };
    floorCreated: { entityId: EntityId; position: Vec3; size: Vec3 };
    floorDeleted: { entityId: EntityId };
}

/**
 * Eventos de validação
 */
export interface ValidationEvents {
    validationFailed: { reason: string; position: Vec3 };
    validationSucceeded: { position: Vec3 };
}

/**
 * Eventos de sistema
 */
export interface SystemEvents {
    sceneLoaded: { sceneId: string };
    sceneSaved: { sceneId: string };
    error: { message: string; code?: string };
    warning: { message: string; code?: string };
}

/**
 * Todos os eventos do sistema
 */
export type SystemEventMap = InputEvents &
    SelectionEvents &
    ToolEvents &
    ActionEvents &
    ValidationEvents &
    SystemEvents;

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
