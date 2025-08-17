import type { Vec2 } from "@core/geometry";

/**
 * Factory para criar Vec2
 */
export class Vec2Factory {
    /**
     * Cria um novo Vec2
     */
    static create(x: number, y: number): Vec2 {
        return { x, y };
    }

    /**
     * Cria um Vec2 zero (0, 0)
     */
    static zero(): Vec2 {
        return { x: 0, y: 0 };
    }

    /**
     * Cria um Vec2 unitário (1, 1)
     */
    static unit(): Vec2 {
        return { x: 1, y: 1 };
    }

    /**
     * Cria um Vec2 com o mesmo valor em ambas as coordenadas
     */
    static uniform(value: number): Vec2 {
        return { x: value, y: value };
    }
}
