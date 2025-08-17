import type { Command } from "@core/types";

/**
 * Comando de teste para validação do CommandStack
 */
export class TestCommand implements Command {
    private originalValue: number | null = null;
    private executed: boolean = false;

    constructor(
        private target: { value: number },
        private newValue: number,
        public readonly description: string = "Test Command",
    ) {}

    execute(): boolean {
        if (this.executed) {
            return false;
        }

        this.originalValue = this.target.value;
        this.target.value = this.newValue;
        this.executed = true;
        return true;
    }

    undo(): void {
        if (!this.executed || this.originalValue === null) {
            return;
        }

        this.target.value = this.originalValue;
        this.executed = false;
    }

    get timestamp(): number {
        return Date.now();
    }
}
