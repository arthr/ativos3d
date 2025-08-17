/**
 * Exportações de todos os tipos de comandos
 */

// Interface base
export type { Command } from "./Command";

// Comandos de objetos
export type {
    PlaceObjectCommand,
    MoveObjectCommand,
    RotateObjectCommand,
    DeleteObjectCommand,
} from "./ObjectCommands";

// Comandos de construção
export type {
    CreateWallCommand,
    DeleteWallCommand,
    CreateFloorCommand,
    DeleteFloorCommand,
} from "./ConstructionCommands";

// Comandos compostos
export type { BatchCommand } from "./BatchCommand";

// Factories
export { ObjectCommandFactory } from "./factories/ObjectCommandFactory";
export { ConstructionCommandFactory } from "./factories/ConstructionCommandFactory";
export { BatchCommandFactory } from "./factories/BatchCommandFactory";
