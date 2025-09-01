import { useState, type JSX } from "react";
import { FiEye, FiShoppingCart, FiTool } from "react-icons/fi";

export type HudMode = "view" | "buy" | "build" | null;

/**
 * ToolHud: HUD com botões para alternar modos de visualização e edição.
 */
export function ToolHud(): JSX.Element {
    const [mode, setMode] = useState<HudMode>(null);

    /** Alterna o modo ativo do HUD. */
    function handleSetMode(next: HudMode): void {
        setMode((prev) => (prev === next ? null : next));
    }

    return (
        <div className="flex gap-2">
            <button
                aria-label="view mode"
                aria-pressed={mode === "view"}
                onClick={() => handleSetMode("view")}
            >
                <FiEye />
            </button>
            <button
                aria-label="buy mode"
                aria-pressed={mode === "buy"}
                onClick={() => handleSetMode("buy")}
            >
                <FiShoppingCart />
            </button>
            <button
                aria-label="build mode"
                aria-pressed={mode === "build"}
                onClick={() => handleSetMode("build")}
            >
                <FiTool />
            </button>
        </div>
    );
}
