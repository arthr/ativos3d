import { application } from "@/applicationInstance";
import type { EntityManager } from "@domain/entities/EntityManager";
import type { CommandStack } from "@core/commands";
import type { EventBus } from "@core/events/EventBus";
import type { CameraSystem } from "@infrastructure/render/CameraSystem";

/**
 * Hook que expõe dependências principais da aplicação
 */
export function useApplication(): {
    eventBus: EventBus;
    commandStack: CommandStack;
    entityManager: EntityManager;
    cameraSystem: CameraSystem;
} {
    return {
        eventBus: application.resolve("eventBus"),
        commandStack: application.resolve("commandStack"),
        entityManager: application.resolve("entityManager"),
        cameraSystem: application.resolve("cameraSystem"),
    };
}
