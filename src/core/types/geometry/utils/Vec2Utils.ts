import type { Vec2 } from "../Vec2";

/**
 * Utilitários para Vec2
 */
export class Vec2Utils {
    /**
     * Converte Vec2 para string
     */
    static toString(vec: Vec2): string {
        return `(${vec.x}, ${vec.y})`;
    }

    /**
     * Converte Vec2 para array
     */
    static toArray(vec: Vec2): [number, number] {
        return [vec.x, vec.y];
    }

    /**
     * Cria Vec2 a partir de array
     */
    static fromArray(arr: [number, number]): Vec2 {
        return { x: arr[0], y: arr[1] };
    }

    /**
     * Cria Vec2 a partir de objeto com propriedades x, y
     */
    static fromObject(obj: { x: number; y: number }): Vec2 {
        return { x: obj.x, y: obj.y };
    }

    /**
     * Verifica se um objeto é um Vec2 válido
     */
    static isValid(vec: unknown): vec is Vec2 {
        return (
            typeof vec === "object" &&
            vec !== null &&
            "x" in vec &&
            "y" in vec &&
            typeof (vec as any).x === "number" &&
            typeof (vec as any).y === "number"
        );
    }

    /**
     * Arredonda as coordenadas do Vec2
     */
    static round(vec: Vec2): Vec2 {
        return {
            x: Math.round(vec.x),
            y: Math.round(vec.y),
        };
    }

    /**
     * Aplica função Math.floor nas coordenadas
     */
    static floor(vec: Vec2): Vec2 {
        return {
            x: Math.floor(vec.x),
            y: Math.floor(vec.y),
        };
    }

    /**
     * Aplica função Math.ceil nas coordenadas
     */
    static ceil(vec: Vec2): Vec2 {
        return {
            x: Math.ceil(vec.x),
            y: Math.ceil(vec.y),
        };
    }
}
