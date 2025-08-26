import type { Command } from "@core/types";

/**
 * Interface para o CommandStack
 */
export interface ICommandStack {
    /**
     * Executa um comando e adiciona ao histórico
     */
    execute(command: Command): boolean;

    /**
     * Desfaz o último comando executado
     */
    undo(): boolean;

    /**
     * Refaz o último comando desfeito
     */
    redo(): boolean;

    /**
     * Verifica se é possível desfazer
     */
    canUndo(): boolean;

    /**
     * Verifica se é possível refazer
     */
    canRedo(): boolean;

    /**
     * Limpa todo o histórico
     */
    clear(): void;

    /**
     * Retorna o número de comandos no histórico
     */
    getHistorySize(): number;

    /**
     * Retorna o número de comandos desfeitos
     */
    getRedoSize(): number;

    /**
     * Obtém o comando atual (último executado)
     */
    getCurrentCommand(): Command | null;

    /**
     * Retorna todos os comandos do histórico
     */
    getHistory(): readonly Command[];

    /**
     * Retorna todos os comandos desfeitos
     */
    getRedoStack(): readonly Command[];
}

/**
 * Implementação do CommandStack com funcionalidades de undo/redo
 */
export class CommandStack implements ICommandStack {
    private history: Command[] = [];
    private redoStack: Command[] = [];
    private maxHistorySize: number;

    constructor(maxHistorySize: number = 100) {
        this.maxHistorySize = maxHistorySize;
    }

    /**
     * Executa um comando e adiciona ao histórico
     */
    execute(command: Command): boolean {
        try {
            // Executa o comando
            const success = command.execute();

            if (success) {
                // Adiciona ao histórico
                this.history.push(command);

                // Limita o tamanho do histórico
                if (this.history.length > this.maxHistorySize) {
                    this.history.shift();
                }

                // Limpa a pilha de redo quando um novo comando é executado
                this.redoStack = [];

                return true;
            }

            return false;
        } catch (error) {
            // TODO: Handle error
            console.error("Erro ao executar comando:", error);
            return false;
        }
    }

    /**
     * Desfaz o último comando executado
     */
    undo(): boolean {
        if (!this.canUndo()) {
            return false;
        }

        try {
            const command = this.history.pop()!;
            command.undo();
            this.redoStack.push(command);
            return true;
        } catch (error) {
            // TODO: Handle error
            console.error("Erro ao desfazer comando:", error);
            return false;
        }
    }

    /**
     * Refaz o último comando desfeito
     */
    redo(): boolean {
        if (!this.canRedo()) {
            return false;
        }

        try {
            const command = this.redoStack.pop()!;
            const success = command.execute();

            if (success) {
                this.history.push(command);
                return true;
            } else {
                // Se falhou, coloca de volta na pilha de redo
                this.redoStack.push(command);
                return false;
            }
        } catch (error) {
            // TODO: Handle error
            console.error("Erro ao refazer comando:", error);
            return false;
        }
    }

    /**
     * Verifica se é possível desfazer
     */
    canUndo(): boolean {
        return this.history.length > 0;
    }

    /**
     * Verifica se é possível refazer
     */
    canRedo(): boolean {
        return this.redoStack.length > 0;
    }

    /**
     * Limpa todo o histórico
     */
    clear(): void {
        this.history = [];
        this.redoStack = [];
    }

    /**
     * Retorna o número de comandos no histórico
     */
    getHistorySize(): number {
        return this.history.length;
    }

    /**
     * Retorna o número de comandos desfeitos
     */
    getRedoSize(): number {
        return this.redoStack.length;
    }

    /**
     * Obtém o comando atual (último executado)
     */
    getCurrentCommand(): Command | null {
        return this.history.at(-1) ?? null;
    }

    /**
     * Retorna todos os comandos do histórico
     */
    getHistory(): readonly Command[] {
        return [...this.history];
    }

    /**
     * Retorna todos os comandos desfeitos
     */
    getRedoStack(): readonly Command[] {
        return [...this.redoStack];
    }

    /**
     * Define o tamanho máximo do histórico
     */
    setMaxHistorySize(size: number): void {
        this.maxHistorySize = size;

        // Remove comandos antigos se necessário
        while (this.history.length > this.maxHistorySize) {
            this.history.shift();
        }
    }

    /**
     * Retorna o tamanho máximo do histórico
     */
    getMaxHistorySize(): number {
        return this.maxHistorySize;
    }
}
