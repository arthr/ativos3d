import { describe, it, expect } from "vitest";
import { Vec2Math } from "../../../src/core/geometry/math/Vec2Math";
import { Vec2Factory } from "../../../src/core/geometry/factories/Vec2Factory";
import type { Vec2 } from "../../../src/core/geometry/types/Vec2";

describe("Vec2Math", () => {
    describe("magnitude", () => {
        it("deve calcular a magnitude de um vetor", () => {
            const vec = Vec2Factory.create(3, 4);

            const magnitude = Vec2Math.magnitude(vec);

            expect(magnitude).toBe(5); // sqrt(3² + 4²) = sqrt(9 + 16) = sqrt(25) = 5
        });

        it("deve calcular a magnitude de um vetor zero", () => {
            const vec = Vec2Factory.create(0, 0);

            const magnitude = Vec2Math.magnitude(vec);

            expect(magnitude).toBe(0);
        });

        it("deve calcular a magnitude de um vetor com valores negativos", () => {
            const vec = Vec2Factory.create(-3, -4);

            const magnitude = Vec2Math.magnitude(vec);

            expect(magnitude).toBe(5); // sqrt((-3)² + (-4)²) = sqrt(9 + 16) = sqrt(25) = 5
        });

        it("deve calcular a magnitude de um vetor com valores decimais", () => {
            const vec = Vec2Factory.create(1.5, 2.0);

            const magnitude = Vec2Math.magnitude(vec);

            expect(magnitude).toBeCloseTo(2.5); // sqrt(1.5² + 2²) = sqrt(2.25 + 4) = sqrt(6.25) = 2.5
        });
    });

    describe("normalize", () => {
        it("deve normalizar um vetor", () => {
            const vec = Vec2Factory.create(3, 4);

            const normalized = Vec2Math.normalize(vec);

            expect(normalized.x).toBeCloseTo(0.6); // 3/5
            expect(normalized.y).toBeCloseTo(0.8); // 4/5
        });

        it("deve retornar vetor zero para vetor zero", () => {
            const vec = Vec2Factory.create(0, 0);

            const normalized = Vec2Math.normalize(vec);

            expect(normalized).toEqual({ x: 0, y: 0 });
        });

        it("deve normalizar um vetor unitário", () => {
            const vec = Vec2Factory.create(1, 0);

            const normalized = Vec2Math.normalize(vec);

            expect(normalized.x).toBeCloseTo(1);
            expect(normalized.y).toBeCloseTo(0);
        });

        it("deve normalizar um vetor com valores decimais", () => {
            const vec = Vec2Factory.create(1.5, 2.0);

            const normalized = Vec2Math.normalize(vec);

            expect(Vec2Math.magnitude(normalized)).toBeCloseTo(1);
        });
    });

    describe("distance", () => {
        it("deve calcular a distância entre dois pontos", () => {
            const a = Vec2Factory.create(0, 0);
            const b = Vec2Factory.create(3, 4);

            const distance = Vec2Math.distance(a, b);

            expect(distance).toBe(5); // sqrt(3² + 4²) = 5
        });

        it("deve calcular a distância entre pontos iguais", () => {
            const a = Vec2Factory.create(2, 3);
            const b = Vec2Factory.create(2, 3);

            const distance = Vec2Math.distance(a, b);

            expect(distance).toBe(0);
        });

        it("deve calcular a distância entre pontos com valores negativos", () => {
            const a = Vec2Factory.create(-1, -2);
            const b = Vec2Factory.create(2, 2);

            const distance = Vec2Math.distance(a, b);

            expect(distance).toBeCloseTo(5); // sqrt(3² + 4²) = 5
        });

        it("deve calcular a distância entre pontos com valores decimais", () => {
            const a = Vec2Factory.create(1.5, 2.5);
            const b = Vec2Factory.create(4.5, 6.5);

            const distance = Vec2Math.distance(a, b);

            expect(distance).toBeCloseTo(5); // sqrt(3² + 4²) = 5
        });
    });

    describe("dot", () => {
        it("deve calcular o produto escalar", () => {
            const a = Vec2Factory.create(2, 3);
            const b = Vec2Factory.create(4, 5);

            const dot = Vec2Math.dot(a, b);

            expect(dot).toBe(23); // 2*4 + 3*5 = 8 + 15 = 23
        });

        it("deve calcular o produto escalar com vetores perpendiculares", () => {
            const a = Vec2Factory.create(1, 0);
            const b = Vec2Factory.create(0, 1);

            const dot = Vec2Math.dot(a, b);

            expect(dot).toBe(0);
        });

        it("deve calcular o produto escalar com valores negativos", () => {
            const a = Vec2Factory.create(-2, -3);
            const b = Vec2Factory.create(4, 5);

            const dot = Vec2Math.dot(a, b);

            expect(dot).toBe(-23); // (-2)*4 + (-3)*5 = -8 + (-15) = -23
        });

        it("deve calcular o produto escalar com valores decimais", () => {
            const a = Vec2Factory.create(1.5, 2.5);
            const b = Vec2Factory.create(2.0, 3.0);

            const dot = Vec2Math.dot(a, b);

            expect(dot).toBe(10.5); // 1.5*2.0 + 2.5*3.0 = 3 + 7.5 = 10.5
        });
    });

    describe("angle", () => {
        it("deve calcular o ângulo entre dois vetores", () => {
            const a = Vec2Factory.create(1, 0);
            const b = Vec2Factory.create(0, 1);

            const angle = Vec2Math.angle(a, b);

            expect(angle).toBeCloseTo(Math.PI / 2); // 90 graus em radianos
        });

        it("deve calcular o ângulo entre vetores paralelos", () => {
            const a = Vec2Factory.create(2, 0);
            const b = Vec2Factory.create(4, 0);

            const angle = Vec2Math.angle(a, b);

            expect(angle).toBeCloseTo(0);
        });

        it("deve calcular o ângulo entre vetores opostos", () => {
            const a = Vec2Factory.create(1, 0);
            const b = Vec2Factory.create(-1, 0);

            const angle = Vec2Math.angle(a, b);

            expect(angle).toBeCloseTo(Math.PI); // 180 graus em radianos
        });

        it("deve calcular o ângulo entre vetores com valores decimais", () => {
            const a = Vec2Factory.create(1.5, 2.0);
            const b = Vec2Factory.create(2.0, 1.5);

            const angle = Vec2Math.angle(a, b);

            expect(angle).toBeGreaterThan(0);
            expect(angle).toBeLessThan(Math.PI);
        });
    });

    describe("imutabilidade", () => {
        it("deve não modificar os vetores originais", () => {
            const a = Vec2Factory.create(3, 4);
            const b = Vec2Factory.create(1, 0);
            const originalA = { ...a };
            const originalB = { ...b };

            Vec2Math.normalize(a);
            Vec2Math.distance(a, b);
            Vec2Math.dot(a, b);
            Vec2Math.angle(a, b);

            expect(a).toEqual(originalA);
            expect(b).toEqual(originalB);
        });
    });
});
