import type { Command } from "./Command";

/**
 * Comando composto (batch) para múltiplas operações
 */
export interface BatchCommand extends Command {
    readonly type: "batch";
    readonly commands: Command[];
}
