import type { IconType } from "react-icons";
import { useState, type JSX } from "react";
import {
    FiEye,
    FiShoppingCart,
    FiTool,
    FiCamera,
    FiGrid,
    FiPlus,
    FiMove,
    FiTrash,
} from "react-icons/fi";
import { GiBrickWall } from "react-icons/gi";
import { HiMiniEyeDropper } from "react-icons/hi2";
import { BiSolidBadgeDollar } from "react-icons/bi";
import { BiLayerPlus } from "react-icons/bi";
import { MdOutlineSensorDoor } from "react-icons/md";
import { TbWindow } from "react-icons/tb";

export type HudMode = "view" | "buy" | "build" | null;
type HudOption = { key: string; Icon: IconType };

const MODE_OPTIONS: Record<Exclude<HudMode, null>, HudOption[]> = {
    view: [
        { key: "persp", Icon: FiCamera },
        { key: "ortho", Icon: FiGrid },
    ],
    buy: [
        { key: "place", Icon: FiPlus },
        { key: "move", Icon: FiMove },
        { key: "eyedropper", Icon: HiMiniEyeDropper },
        { key: "sell", Icon: BiSolidBadgeDollar },
    ],
    build: [
        { key: "wall", Icon: GiBrickWall },
        { key: "floor", Icon: BiLayerPlus },
        { key: "door", Icon: MdOutlineSensorDoor },
        { key: "window", Icon: TbWindow },
        { key: "bulldoze", Icon: FiTrash },
    ],
};

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
        <div className="flex items-center absolute bottom-0 left-0 gap-2">
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
            {mode !== null && (
                <div className="ml-auto flex gap-2">
                    {MODE_OPTIONS[mode].map(({ key, Icon }) => (
                        <button key={key} aria-label={key}>
                            <Icon />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
