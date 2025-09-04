import type { EventBus } from "../../events/EventBus";
import type { CameraSystemProvider } from "../camera/CameraSystem";
import type { Vec2, Vec3, CollisionBody } from "../../geometry";

/**
 * Dependências para o sistema de snap em objetos
 */
export interface ObjectSnapDependencies {
    /** EventBus para ouvir eventos de snap */
    readonly eventBus: EventBus;
    /** Sistema de câmera para gerar raios a partir da tela */
    readonly cameraSystem: CameraSystemProvider;
    /** Função que retorna os corpos disponíveis para raycasting */
    readonly getCollisionBodies: () => CollisionBody[];
}

/**
 * Provedor do sistema de snap em objetos
 */
export interface ObjectSnapProvider {
    /** Calcula o ponto de snap para uma posição em NDC */
    calculateSnapPoint(ndc: Vec2): Vec3 | null;
    /** Remove todos os listeners registrados */
    dispose(): void;
}
