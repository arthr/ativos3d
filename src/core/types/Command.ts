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

/**
 * Comando para colocar um objeto
 */
export interface PlaceObjectCommand extends Command {
    readonly type: "placeObject";
    readonly entityId: string;
    readonly position: { x: number; y: number; z: number };
    readonly catalogId: string;
}

/**
 * Comando para mover um objeto
 */
export interface MoveObjectCommand extends Command {
    readonly type: "moveObject";
    readonly entityId: string;
    readonly from: { x: number; y: number; z: number };
    readonly to: { x: number; y: number; z: number };
}

/**
 * Comando para girar um objeto
 */
export interface RotateObjectCommand extends Command {
    readonly type: "rotateObject";
    readonly entityId: string;
    readonly angle: number;
}

/**
 * Comando para deletar um objeto
 */
export interface DeleteObjectCommand extends Command {
    readonly type: "deleteObject";
    readonly entityId: string;
    readonly entityData: unknown; // Dados para restaurar no undo
}

/**
 * Comando para criar uma parede
 */
export interface CreateWallCommand extends Command {
    readonly type: "createWall";
    readonly entityId: string;
    readonly start: { x: number; y: number; z: number };
    readonly end: { x: number; y: number; z: number };
    readonly height: number;
}

/**
 * Comando para deletar uma parede
 */
export interface DeleteWallCommand extends Command {
    readonly type: "deleteWall";
    readonly entityId: string;
}

/**
 * Comando para criar um piso
 */
export interface CreateFloorCommand extends Command {
    readonly type: "createFloor";
    readonly entityId: string;
    readonly position: { x: number; y: number; z: number };
    readonly size: { x: number; y: number; z: number };
    readonly material: string;
}

/**
 * Comando para deletar um piso
 */
export interface DeleteFloorCommand extends Command {
    readonly type: "deleteFloor";
    readonly entityId: string;
}

/**
 * Comando composto (batch) para múltiplas operações
 */
export interface BatchCommand extends Command {
    readonly type: "batch";
    readonly commands: Command[];
}

/**
 * União de todos os tipos de comandos
 */
export type AnyCommand =
    | PlaceObjectCommand
    | MoveObjectCommand
    | RotateObjectCommand
    | DeleteObjectCommand
    | CreateWallCommand
    | DeleteWallCommand
    | CreateFloorCommand
    | DeleteFloorCommand
    | BatchCommand;

/**
 * Factory para criar comandos
 */
export class CommandFactory {
    /**
     * Cria um comando de colocar objeto
     */
    static createPlaceObject(
        entityId: string,
        position: { x: number; y: number; z: number },
        catalogId: string,
        executeFn: () => boolean,
        undoFn: () => void,
    ): PlaceObjectCommand {
        return {
            type: "placeObject",
            entityId,
            position,
            catalogId,
            description: `Colocar objeto ${catalogId}`,
            timestamp: Date.now(),
            execute: executeFn,
            undo: undoFn,
        };
    }

    /**
     * Cria um comando de mover objeto
     */
    static createMoveObject(
        entityId: string,
        from: { x: number; y: number; z: number },
        to: { x: number; y: number; z: number },
        executeFn: () => boolean,
        undoFn: () => void,
    ): MoveObjectCommand {
        return {
            type: "moveObject",
            entityId,
            from,
            to,
            description: `Mover objeto ${entityId}`,
            timestamp: Date.now(),
            execute: executeFn,
            undo: undoFn,
        };
    }

    /**
     * Cria um comando de girar objeto
     */
    static createRotateObject(
        entityId: string,
        angle: number,
        executeFn: () => boolean,
        undoFn: () => void,
    ): RotateObjectCommand {
        return {
            type: "rotateObject",
            entityId,
            angle,
            description: `Girar objeto ${entityId}`,
            timestamp: Date.now(),
            execute: executeFn,
            undo: undoFn,
        };
    }

    /**
     * Cria um comando de deletar objeto
     */
    static createDeleteObject(
        entityId: string,
        entityData: unknown,
        executeFn: () => boolean,
        undoFn: () => void,
    ): DeleteObjectCommand {
        return {
            type: "deleteObject",
            entityId,
            entityData,
            description: `Deletar objeto ${entityId}`,
            timestamp: Date.now(),
            execute: executeFn,
            undo: undoFn,
        };
    }

    /**
     * Cria um comando de criar parede
     */
    static createCreateWall(
        entityId: string,
        start: { x: number; y: number; z: number },
        end: { x: number; y: number; z: number },
        height: number,
        executeFn: () => boolean,
        undoFn: () => void,
    ): CreateWallCommand {
        return {
            type: "createWall",
            entityId,
            start,
            end,
            height,
            description: `Criar parede ${entityId}`,
            timestamp: Date.now(),
            execute: executeFn,
            undo: undoFn,
        };
    }

    /**
     * Cria um comando de deletar parede
     */
    static createDeleteWall(
        entityId: string,
        executeFn: () => boolean,
        undoFn: () => void,
    ): DeleteWallCommand {
        return {
            type: "deleteWall",
            entityId,
            description: `Deletar parede ${entityId}`,
            timestamp: Date.now(),
            execute: executeFn,
            undo: undoFn,
        };
    }

    /**
     * Cria um comando de deletar piso
     */
    static createDeleteFloor(
        entityId: string,
        executeFn: () => boolean,
        undoFn: () => void,
    ): DeleteFloorCommand {
        return {
            type: "deleteFloor",
            entityId,
            description: `Deletar piso ${entityId}`,
            timestamp: Date.now(),
            execute: executeFn,
            undo: undoFn,
        };
    }

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
