import type { Command, BatchCommand } from "@core/types";

/**
 * Factory para criar comandos compostos
 */
export class BatchCommandFactory {
    /**
     * Cria um comando composto
     */
    static createBatch(commands: Command[], description: string): BatchCommand {
        return {
            type: "batch",
            commands,
            description,
            timestamp: Date.now(),
            execute: () => {
                for (const command of commands) {
                    if (!command.execute()) {
                        return false;
                    }
                }
                return true;
            },
            undo: () => {
                // Desfaz na ordem reversa
                for (let i = commands.length - 1; i >= 0; i--) {
                    commands[i]?.undo();
                }
            },
        };
    }
}
