/**
 * Tipos comuns reutilizáveis em todo o sistema
 */

/**
 * Coordenadas de tela 2D
 */
export interface Vec2 {
    readonly x: number;
    readonly y: number;
}

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
 * Tipos de ferramentas
 */
export type ToolType =
    | "view"
    | "select"
    | "place"
    | "move"
    | "delete"
    | "wall"
    | "floor"
    | "eyedropper";

/**
 * Tipos de modo de operação
 */
export type ModeType = "view" | "build" | "buy";

/**
 * Tipos de gestos de câmera
 */
export type CameraGesture = "pan" | "rotate" | "zoom";

/**
 * Tipos de câmera
 */
export type CameraMode = "persp" | "ortho";

/**
 * Tipos de toast
 */
export type ToastVariant = "success" | "error" | "info" | "warning";

/**
 * Tipos de nível de mensagem do sistema
 */
export type MessageLevel = "error" | "warning" | "info";

/**
 * Tipos de ação de cena
 */
export type SceneAction = "loaded" | "saved" | "exported" | "imported";

/**
 * Tipos de snap
 */
export type SnapType = "grid" | "object" | "wall" | "none";
