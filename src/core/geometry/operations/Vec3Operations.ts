import type { Vec3 } from "@core/geometry";

/**
 * Operações básicas de Vec3
 */
export class Vec3Operations {
    /**
     * Verifica se um Vec3 é válido
     */
    static isValid(vec: Vec3): boolean {
        return (
            typeof vec.x === "number" &&
            typeof vec.y === "number" &&
            typeof vec.z === "number" &&
            !isNaN(vec.x) &&
            !isNaN(vec.y) &&
            !isNaN(vec.z) &&
            isFinite(vec.x) &&
            isFinite(vec.y) &&
            isFinite(vec.z)
        );
    }

    /**
     * Adiciona dois vetores
     */
    static add(a: Vec3, b: Vec3): Vec3 {
        return {
            x: a.x + b.x,
            y: a.y + b.y,
            z: a.z + b.z,
        };
    }

    /**
     * Subtrai dois vetores
     */
    static subtract(a: Vec3, b: Vec3): Vec3 {
        return {
            x: a.x - b.x,
            y: a.y - b.y,
            z: a.z - b.z,
        };
    }

    /**
     * Multiplica um vetor por um escalar
     */
    static multiply(vec: Vec3, scalar: number): Vec3 {
        return {
            x: vec.x * scalar,
            y: vec.y * scalar,
            z: vec.z * scalar,
        };
    }

    /**
     * Divide um vetor por um escalar
     */
    static divide(vec: Vec3, scalar: number): Vec3 {
        if (scalar === 0) {
            throw new Error("Divisão por zero não é permitida");
        }
        return {
            x: vec.x / scalar,
            y: vec.y / scalar,
            z: vec.z / scalar,
        };
    }

    /**
     * Verifica se dois vetores são iguais
     */
    static equals(a: Vec3, b: Vec3): boolean {
        return a.x === b.x && a.y === b.y && a.z === b.z;
    }
}
