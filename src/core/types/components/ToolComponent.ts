import type { Component } from "@core/types/Component";
import type { ToolType, ModeType } from "@core/types";

/**
 * Interface para componente de ferramenta
 *
 * Armazena a ferramenta e modo de operação ativos
 */
export interface ToolComponent extends Component {
    readonly type: "ToolComponent";

    /**
     * Ferramenta ativa
     */
    readonly tool: ToolType;

    /**
     * Modo de operação ativo
     */
    readonly mode: ModeType;

    /**
     * Define a ferramenta ativa
     */
    setTool(tool: ToolType): ToolComponent;

    /**
     * Define o modo ativo
     */
    setMode(mode: ModeType): ToolComponent;

    /**
     * Verifica se os dados são válidos
     */
    isValid(): boolean;
}

/**
 * Dados para criar um ToolComponent
 */
export interface ToolComponentData {
    tool?: ToolType;
    mode?: ModeType;
}

/**
 * Configuração padrão para ToolComponent
 */
export const DEFAULT_TOOL: Required<ToolComponentData> = {
    tool: "view",
    mode: "view",
};

/**
 * Ferramentas disponíveis
 */
export const TOOLS: ToolType[] = [
    "view",
    "select",
    "place",
    "move",
    "delete",
    "wall",
    "floor",
    "eyedropper",
];

/**
 * Modos disponíveis
 */
export const MODES: ModeType[] = ["view", "build", "buy"];
