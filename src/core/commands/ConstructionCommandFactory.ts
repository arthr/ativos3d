import type { Vec3 } from "../geometry/types/Vec3";
import type {
    CreateWallCommand,
    DeleteWallCommand,
    CreateFloorCommand,
    DeleteFloorCommand,
} from "../types/commands/ConstructionCommands";

/**
 * Factory para criar comandos de construção
 */
export class ConstructionCommandFactory {
    /**
     * Cria um comando de criar parede
     */
    static createCreateWall(
        entityId: string,
        start: Vec3,
        end: Vec3,
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
     * Cria um comando de criar piso
     */
    static createCreateFloor(
        entityId: string,
        position: Vec3,
        size: Vec3,
        material: string,
        executeFn: () => boolean,
        undoFn: () => void,
    ): CreateFloorCommand {
        return {
            type: "createFloor",
            entityId,
            position,
            size,
            material,
            description: `Criar piso ${entityId}`,
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
}
