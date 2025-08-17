/**
 * Interface base para comandos
 */
export interface Command {
    /**
     * Executa o comando
     * @returns true se executado com sucesso, false se falhou
     */
    execute(): boolean;

    /**
     * Desfaz o comando
     */
    undo(): void;

    /**
     * Descrição do comando para UI
     */
    readonly description: string;

    /**
     * Timestamp de criação do comando
     */
    readonly timestamp: number;
}
