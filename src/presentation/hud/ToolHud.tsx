import type { IconType } from "react-icons";
import { useMemo, useState, type JSX } from "react";
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
import { BiSolidBadgeDollar, BiLayerPlus } from "react-icons/bi";
import { MdOutlineSensorDoor } from "react-icons/md";
import { TbWindow } from "react-icons/tb";

type HudMode = "view" | "buy" | "build" | null;
type HudOption = { key: string; Icon: IconType; label: string };

const MODE_LABEL: Record<Exclude<HudMode, null>, string> = {
    view: "visualização",
    buy: "objetos",
    build: "construção",
};

const MODE_ICON: Record<Exclude<HudMode, null>, IconType> = {
    view: FiEye,
    buy: FiShoppingCart,
    build: FiTool,
};

const MODE_OPTIONS: Record<Exclude<HudMode, null>, HudOption[]> = {
    view: [
        { key: "persp", Icon: FiCamera, label: "persp" },
        { key: "ortho", Icon: FiGrid, label: "ortho" },
    ],
    buy: [
        { key: "place", Icon: FiPlus, label: "colocar" },
        { key: "move", Icon: FiMove, label: "mover" },
        { key: "eyedropper", Icon: HiMiniEyeDropper, label: "copiar" },
        { key: "sell", Icon: BiSolidBadgeDollar, label: "vender" },
    ],
    build: [
        { key: "wall", Icon: GiBrickWall, label: "parede" },
        { key: "floor", Icon: BiLayerPlus, label: "piso" },
        { key: "door", Icon: MdOutlineSensorDoor, label: "porta" },
        { key: "window", Icon: TbWindow, label: "janela" },
        { key: "bulldoze", Icon: FiTrash, label: "demolir" },
    ],
};

// util simples pra classes condicionais
function cn(...xs: Array<string | false | null | undefined>): string {
    return xs.filter(Boolean).join(" ");
}

/** HUD com visual mais “game UI” */
export function ToolHud(): JSX.Element {
    const [mode, setMode] = useState<HudMode>(null);
    // guarda opção selecionada por modo
    const [selected, setSelected] = useState<Partial<Record<Exclude<HudMode, null>, string>>>({});

    function toggleMode(next: Exclude<HudMode, null>): void {
        setMode((prev) => (prev === next ? null : next));
    }

    function selectOption(m: Exclude<HudMode, null>, key: string): void {
        setSelected((s) => ({ ...s, [m]: key }));
    }

    const activeSelectedKey = useMemo(
        () => (mode ? (selected[mode] ?? null) : null),
        [mode, selected],
    );

    return (
        <div
            className="
        pointer-events-none
        fixed bottom-4 left-0 translate-x-3
        flex items-end gap-3
        z-50
      "
            role="toolbar"
            aria-label="Ferramentas"
        >
            {/* grupo de modos */}
            <div
                className="
          pointer-events-auto
          flex items-center gap-1
          rounded-2xl
          bg-white/70 dark:bg-neutral-900/60
          backdrop-blur-md
          ring-1 ring-black/10 dark:ring-white/10
          shadow-lg
          p-2
        "
            >
                {(Object.keys(MODE_LABEL) as Array<Exclude<HudMode, null>>).map((m) => {
                    const Icon = MODE_ICON[m];
                    const pressed = mode === m;
                    return (
                        <button
                            key={m}
                            aria-label={`${MODE_LABEL[m]} (modo)`}
                            aria-pressed={pressed}
                            onClick={() => toggleMode(m)}
                            className={cn(
                                "group inline-flex items-center gap-2 px-3 py-2 rounded-xl select-none",
                                "transition-all",
                                pressed
                                    ? "bg-emerald-500 text-white shadow-inner"
                                    : "bg-white/70 dark:bg-neutral-800/70 text-neutral-800 dark:text-neutral-200 hover:bg-white dark:hover:bg-neutral-800",
                            )}
                        >
                            <Icon className="text-lg" />
                            <span className="text-sm font-medium">{MODE_LABEL[m]}</span>
                        </button>
                    );
                })}
            </div>

            {/* painel de opções */}
            {mode && (
                <div
                    className={cn(
                        "pointer-events-auto max-w-[78vw] overflow-x-auto",
                        "rounded-2xl bg-white/75 dark:bg-neutral-900/60",
                        "backdrop-blur-md ring-1 ring-black/10 dark:ring-white/10 shadow-xl",
                        "px-3 py-2",
                    )}
                >
                    <div className="mb-2 flex items-center gap-2 px-1">
                        <span className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                            selecionado:
                        </span>
                        <span className="rounded-md bg-black/5 dark:bg-white/5 px-2 py-0.5 text-xs text-neutral-800 dark:text-neutral-200">
                            {activeSelectedKey ?? "—"}
                        </span>
                    </div>

                    <div className="flex items-stretch gap-2">
                        {MODE_OPTIONS[mode].map(({ key, Icon, label }) => {
                            const isActive = activeSelectedKey === key;
                            return (
                                <button
                                    key={key}
                                    aria-label={label}
                                    aria-pressed={isActive}
                                    onClick={() => selectOption(mode, key)}
                                    className={cn(
                                        "min-w-[64px] w-20 flex flex-col items-center gap-1",
                                        "rounded-xl p-2 transition-all",
                                        isActive
                                            ? "bg-emerald-500/90 text-white shadow-inner"
                                            : "bg-white/80 dark:bg-neutral-800/80 text-neutral-800 dark:text-neutral-100 hover:bg-white dark:hover:bg-neutral-800",
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "grid place-items-center h-12 w-12 rounded-xl",
                                            "ring-1",
                                            isActive
                                                ? "ring-white/40 bg-white/10"
                                                : "ring-black/10 dark:ring-white/10 bg-black/5 dark:bg-white/5",
                                        )}
                                    >
                                        <Icon className="text-xl" />
                                    </div>
                                    <span className="text-[11px] leading-none">{label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* barra de progresso/decoração opcional */}
                    <div className="mt-3 h-1 rounded-full bg-black/10 dark:bg-white/10" />
                </div>
            )}
        </div>
    );
}
