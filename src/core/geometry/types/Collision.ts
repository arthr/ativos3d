/**
 * Tipos para detecção de colisão
 */
import type { Vec3, AABB } from "@core/geometry";

/**
 * Resultado de uma deteção de colisão
 */
export interface CollisionResult {
    /** Se houve colisão */
    readonly hasCollision: boolean;
    /** Profundidade da penetração (se houver colisão) */
    penetrationDepth?: number;
    /** Vetor de separação mínima */
    separationVector?: Vec3;
    /** Ponto de contato (se houver) */
    contactPoint?: Vec3;
}

/**
 * Informações sobre um corpo para detecção de colisão
 */
export interface CollisionBody {
    /** Caixa delimitadora */
    readonly bounds: AABB;
    /** Posição atual */
    readonly position: Vec3;
    /** Se o corpo é estático (não se move) */
    readonly isStatic: boolean;
    /** Camadas de colisão (bitmask) */
    readonly layers: number;
    /** Identificador único do corpo */
    readonly id: string;
}

/**
 * Configuração para deteção de colisão
 */
export interface CollisionConfig {
    /** Tolerância para considerar colisão */
    readonly tolerance: number;
    /** Se deve calcular informações de contato */
    readonly calculateContact: boolean;
    /** Se deve calcular vetor de separação */
    readonly calculateSeparation: boolean;
    /** Filtro de camadas (opcional) */
    readonly layerMask?: number | undefined;
}

/**
 * Par de corpos em colisão
 */
export interface CollisionPair {
    readonly bodyA: CollisionBody;
    readonly bodyB: CollisionBody;
    readonly result: CollisionResult;
}

/**
 * Consulta de raycasting
 */
export interface RaycastQuery {
    /** Origem do raio */
    readonly origin: Vec3;
    /** Direção do raio (normalizada) */
    readonly direction: Vec3;
    /** Distância máxima do raio */
    readonly maxDistance: number;
    /** Filtro de camadas */
    readonly layerMask?: number | undefined;
}

/**
 * Resultado de raycasting
 */
export interface RaycastResult {
    /** Se o raio atingiu algo */
    readonly hit: boolean;
    /** Distância até o ponto de impacto */
    readonly distance?: number;
    /** Ponto de impacto */
    readonly point?: Vec3;
    /** Normal da superfície no ponto de impacto */
    readonly normal?: Vec3;
    /** Corpo atingido */
    readonly body?: CollisionBody;
}

/**
 * Forma geométrica para detecção de colisão
 */
export type CollisionShape = "box" | "sphere" | "capsule" | "plane";

/**
 * Dados específicos de uma esfera para colisão
 */
export interface SphereCollisionData {
    readonly center: Vec3;
    readonly radius: number;
}

/**
 * Dados específicos de uma cápsula para colisão
 */
export interface CapsuleCollisionData {
    readonly start: Vec3;
    readonly end: Vec3;
    readonly radius: number;
}

/**
 * Dados específicos de um plano para colisão
 */
export interface PlaneCollisionData {
    readonly normal: Vec3;
    readonly distance: number;
}
