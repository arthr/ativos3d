/**
 * Strategy interface para a ferramenta
 */
export interface ToolStrategy {
    /** Ativa a ferramenta */
    activate(): void;
    /** Desativa a ferramenta */
    deactivate(): void;
    /** Lida com o input da ferramenta */
    handleInput(input: unknown): void;
}
