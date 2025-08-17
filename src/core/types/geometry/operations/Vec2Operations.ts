import type { Vec2 } from "../Vec2";

/**
 * Operações básicas de Vec2
 */
export class Vec2Operations {
    /**
     * Adiciona dois vetores
     */
    static add(a: Vec2, b: Vec2): Vec2 {
        return {
            x: a.x + b.x,
            y: a.y + b.y,
        };
    }

    /**
     * Subtrai dois vetores
     */
    static subtract(a: Vec2, b: Vec2): Vec2 {
        return {
            x: a.x - b.x,
            y: a.y - b.y,
        };
    }

    /**
     * Multiplica um vetor por um escalar
     */
    static multiply(vec: Vec2, scalar: number): Vec2 {
        return {
            x: vec.x * scalar,
            y: vec.y * scalar,
        };
    }

    /**
     * Divide um vetor por um escalar
     */
    static divide(vec: Vec2, scalar: number): Vec2 {
        if (scalar === 0) {
            throw new Error("Divisão por zero não é permitida");
        }
        return {
            x: vec.x / scalar,
            y: vec.y / scalar,
        };
    }

    /**
     * Verifica se dois vetores são iguais
     */
    static equals(a: Vec2, b: Vec2): boolean {
        return a.x === b.x && a.y === b.y;
    }
}
