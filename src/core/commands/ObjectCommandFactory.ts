import type { Vec3 } from "../geometry/types/Vec3";
import type {
    PlaceObjectCommand,
    MoveObjectCommand,
    RotateObjectCommand,
    DeleteObjectCommand,
} from "../types/commands/ObjectCommands";

/**
 * Factory para criar comandos de objetos
 */
export class ObjectCommandFactory {
    /**
     * Cria um comando de colocar objeto
     */
    static createPlaceObject(
        entityId: string,
        position: Vec3,
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
        from: Vec3,
        to: Vec3,
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
}
