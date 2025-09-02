import type { IconType } from "react-icons";

/**
 * Tipos de modo disponíveis no HUD
 */
export type HudMode = "view" | "buy" | "build" | null;

/**
 * Opção de ferramenta no HUD
 */
export interface HudOption {
    key: string;
    Icon: IconType;
    label: string;
}

/**
 * Estado de seleção por modo
 */
export type HudSelection = Partial<Record<Exclude<HudMode, null>, string>>;

/**
 * Props para componente de botão de modo
 */
export interface ModeButtonProps {
    mode: Exclude<HudMode, null>;
    isActive: boolean;
    onToggle: (mode: Exclude<HudMode, null>) => void;
}

/**
 * Props para componente de botão de ferramenta
 */
export interface ToolButtonProps {
    option: HudOption;
    isActive: boolean;
    onSelect: () => void;
}

/**
 * Props para painel de modos
 */
export interface ModePanelProps {
    currentMode: HudMode;
    onModeToggle: (mode: Exclude<HudMode, null>) => void;
}

/**
 * Props para painel de ferramentas
 */
export interface ToolPanelProps {
    mode: Exclude<HudMode, null>;
    selectedKey: string | null;
    onToolSelect: (key: string) => void;
}
