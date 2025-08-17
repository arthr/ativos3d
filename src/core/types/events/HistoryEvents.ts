/**
 * Eventos de histórico
 */
export interface HistoryEvents {
    commandExecuted: {
        commandId: string;
        description: string;
        timestamp: number;
    };

    commandUndone: {
        commandId: string;
        description: string;
        timestamp: number;
    };

    commandRedone: {
        commandId: string;
        description: string;
        timestamp: number;
    };

    historyStateChanged: {
        canUndo: boolean;
        canRedo: boolean;
        commandCount: number;
    };
}
