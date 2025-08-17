import type { Vec2 } from "../Vec2";
import { Vec2Operations } from "../operations/Vec2Operations";

/**
 * Operações matemáticas de Vec2
 */
export class Vec2Math {
    /**
     * Calcula a magnitude (comprimento) do vetor
     */
    static magnitude(vec: Vec2): number {
        return Math.sqrt(vec.x * vec.x + vec.y * vec.y);
    }

    /**
     * Normaliza o vetor (torna unitário)
     */
    static normalize(vec: Vec2): Vec2 {
        const mag = this.magnitude(vec);
        if (mag === 0) return { x: 0, y: 0 };
        return Vec2Operations.divide(vec, mag);
    }

    /**
     * Calcula a distância entre dois pontos
     */
    static distance(a: Vec2, b: Vec2): number {
        return this.magnitude(Vec2Operations.subtract(b, a));
    }

    /**
     * Calcula o produto escalar (dot product)
     */
    static dot(a: Vec2, b: Vec2): number {
        return a.x * b.x + a.y * b.y;
    }

    /**
     * Calcula o ângulo entre dois vetores (em radianos)
     */
    static angle(a: Vec2, b: Vec2): number {
        const dot = this.dot(a, b);
        const magA = this.magnitude(a);
        const magB = this.magnitude(b);
        return Math.acos(dot / (magA * magB));
    }
}
