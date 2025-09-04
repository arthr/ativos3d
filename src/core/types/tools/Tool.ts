import type { ToolState } from "./ToolState";

/**
 * Interface base para ferramentas
 */
export interface Tool<S extends ToolState> {
    /** Estado mutável associado à ferramenta */
    state: S;

    /** Ativa a ferramenta */
    activate(): void;

    /** Desativa a ferramenta */
    deactivate(): void;

    /** Executa a operação principal da ferramenta */
    execute(): void;

    /** Cancela a operação em andamento */
    cancel(): void;

    /** Verifica se a ferramenta está ativa */
    isActive(): boolean;

    /** Verifica se a ferramenta está selecionada */
    isSelected(): boolean;

    /** Verifica se a ferramenta está desabilitada */
    isDisabled(): boolean;

    /** Verifica se a ferramenta está visível */
    isVisible(): boolean;
}
