import type { Vec3 } from "../types/Vec3";

/**
 * Utilitários para Vec3
 */
export class Vec3Utils {
    /**
     * Converte Vec3 para string
     */
    static toString(vec: Vec3): string {
        return `(${vec.x}, ${vec.y}, ${vec.z})`;
    }

    /**
     * Converte Vec3 para array
     */
    static toArray(vec: Vec3): [number, number, number] {
        return [vec.x, vec.y, vec.z];
    }

    /**
     * Cria Vec3 a partir de array
     */
    static fromArray(arr: [number, number, number]): Vec3 {
        return { x: arr[0], y: arr[1], z: arr[2] };
    }

    /**
     * Cria Vec3 a partir de objeto com propriedades x, y, z
     */
    static fromObject(obj: { x: number; y: number; z: number }): Vec3 {
        return { x: obj.x, y: obj.y, z: obj.z };
    }

    /**
     * Verifica se um objeto é um Vec3 válido
     */
    static isValid(vec: unknown): vec is Vec3 {
        return (
            typeof vec === "object" &&
            vec !== null &&
            "x" in vec &&
            "y" in vec &&
            "z" in vec &&
            typeof (vec as { x: number }).x === "number" &&
            typeof (vec as { y: number }).y === "number" &&
            typeof (vec as { z: number }).z === "number"
        );
    }

    /**
     * Arredonda as coordenadas do Vec3
     */
    static round(vec: Vec3): Vec3 {
        return {
            x: Math.round(vec.x),
            y: Math.round(vec.y),
            z: Math.round(vec.z),
        };
    }

    /**
     * Aplica função Math.floor nas coordenadas
     */
    static floor(vec: Vec3): Vec3 {
        return {
            x: Math.floor(vec.x),
            y: Math.floor(vec.y),
            z: Math.floor(vec.z),
        };
    }

    /**
     * Aplica função Math.ceil nas coordenadas
     */
    static ceil(vec: Vec3): Vec3 {
        return {
            x: Math.ceil(vec.x),
            y: Math.ceil(vec.y),
            z: Math.ceil(vec.z),
        };
    }
}
