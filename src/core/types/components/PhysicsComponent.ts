import type { Component } from "@core/types/ecs/Component";
import type { Vec3 } from "@core/geometry";

/**
 * Interface para componente de física 3D
 *
 * Gerencia propriedades físicas básicas como massa, velocidade e aceleração.
 */
export interface PhysicsComponent extends Component {
    readonly type: "PhysicsComponent";

    /**
     * Massa do objeto em unidades arbitrárias
     */
    readonly mass: number;

    /**
     * Velocidade atual do objeto
     */
    readonly velocity: Vec3;

    /**
     * Aceleração atual do objeto
     */
    readonly acceleration: Vec3;

    /**
     * Se deve aplicar gravidade ao objeto
     */
    readonly useGravity: boolean;

    /**
     * Define a massa do objeto
     */
    setMass(mass: number): PhysicsComponent;

    /**
     * Define a velocidade do objeto
     */
    setVelocity(velocity: Vec3): PhysicsComponent;

    /**
     * Define a aceleração do objeto
     */
    setAcceleration(acceleration: Vec3): PhysicsComponent;

    /**
     * Aplica uma força ao objeto
     */
    applyForce(force: Vec3): PhysicsComponent;

    /**
     * Integra velocidade com base na aceleração
     */
    integrate(deltaTime: number): PhysicsComponent;

    /**
     * Retorna se o objeto é estático (massa infinita ou zero)
     */
    isStatic(): boolean;

    /**
     * Verifica se os dados físicos são válidos
     */
    isValid(): boolean;
}

/**
 * Dados para criar um PhysicsComponent
 */
export interface PhysicsComponentData {
    mass?: number;
    velocity?: Vec3;
    acceleration?: Vec3;
    useGravity?: boolean;
}

/**
 * Configuração padrão para PhysicsComponent
 */
export const DEFAULT_PHYSICS: Required<PhysicsComponentData> = {
    mass: 1,
    velocity: { x: 0, y: 0, z: 0 },
    acceleration: { x: 0, y: 0, z: 0 },
    useGravity: true,
};
