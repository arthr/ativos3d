import type { Component } from "@core/types/Component";
import type { Vec3 } from "@core/geometry";

/**
 * Interface para componente de transformação 3D
 *
 * Define a posição, rotação e escala de uma entidade no espaço 3D
 */
export interface TransformComponent extends Component {
    readonly type: "TransformComponent";

    /**
     * Posição no espaço 3D
     */
    readonly position: Vec3;

    /**
     * Rotação em eixos X, Y, Z (em radianos)
     */
    readonly rotation: Vec3;

    /**
     * Escala nos eixos X, Y, Z
     */
    readonly scale: Vec3;

    /**
     * Move a entidade para uma nova posição
     */
    translate(delta: Vec3): TransformComponent;

    /**
     * Define a posição absoluta
     */
    setPosition(position: Vec3): TransformComponent;

    /**
     * Rotaciona a entidade
     */
    rotate(delta: Vec3): TransformComponent;

    /**
     * Define a rotação absoluta
     */
    setRotation(rotation: Vec3): TransformComponent;

    /**
     * Escala a entidade
     */
    scaleBy(factor: number): TransformComponent;

    /**
     * Define a escala absoluta
     */
    setScale(scale: Vec3): TransformComponent;

    /**
     * Aplica uma transformação completa
     */
    setTransform(transform: { position?: Vec3; rotation?: Vec3; scale?: Vec3 }): TransformComponent;

    /**
     * Retorna a transformação como objeto
     */
    getTransform(): { position: Vec3; rotation: Vec3; scale: Vec3 };

    /**
     * Verifica se a transformação é válida
     */
    isValid(): boolean;
}

/**
 * Dados para criar um TransformComponent
 */
export interface TransformComponentData {
    position?: Vec3;
    rotation?: Vec3;
    scale?: Vec3;
}

/**
 * Configuração padrão para TransformComponent
 */
export const DEFAULT_TRANSFORM: Required<TransformComponentData> = {
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
};
