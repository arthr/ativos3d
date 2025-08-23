import type { Component } from "@core/types/ecs/Component";
import type { Vec3, Transform } from "@core/geometry";

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
    setTransform(transform: Partial<Transform>): TransformComponent;

    /**
     * Retorna a transformação como objeto
     */
    getTransform(): Transform;

    /**
     * Verifica se a transformação é válida
     */
    isValid(): boolean;
}

/**
 * Dados para criar um TransformComponent
 */
export type TransformComponentData = Partial<Transform>;

/**
 * Configuração padrão para TransformComponent
 */
export const DEFAULT_TRANSFORM: Transform = {
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
};
