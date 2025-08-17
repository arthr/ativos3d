/**
 * Sistema de comandos principal
 *
 * Este arquivo define os tipos principais para o CommandStack
 * e exporta todos os comandos do sistema.
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

// Exportar todos os tipos de comandos
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

// Exportar factories
export { ObjectCommandFactory } from "./commands/factories/ObjectCommandFactory";
export { ConstructionCommandFactory } from "./commands/factories/ConstructionCommandFactory";
export { BatchCommandFactory } from "./commands/factories/BatchCommandFactory";

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
