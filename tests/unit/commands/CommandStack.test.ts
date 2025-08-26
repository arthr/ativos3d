import { describe, it, expect, beforeEach } from "vitest";
import { CommandStack, TestCommand } from "@core/commands";
import type { Command } from "@core/types/commands/Command";

describe("CommandStack", () => {
    let commandStack: CommandStack;
    let testObject: { value: number };

    beforeEach(() => {
        commandStack = new CommandStack();
        testObject = { value: 0 };
    });

    describe("execute", () => {
        it("deve executar um comando com sucesso", () => {
            const command = new TestCommand(testObject, 10, "Set value to 10");

            const result = commandStack.execute(command);

            expect(result).toBe(true);
            expect(testObject.value).toBe(10);
            expect(commandStack.getHistorySize()).toBe(1);
        });

        it("deve falhar ao executar um comando inválido", () => {
            const invalidCommand: Command = {
                execute: () => false,
                undo: () => {},
                description: "Invalid Command",
                timestamp: Date.now(),
            };

            const result = commandStack.execute(invalidCommand);

            expect(result).toBe(false);
            expect(commandStack.getHistorySize()).toBe(0);
        });

        it("deve limpar a pilha de redo quando um novo comando é executado", () => {
            // Executa primeiro comando
            const command1 = new TestCommand(testObject, 10, "Set value to 10");
            commandStack.execute(command1);

            // Desfaz o comando
            commandStack.undo();
            expect(commandStack.canRedo()).toBe(true);

            // Executa novo comando
            const command2 = new TestCommand(testObject, 20, "Set value to 20");
            commandStack.execute(command2);

            expect(commandStack.canRedo()).toBe(false);
            expect(commandStack.getRedoSize()).toBe(0);
        });

        it("deve limitar o tamanho do histórico", () => {
            const limitedStack = new CommandStack(3);

            // Executa 5 comandos
            for (let i = 1; i <= 5; i++) {
                const command = new TestCommand(testObject, i, `Set value to ${i}`);
                limitedStack.execute(command);
            }

            expect(limitedStack.getHistorySize()).toBe(3);
            const history = limitedStack.getHistory();
            expect(history[0]?.description).toBe("Set value to 3");
            expect(history[2]?.description).toBe("Set value to 5");
        });
    });

    describe("undo", () => {
        it("deve desfazer o último comando executado", () => {
            const command = new TestCommand(testObject, 10, "Set value to 10");
            commandStack.execute(command);

            const result = commandStack.undo();

            expect(result).toBe(true);
            expect(testObject.value).toBe(0);
            expect(commandStack.getHistorySize()).toBe(0);
            expect(commandStack.getRedoSize()).toBe(1);
        });

        it("deve falhar ao desfazer quando não há comandos", () => {
            const result = commandStack.undo();

            expect(result).toBe(false);
        });

        it("deve desfazer múltiplos comandos na ordem correta", () => {
            const command1 = new TestCommand(testObject, 10, "Set value to 10");
            const command2 = new TestCommand(testObject, 20, "Set value to 20");
            const command3 = new TestCommand(testObject, 30, "Set value to 30");

            commandStack.execute(command1);
            commandStack.execute(command2);
            commandStack.execute(command3);

            expect(testObject.value).toBe(30);

            commandStack.undo();
            expect(testObject.value).toBe(20);

            commandStack.undo();
            expect(testObject.value).toBe(10);

            commandStack.undo();
            expect(testObject.value).toBe(0);
        });
    });

    describe("redo", () => {
        it("deve refazer o último comando desfeito", () => {
            const command = new TestCommand(testObject, 10, "Set value to 10");
            commandStack.execute(command);
            commandStack.undo();

            const result = commandStack.redo();

            expect(result).toBe(true);
            expect(testObject.value).toBe(10);
            expect(commandStack.getHistorySize()).toBe(1);
            expect(commandStack.getRedoSize()).toBe(0);
        });

        it("deve falhar ao refazer quando não há comandos desfeitos", () => {
            const result = commandStack.redo();

            expect(result).toBe(false);
        });

        it("deve refazer múltiplos comandos na ordem correta", () => {
            const command1 = new TestCommand(testObject, 10, "Set value to 10");
            const command2 = new TestCommand(testObject, 20, "Set value to 20");
            const command3 = new TestCommand(testObject, 30, "Set value to 30");

            commandStack.execute(command1);
            commandStack.execute(command2);
            commandStack.execute(command3);

            // Desfaz todos
            commandStack.undo();
            commandStack.undo();
            commandStack.undo();

            expect(testObject.value).toBe(0);

            // Refaz todos
            commandStack.redo();
            expect(testObject.value).toBe(10);

            commandStack.redo();
            expect(testObject.value).toBe(20);

            commandStack.redo();
            expect(testObject.value).toBe(30);
        });
    });

    describe("canUndo/canRedo", () => {
        it("deve retornar false quando não há comandos", () => {
            expect(commandStack.canUndo()).toBe(false);
            expect(commandStack.canRedo()).toBe(false);
        });

        it("deve retornar true quando há comandos para desfazer", () => {
            const command = new TestCommand(testObject, 10, "Set value to 10");
            commandStack.execute(command);

            expect(commandStack.canUndo()).toBe(true);
            expect(commandStack.canRedo()).toBe(false);
        });

        it("deve retornar true quando há comandos para refazer", () => {
            const command = new TestCommand(testObject, 10, "Set value to 10");
            commandStack.execute(command);
            commandStack.undo();

            expect(commandStack.canUndo()).toBe(false);
            expect(commandStack.canRedo()).toBe(true);
        });
    });

    describe("clear", () => {
        it("deve limpar todo o histórico", () => {
            const command1 = new TestCommand(testObject, 10, "Set value to 10");
            const command2 = new TestCommand(testObject, 20, "Set value to 20");

            commandStack.execute(command1);
            commandStack.execute(command2);
            commandStack.undo();

            commandStack.clear();

            expect(commandStack.getHistorySize()).toBe(0);
            expect(commandStack.getRedoSize()).toBe(0);
            expect(commandStack.canUndo()).toBe(false);
            expect(commandStack.canRedo()).toBe(false);
        });
    });

    describe("getCurrentCommand", () => {
        it("deve retornar null quando não há comandos", () => {
            expect(commandStack.getCurrentCommand()).toBe(null);
        });

        it("deve retornar o último comando executado", () => {
            const command1 = new TestCommand(testObject, 10, "Set value to 10");
            const command2 = new TestCommand(testObject, 20, "Set value to 20");

            commandStack.execute(command1);
            commandStack.execute(command2);

            const currentCommand = commandStack.getCurrentCommand();
            expect(currentCommand).toBe(command2);
        });

        it("deve retornar null após desfazer o único comando", () => {
            const command = new TestCommand(testObject, 10, "Set value to 10");
            commandStack.execute(command);
            commandStack.undo();

            expect(commandStack.getCurrentCommand()).toBe(null);
        });
    });

    describe("getHistory/getRedoStack", () => {
        it("deve retornar cópias dos arrays internos", () => {
            const command = new TestCommand(testObject, 10, "Set value to 10");
            commandStack.execute(command);

            const history = commandStack.getHistory();
            const redoStack = commandStack.getRedoStack();

            // Verifica que são cópias
            expect(history).not.toBe(commandStack.getHistory());
            expect(redoStack).not.toBe(commandStack.getRedoStack());

            // Verifica que são cópias profundas (não podem ser modificadas)
            const originalHistorySize = commandStack.getHistorySize();
            const originalRedoSize = commandStack.getRedoSize();

            // Verifica que o original não foi afetado
            expect(commandStack.getHistorySize()).toBe(originalHistorySize);
            expect(commandStack.getRedoSize()).toBe(originalRedoSize);
        });
    });

    describe("setMaxHistorySize/getMaxHistorySize", () => {
        it("deve definir e retornar o tamanho máximo do histórico", () => {
            expect(commandStack.getMaxHistorySize()).toBe(100);

            commandStack.setMaxHistorySize(50);
            expect(commandStack.getMaxHistorySize()).toBe(50);
        });

        it("deve remover comandos antigos ao reduzir o tamanho máximo", () => {
            const limitedStack = new CommandStack(5);

            // Executa 5 comandos
            for (let i = 1; i <= 5; i++) {
                const command = new TestCommand(testObject, i, `Set value to ${i}`);
                limitedStack.execute(command);
            }

            expect(limitedStack.getHistorySize()).toBe(5);

            // Reduz o tamanho máximo
            limitedStack.setMaxHistorySize(3);

            expect(limitedStack.getHistorySize()).toBe(3);
            const history = limitedStack.getHistory();
            expect(history[0]?.description).toBe("Set value to 3");
            expect(history[2]?.description).toBe("Set value to 5");
        });
    });

    describe("tratamento de erros", () => {
        it("deve lidar com erros durante execução", () => {
            const errorCommand: Command = {
                execute: () => {
                    throw new Error("Erro de execução");
                },
                undo: () => {},
                description: "Error Command",
                timestamp: Date.now(),
            };

            const result = commandStack.execute(errorCommand);

            expect(result).toBe(false);
            expect(commandStack.getHistorySize()).toBe(0);
        });

        it("deve lidar com erros durante undo", () => {
            const errorCommand: Command = {
                execute: () => true,
                undo: () => {
                    throw new Error("Erro de undo");
                },
                description: "Error Command",
                timestamp: Date.now(),
            };

            commandStack.execute(errorCommand);
            const result = commandStack.undo();

            expect(result).toBe(false);
        });

        it("deve lidar com erros durante redo", () => {
            const errorCommand: Command = {
                execute: () => {
                    throw new Error("Erro de redo");
                },
                undo: () => {},
                description: "Error Command",
                timestamp: Date.now(),
            };

            commandStack.execute(errorCommand);
            commandStack.undo();
            const result = commandStack.redo();

            expect(result).toBe(false);
        });
    });
});
