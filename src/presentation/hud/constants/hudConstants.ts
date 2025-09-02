import type { IconType } from "react-icons";
import { FiEye, FiTruck, FiTool, FiCamera, FiGrid, FiMove } from "react-icons/fi";
import { PiHandDepositBold, PiBulldozerBold } from "react-icons/pi";
import { GiBrickWall } from "react-icons/gi";
import { HiMiniEyeDropper } from "react-icons/hi2";
import { FaDelicious } from "react-icons/fa";
import { BiSolidBadgeDollar } from "react-icons/bi";
import { MdOutlineSensorDoor } from "react-icons/md";
import { TbWindow } from "react-icons/tb";

import type { HudMode, HudOption, HudCatalogItem } from "@core/types/ui/HudTypes";

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

/**
 * Itens do catálogo para a ferramenta "place" do modo "buy"
 */
export const CATALOG_ITEMS: HudCatalogItem[] = [
    {
        key: "chair",
        Icon: FiGrid, // Temporário - substituir por ícone de cadeira
        label: "Cadeira",
        category: "furniture",
        tags: ["seating", "furniture"],
        price: 150,
        enabled: true,
    },
    {
        key: "table",
        Icon: FiGrid, // Temporário - substituir por ícone de mesa
        label: "Mesa",
        category: "furniture",
        tags: ["table", "furniture"],
        price: 300,
        enabled: true,
    },
    {
        key: "sofa",
        Icon: FiGrid, // Temporário - substituir por ícone de sofá
        label: "Sofá",
        category: "furniture",
        tags: ["seating", "furniture", "living"],
        price: 800,
        enabled: true,
    },
    {
        key: "bed",
        Icon: FiGrid, // Temporário - substituir por ícone de cama
        label: "Cama",
        category: "furniture",
        tags: ["bedroom", "furniture", "sleep"],
        price: 1200,
        enabled: true,
    },
    {
        key: "tv",
        Icon: FiGrid, // Temporário - substituir por ícone de TV
        label: "TV",
        category: "electronics",
        tags: ["entertainment", "electronics"],
        price: 2000,
        enabled: false, // Exemplo de item desabilitado
    },
    {
        key: "lamp",
        Icon: FiGrid, // Temporário - substituir por ícone de luminária
        label: "Luminária",
        category: "decor",
        tags: ["light", "decor", "illumination"],
        price: 250,
        enabled: true,
    },
    {
        key: "bookshelf",
        Icon: FiGrid, // Temporário - substituir por ícone de estante
        label: "Estante",
        category: "furniture",
        tags: ["storage", "furniture", "books"],
        price: 600,
        enabled: true,
    },
    {
        key: "refrigerator",
        Icon: FiGrid, // Temporário - substituir por ícone de geladeira
        label: "Geladeira",
        category: "appliances",
        tags: ["kitchen", "appliances", "cold"],
        price: 1800,
        enabled: true,
    },
    {
        key: "microwave",
        Icon: FiGrid, // Temporário - substituir por ícone de micro-ondas
        label: "Micro-ondas",
        category: "appliances",
        tags: ["kitchen", "appliances", "cooking"],
        price: 700,
        enabled: true,
    },
    {
        key: "painting",
        Icon: FiGrid, // Temporário - substituir por ícone de quadro
        label: "Quadro",
        category: "decor",
        tags: ["art", "decor", "wall"],
        price: 350,
        enabled: true,
    },
];
