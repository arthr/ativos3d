/**
 * Estado mutável de uma ferramenta
 */
export interface ToolState {
    /** Indica se a ferramenta está ativa */
    active: boolean;
    /** Indica se a ferramenta está selecionada */
    selected: boolean;
    /** Indica se a ferramenta está desabilitada */
    disabled: boolean;
    /** Indica se a ferramenta está visível */
    visible: boolean;
}
