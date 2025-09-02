import type { IconType } from "react-icons";
import { FiEye, FiTruck, FiTool, FiCamera, FiGrid, FiMove } from "react-icons/fi";
import { PiHandDepositBold, PiBulldozerBold } from "react-icons/pi";
import { GiBrickWall } from "react-icons/gi";
import { HiMiniEyeDropper } from "react-icons/hi2";
import { FaDelicious } from "react-icons/fa";
import { BiSolidBadgeDollar } from "react-icons/bi";
import { MdOutlineSensorDoor } from "react-icons/md";
import { TbWindow } from "react-icons/tb";

import type { HudMode, HudOption } from "@core/types/ui/HudTypes";

/**
 * Labels para cada modo do HUD
 */
export const MODE_LABEL: Record<Exclude<HudMode, null>, string> = {
    view: "View",
    buy: "Buy",
    build: "Build",
};

/**
 * Ícones para cada modo do HUD
 */
export const MODE_ICON: Record<Exclude<HudMode, null>, IconType> = {
    view: FiEye,
    buy: FiTruck,
    build: FiTool,
};

/**
 * Opções disponíveis para cada modo do HUD
 */
export const MODE_OPTIONS: Record<Exclude<HudMode, null>, HudOption[]> = {
    view: [
        { key: "persp", Icon: FiCamera, label: "persp" },
        { key: "ortho", Icon: FiGrid, label: "ortho" },
    ],
    buy: [
        { key: "place", Icon: PiHandDepositBold, label: "colocar" },
        { key: "move", Icon: FiMove, label: "mover" },
        { key: "eyedropper", Icon: HiMiniEyeDropper, label: "copiar" },
        { key: "sell", Icon: BiSolidBadgeDollar, label: "vender" },
    ],
    build: [
        { key: "wall", Icon: GiBrickWall, label: "parede" },
        { key: "floor", Icon: FaDelicious, label: "piso" },
        { key: "door", Icon: MdOutlineSensorDoor, label: "porta" },
        { key: "window", Icon: TbWindow, label: "janela" },
        { key: "bulldoze", Icon: PiBulldozerBold, label: "demolir" },
    ],
};
