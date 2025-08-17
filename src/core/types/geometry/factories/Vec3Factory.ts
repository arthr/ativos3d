import type { Vec3 } from "../Vec3";

/**
 * Factory para criar Vec3
 */
export class Vec3Factory {
    /**
     * Cria um novo Vec3
     */
    static create(x: number, y: number, z: number): Vec3 {
        return { x, y, z };
    }

    /**
     * Cria um Vec3 zero (0, 0, 0)
     */
    static zero(): Vec3 {
        return { x: 0, y: 0, z: 0 };
    }

    /**
     * Cria um Vec3 unitário (1, 1, 1)
     */
    static unit(): Vec3 {
        return { x: 1, y: 1, z: 1 };
    }

    /**
     * Cria um Vec3 com o mesmo valor em todas as coordenadas
     */
    static uniform(value: number): Vec3 {
        return { x: value, y: value, z: value };
    }
}
