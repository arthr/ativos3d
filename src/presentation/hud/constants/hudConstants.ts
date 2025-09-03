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
        Icon: FiGrid,
        image: "/assets/images/chair.jpg",
        label: "Cadeira",
        category: "furniture",
        tags: ["seating", "furniture"],
        price: 150,
        enabled: true,
    },
    {
        key: "table",
        Icon: FiGrid,
        image: "/assets/images/table.jpg",
        label: "Mesa",
        category: "furniture",
        tags: ["table", "furniture"],
        price: 300,
        enabled: true,
    },
    {
        key: "sofa",
        Icon: FiGrid,
        image: "/assets/images/sofa.jpg",
        label: "Sofá",
        category: "furniture",
        tags: ["seating", "furniture", "living"],
        price: 800,
        enabled: true,
    },
    {
        key: "bed",
        Icon: FiGrid,
        image: "/assets/images/bed.jpg",
        label: "Cama",
        category: "furniture",
        tags: ["bedroom", "furniture", "sleep"],
        price: 1200,
        enabled: true,
    },
    {
        key: "tv",
        Icon: FiGrid,
        image: "/assets/images/tv.jpg",
        label: "TV",
        category: "electronics",
        tags: ["entertainment", "electronics"],
        price: 2000,
        enabled: false,
    },
    {
        key: "lamp",
        Icon: FiGrid,
        image: "/assets/images/lamp.jpg",
        label: "Luminária",
        category: "decor",
        tags: ["light", "decor", "illumination"],
        price: 250,
        enabled: true,
    },
    {
        key: "bookshelf",
        Icon: FiGrid,
        image: "/assets/images/bookshelf.jpg",
        label: "Estante",
        category: "furniture",
        tags: ["storage", "furniture", "books"],
        price: 600,
        enabled: true,
    },
    {
        key: "refrigerator",
        Icon: FiGrid,
        image: "/assets/images/refrigerator.jpg",
        label: "Geladeira",
        category: "appliances",
        tags: ["kitchen", "appliances", "cold"],
        price: 1800,
        enabled: true,
    },
    {
        key: "microwave",
        Icon: FiGrid,
        image: "/assets/images/microwave.jpg",
        label: "Micro-ondas",
        category: "appliances",
        tags: ["kitchen", "appliances", "cooking"],
        price: 700,
        enabled: true,
    },
    {
        key: "painting",
        Icon: FiGrid,
        image: "/assets/images/painting.jpg",
        label: "Quadro",
        category: "decor",
        tags: ["art", "decor", "wall"],
        price: 350,
        enabled: true,
    },
];
