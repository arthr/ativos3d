import type { Command } from "../types/commands/Command";

/**
 * Comando de teste simples para validar o CommandStack
 */
export class TestCommand implements Command {
    private value: number;
    private originalValue: number;
    private executed: boolean = false;

    constructor(
        private target: { value: number },
        private newValue: number,
        public readonly description: string = "Test Command",
    ) {
        this.value = target.value;
        this.originalValue = target.value;
    }

    execute(): boolean {
        if (this.executed) {
            return false;
        }

        try {
            this.originalValue = this.target.value;
            this.target.value = this.newValue;
            this.executed = true;
            return true;
        } catch (error) {
            console.error("Erro ao executar TestCommand:", error);
            return false;
        }
    }

    undo(): void {
        if (!this.executed) {
            throw new Error("Comando não foi executado");
        }

        this.target.value = this.originalValue;
        this.executed = false;
    }

    get timestamp(): number {
        return Date.now();
    }
}
