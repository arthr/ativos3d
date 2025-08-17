import type { Command } from "./Command";
import type { Vec3 } from "../Vec3";

/**
 * Comando para colocar um objeto
 */
export interface PlaceObjectCommand extends Command {
    readonly type: "placeObject";
    readonly entityId: string;
    readonly position: Vec3;
    readonly catalogId: string;
}

/**
 * Comando para mover um objeto
 */
export interface MoveObjectCommand extends Command {
    readonly type: "moveObject";
    readonly entityId: string;
    readonly from: Vec3;
    readonly to: Vec3;
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
