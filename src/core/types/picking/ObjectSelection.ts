import type { EventBus } from "../../events/EventBus";
import type { CameraSystemProvider } from "../camera/CameraSystem";
import type { CollisionBody } from "@core/geometry";
import type { EntityId } from "../ecs/EntityId";

/**
 * Dependências para o sistema de seleção de objetos
 */
export interface ObjectSelectionDependencies {
    /** EventBus para ouvir eventos de input e publicar seleção */
    readonly eventBus: EventBus;
    /** Sistema de câmera para criar raios a partir da tela */
    readonly cameraSystem: CameraSystemProvider;
    /** Função que retorna os corpos disponíveis para raycasting */
    readonly getCollisionBodies: () => CollisionBody[];
}

/**
 * Provedor do sistema de seleção de objetos
 */
export interface ObjectSelectionProvider {
    /** Retorna IDs das entidades selecionadas */
    getSelected(): EntityId[];
    /** Remove todos os listeners registrados */
    dispose(): void;
}
