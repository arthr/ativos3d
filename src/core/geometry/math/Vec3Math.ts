import type { Vec3, Vec3Operations } from "@core/geometry";

/**
 * Operações matemáticas avançadas de Vec3
 */
export class Vec3Math {
    /**
     * Calcula a magnitude (comprimento) do vetor
     */
    static magnitude(vec: Vec3): number {
        return Math.sqrt(vec.x * vec.x + vec.y * vec.y + vec.z * vec.z);
    }

    /**
     * Normaliza o vetor (torna unitário)
     */
    static normalize(vec: Vec3): Vec3 {
        const mag = this.magnitude(vec);
        if (mag === 0) return { x: 0, y: 0, z: 0 };
        return Vec3Operations.divide(vec, mag);
    }

    /**
     * Calcula a distância entre dois pontos
     */
    static distance(a: Vec3, b: Vec3): number {
        return this.magnitude(Vec3Operations.subtract(b, a));
    }

    /**
     * Calcula o produto escalar (dot product)
     */
    static dot(a: Vec3, b: Vec3): number {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }

    /**
     * Calcula o produto vetorial (cross product)
     */
    static cross(a: Vec3, b: Vec3): Vec3 {
        return {
            x: a.y * b.z - a.z * b.y,
            y: a.z * b.x - a.x * b.z,
            z: a.x * b.y - a.y * b.x,
        };
    }

    /**
     * Calcula o ângulo entre dois vetores (em radianos)
     */
    static angle(a: Vec3, b: Vec3): number {
        const dot = this.dot(a, b);
        const magA = this.magnitude(a);
        const magB = this.magnitude(b);
        return Math.acos(dot / (magA * magB));
    }
}
