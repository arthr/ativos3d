import { application } from "@/applicationInstance";
import type { EntityManager } from "@domain/entities/EntityManager";
import type { CommandStack } from "@core/commands";
import type { EventBus } from "@core/events/EventBus";
import type { CameraSystem } from "@infrastructure/render/CameraSystem";
import type { CameraController } from "@infrastructure/render/CameraController";
import type { RenderLoop } from "@infrastructure/render/RenderLoop";
import type { ToolManager } from "@application/tools/ToolManager";

/**
 * Hook que expõe dependências principais da aplicação
 */
export function useApplication(): {
    eventBus: EventBus;
    commandStack: CommandStack;
    entityManager: EntityManager;
    cameraSystem: CameraSystem;
    cameraController: CameraController;
    renderLoop: RenderLoop;
    toolManager: ToolManager;
} {
    return {
        eventBus: application.resolve("eventBus"),
        commandStack: application.resolve("commandStack"),
        entityManager: application.resolve("entityManager"),
        cameraSystem: application.resolve("cameraSystem"),
        cameraController: application.resolve("cameraController"),
        renderLoop: application.resolve("renderLoop"),
        toolManager: application.resolve("toolManager"),
    };
}
