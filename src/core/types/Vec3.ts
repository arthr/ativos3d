/**
 * Representa um vetor 3D com coordenadas x, y, z
 */
export interface Vec3 {
    readonly x: number;
    readonly y: number;
    readonly z: number;
}

/**
 * Cria um novo Vec3
 */
export function createVec3(x: number, y: number, z: number): Vec3 {
    return { x, y, z };
}

/**
 * Cria um Vec3 zero (0, 0, 0)
 */
export function zeroVec3(): Vec3 {
    return { x: 0, y: 0, z: 0 };
}

/**
 * Cria um Vec3 unitário (1, 1, 1)
 */
export function unitVec3(): Vec3 {
    return { x: 1, y: 1, z: 1 };
}

/**
 * Adiciona dois vetores
 */
export function addVec3(a: Vec3, b: Vec3): Vec3 {
    return {
        x: a.x + b.x,
        y: a.y + b.y,
        z: a.z + b.z,
    };
}

/**
 * Subtrai dois vetores
 */
export function subtractVec3(a: Vec3, b: Vec3): Vec3 {
    return {
        x: a.x - b.x,
        y: a.y - b.y,
        z: a.z - b.z,
    };
}

/**
 * Multiplica um vetor por um escalar
 */
export function multiplyVec3(vec: Vec3, scalar: number): Vec3 {
    return {
        x: vec.x * scalar,
        y: vec.y * scalar,
        z: vec.z * scalar,
    };
}

/**
 * Calcula a magnitude (comprimento) do vetor
 */
export function magnitudeVec3(vec: Vec3): number {
    return Math.sqrt(vec.x * vec.x + vec.y * vec.y + vec.z * vec.z);
}

/**
 * Normaliza o vetor (torna unitário)
 */
export function normalizeVec3(vec: Vec3): Vec3 {
    const mag = magnitudeVec3(vec);
    if (mag === 0) return zeroVec3();
    return multiplyVec3(vec, 1 / mag);
}

/**
 * Calcula a distância entre dois pontos
 */
export function distanceVec3(a: Vec3, b: Vec3): number {
    return magnitudeVec3(subtractVec3(b, a));
}

/**
 * Verifica se dois vetores são iguais
 */
export function equalsVec3(a: Vec3, b: Vec3): boolean {
    return a.x === b.x && a.y === b.y && a.z === b.z;
}

/**
 * Converte Vec3 para string
 */
export function toStringVec3(vec: Vec3): string {
    return `(${vec.x}, ${vec.y}, ${vec.z})`;
}
