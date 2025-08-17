/**
 * Sistema de comandos principal
 *
 * Este arquivo define os tipos principais para o CommandStack
 * e agrega todos os tipos de comandos do sistema.
 */

import type {
    PlaceObjectCommand,
    MoveObjectCommand,
    RotateObjectCommand,
    DeleteObjectCommand,
} from "./commands/ObjectCommands";
import type {
    CreateWallCommand,
    DeleteWallCommand,
    CreateFloorCommand,
    DeleteFloorCommand,
} from "./commands/ConstructionCommands";
import type { BatchCommand } from "./commands/BatchCommand";

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
 * Re-exportar tipos de comandos para compatibilidade
 */
export type { Command } from "./commands/Command";
export type {
    PlaceObjectCommand,
    MoveObjectCommand,
    RotateObjectCommand,
    DeleteObjectCommand,
} from "./commands/ObjectCommands";
export type {
    CreateWallCommand,
    DeleteWallCommand,
    CreateFloorCommand,
    DeleteFloorCommand,
} from "./commands/ConstructionCommands";
export type { BatchCommand } from "./commands/BatchCommand";
