import type { EventBus } from "../../events/EventBus";
import type { CameraSystemProvider } from "../camera/CameraSystem";
import type { CollisionBody } from "@core/geometry";
import type { EntityId } from "../ecs/EntityId";

/**
 * Dependências para o sistema de hover de objetos
 */
export interface HoverSystemDependencies {
    /** EventBus para ouvir eventos de input e publicar hover */
    readonly eventBus: EventBus;
    /** Sistema de câmera para criar raios a partir da tela */
    readonly cameraSystem: CameraSystemProvider;
    /** Função que retorna os corpos disponíveis para raycasting */
    readonly getCollisionBodies: () => CollisionBody[];
}

/**
 * Provedor do sistema de hover de objetos
 */
export interface HoverSystemProvider {
    /** Retorna o ID atualmente em hover, se houver */
    getHovered(): EntityId | null;
    /** Remove todos os listeners registrados */
    dispose(): void;
}
