import type { Component } from "@core/types/ecs/Component";
import type { Vec3 } from "@core/geometry";

/**
 * Interface para componente de Piso no domínio.
 *
 * Representa um piso retangular definido por uma posição (centro) e um tamanho.
 */
export interface FloorComponent extends Component {
    readonly type: "FloorComponent";

    /** Posição do centro do piso */
    readonly position: Vec3;

    /** Tamanho do piso (largura X, espessura Y, profundidade Z) */
    readonly size: Vec3;

    /** Material identificado por string no domínio */
    readonly material: string;

    /** Define nova posição (imutável) */
    setPosition(position: Vec3): FloorComponent;

    /** Define novo tamanho (imutável) */
    setSize(size: Vec3): FloorComponent;

    /** Define novo material (imutável) */
    setMaterial(material: string): FloorComponent;

    /** Retorna se os dados do piso são válidos */
    isValid(): boolean;
}

/**
 * Dados para criar um FloorComponent
 */
export interface FloorComponentData {
    position: Vec3;
    size: Vec3;
    material: string;
}

