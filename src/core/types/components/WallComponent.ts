import type { Component } from "@core/types/ecs/Component";
import type { Vec3 } from "@core/geometry";

/**
 * Interface para componente de Parede no domínio.
 *
 * Representa uma parede definida por dois pontos (start -> end) e uma altura.
 */
export interface WallComponent extends Component {
    readonly type: "WallComponent";

    /** Ponto inicial da parede (no plano XZ, Y é altura do piso) */
    readonly start: Vec3;

    /** Ponto final da parede */
    readonly end: Vec3;

    /** Altura da parede (em unidades do mundo) */
    readonly height: number;

    /** Define novo ponto inicial (imutável) */
    setStart(start: Vec3): WallComponent;

    /** Define novo ponto final (imutável) */
    setEnd(end: Vec3): WallComponent;

    /** Define nova altura (imutável) */
    setHeight(height: number): WallComponent;

    /** Retorna se os dados da parede são válidos */
    isValid(): boolean;
}

/**
 * Dados para criar um WallComponent
 */
export interface WallComponentData {
    start: Vec3;
    end: Vec3;
    height: number;
}

