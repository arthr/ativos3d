/**
 * Ações possíveis para eventos de input.
 */
export type InputAction =
    | "select"
    | "move"
    | "place"
    | "delete"
    | "undo"
    | "redo"
    | "confirm"
    | "cancel"
    | "toggle"
    | "special"
    | "mode.view"
    | "mode.buy"
    | "mode.build"
    | "tool.persp"
    | "tool.ortho"
    | "tool.place"
    | "tool.move"
    | "tool.eyedropper"
    | "tool.sell"
    | "tool.wall"
    | "tool.floor"
    | "tool.door"
    | "tool.window"
    | "tool.bulldoze";
