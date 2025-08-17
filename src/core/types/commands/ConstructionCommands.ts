import type { Command } from "@core/types";
import type { Vec3 } from "@core/geometry";

/**
 * Comando para criar uma parede
 */
export interface CreateWallCommand extends Command {
    readonly type: "createWall";
    readonly entityId: string;
    readonly start: Vec3;
    readonly end: Vec3;
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
    readonly position: Vec3;
    readonly size: Vec3;
    readonly material: string;
}

/**
 * Comando para deletar um piso
 */
export interface DeleteFloorCommand extends Command {
    readonly type: "deleteFloor";
    readonly entityId: string;
}
