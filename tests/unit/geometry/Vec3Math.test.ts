import { describe, it, expect } from "vitest";
import { Vec3Math } from "../../../src/core/geometry/math/Vec3Math";
import { Vec3Factory } from "../../../src/core/geometry/factories/Vec3Factory";
import type { Vec3 } from "../../../src/core/geometry/types/Vec3";

describe("Vec3Math", () => {
    describe("magnitude", () => {
        it("deve calcular a magnitude de um vetor", () => {
            const vec = Vec3Factory.create(2, 3, 6);

            const magnitude = Vec3Math.magnitude(vec);

            expect(magnitude).toBe(7); // sqrt(2² + 3² + 6²) = sqrt(4 + 9 + 36) = sqrt(49) = 7
        });

        it("deve calcular a magnitude de um vetor zero", () => {
            const vec = Vec3Factory.create(0, 0, 0);

            const magnitude = Vec3Math.magnitude(vec);

            expect(magnitude).toBe(0);
        });

        it("deve calcular a magnitude de um vetor com valores negativos", () => {
            const vec = Vec3Factory.create(-2, -3, -6);

            const magnitude = Vec3Math.magnitude(vec);

            expect(magnitude).toBe(7); // sqrt((-2)² + (-3)² + (-6)²) = sqrt(4 + 9 + 36) = sqrt(49) = 7
        });

        it("deve calcular a magnitude de um vetor com valores decimais", () => {
            const vec = Vec3Factory.create(1.5, 2.0, 2.5);

            const magnitude = Vec3Math.magnitude(vec);

            expect(magnitude).toBeCloseTo(3.54); // sqrt(1.5² + 2² + 2.5²) = sqrt(2.25 + 4 + 6.25) = sqrt(12.5) ≈ 3.54
        });
    });

    describe("normalize", () => {
        it("deve normalizar um vetor", () => {
            const vec = Vec3Factory.create(2, 3, 6);

            const normalized = Vec3Math.normalize(vec);

            expect(normalized.x).toBeCloseTo(2 / 7);
            expect(normalized.y).toBeCloseTo(3 / 7);
            expect(normalized.z).toBeCloseTo(6 / 7);
        });

        it("deve retornar vetor zero para vetor zero", () => {
            const vec = Vec3Factory.create(0, 0, 0);

            const normalized = Vec3Math.normalize(vec);

            expect(normalized).toEqual({ x: 0, y: 0, z: 0 });
        });

        it("deve normalizar um vetor unitário", () => {
            const vec = Vec3Factory.create(1, 0, 0);

            const normalized = Vec3Math.normalize(vec);

            expect(normalized.x).toBeCloseTo(1);
            expect(normalized.y).toBeCloseTo(0);
            expect(normalized.z).toBeCloseTo(0);
        });

        it("deve normalizar um vetor com valores decimais", () => {
            const vec = Vec3Factory.create(1.5, 2.0, 2.5);

            const normalized = Vec3Math.normalize(vec);

            expect(Vec3Math.magnitude(normalized)).toBeCloseTo(1);
        });
    });

    describe("distance", () => {
        it("deve calcular a distância entre dois pontos", () => {
            const a = Vec3Factory.create(0, 0, 0);
            const b = Vec3Factory.create(2, 3, 6);

            const distance = Vec3Math.distance(a, b);

            expect(distance).toBe(7); // sqrt(2² + 3² + 6²) = 7
        });

        it("deve calcular a distância entre pontos iguais", () => {
            const a = Vec3Factory.create(2, 3, 4);
            const b = Vec3Factory.create(2, 3, 4);

            const distance = Vec3Math.distance(a, b);

            expect(distance).toBe(0);
        });

        it("deve calcular a distância entre pontos com valores negativos", () => {
            const a = Vec3Factory.create(-1, -2, -3);
            const b = Vec3Factory.create(2, 2, 3);

            const distance = Vec3Math.distance(a, b);

            expect(distance).toBeCloseTo(7.81); // sqrt(3² + 4² + 6²) = sqrt(9 + 16 + 36) = sqrt(61) ≈ 7.81
        });

        it("deve calcular a distância entre pontos com valores decimais", () => {
            const a = Vec3Factory.create(1.5, 2.5, 3.5);
            const b = Vec3Factory.create(4.5, 6.5, 7.5);

            const distance = Vec3Math.distance(a, b);

            expect(distance).toBeCloseTo(6.4); // sqrt(3² + 4² + 4²) = sqrt(9 + 16 + 16) = sqrt(41) ≈ 6.40
        });
    });

    describe("dot", () => {
        it("deve calcular o produto escalar", () => {
            const a = Vec3Factory.create(2, 3, 4);
            const b = Vec3Factory.create(5, 6, 7);

            const dot = Vec3Math.dot(a, b);

            expect(dot).toBe(56); // 2*5 + 3*6 + 4*7 = 10 + 18 + 28 = 56
        });

        it("deve calcular o produto escalar com vetores perpendiculares", () => {
            const a = Vec3Factory.create(1, 0, 0);
            const b = Vec3Factory.create(0, 1, 0);

            const dot = Vec3Math.dot(a, b);

            expect(dot).toBe(0);
        });

        it("deve calcular o produto escalar com valores negativos", () => {
            const a = Vec3Factory.create(-2, -3, -4);
            const b = Vec3Factory.create(5, 6, 7);

            const dot = Vec3Math.dot(a, b);

            expect(dot).toBe(-56); // (-2)*5 + (-3)*6 + (-4)*7 = -10 + (-18) + (-28) = -56
        });

        it("deve calcular o produto escalar com valores decimais", () => {
            const a = Vec3Factory.create(1.5, 2.5, 3.5);
            const b = Vec3Factory.create(2.0, 3.0, 4.0);

            const dot = Vec3Math.dot(a, b);

            expect(dot).toBe(24.5); // 1.5*2.0 + 2.5*3.0 + 3.5*4.0 = 3 + 7.5 + 14 = 24.5
        });
    });

    describe("angle", () => {
        it("deve calcular o ângulo entre dois vetores", () => {
            const a = Vec3Factory.create(1, 0, 0);
            const b = Vec3Factory.create(0, 1, 0);

            const angle = Vec3Math.angle(a, b);

            expect(angle).toBeCloseTo(Math.PI / 2); // 90 graus em radianos
        });

        it("deve calcular o ângulo entre vetores paralelos", () => {
            const a = Vec3Factory.create(2, 0, 0);
            const b = Vec3Factory.create(4, 0, 0);

            const angle = Vec3Math.angle(a, b);

            expect(angle).toBeCloseTo(0);
        });

        it("deve calcular o ângulo entre vetores opostos", () => {
            const a = Vec3Factory.create(1, 0, 0);
            const b = Vec3Factory.create(-1, 0, 0);

            const angle = Vec3Math.angle(a, b);

            expect(angle).toBeCloseTo(Math.PI); // 180 graus em radianos
        });

        it("deve calcular o ângulo entre vetores com valores decimais", () => {
            const a = Vec3Factory.create(1.5, 2.0, 2.5);
            const b = Vec3Factory.create(2.0, 1.5, 2.0);

            const angle = Vec3Math.angle(a, b);

            expect(angle).toBeGreaterThan(0);
            expect(angle).toBeLessThan(Math.PI);
        });
    });

    describe("imutabilidade", () => {
        it("deve não modificar os vetores originais", () => {
            const a = Vec3Factory.create(2, 3, 6);
            const b = Vec3Factory.create(1, 0, 0);
            const originalA = { ...a };
            const originalB = { ...b };

            Vec3Math.normalize(a);
            Vec3Math.distance(a, b);
            Vec3Math.dot(a, b);
            Vec3Math.angle(a, b);

            expect(a).toEqual(originalA);
            expect(b).toEqual(originalB);
        });
    });
});
