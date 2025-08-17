import { describe, it, expect } from "vitest";
import { Vec2Operations } from "../../../src/core/geometry/operations/Vec2Operations";
import { Vec2Factory } from "../../../src/core/geometry/factories/Vec2Factory";
import type { Vec2 } from "../../../src/core/types/geometry/Vec2";

describe("Vec2Operations", () => {
    describe("add", () => {
        it("deve adicionar dois vetores", () => {
            const a = Vec2Factory.create(1, 2);
            const b = Vec2Factory.create(3, 4);

            const result = Vec2Operations.add(a, b);

            expect(result).toEqual({ x: 4, y: 6 });
        });

        it("deve adicionar vetores com valores negativos", () => {
            const a = Vec2Factory.create(-1, -2);
            const b = Vec2Factory.create(3, 4);

            const result = Vec2Operations.add(a, b);

            expect(result).toEqual({ x: 2, y: 2 });
        });

        it("deve adicionar vetores com valores decimais", () => {
            const a = Vec2Factory.create(1.5, 2.5);
            const b = Vec2Factory.create(0.5, 1.5);

            const result = Vec2Operations.add(a, b);

            expect(result).toEqual({ x: 2, y: 4 });
        });
    });

    describe("subtract", () => {
        it("deve subtrair dois vetores", () => {
            const a = Vec2Factory.create(5, 8);
            const b = Vec2Factory.create(2, 3);

            const result = Vec2Operations.subtract(a, b);

            expect(result).toEqual({ x: 3, y: 5 });
        });

        it("deve subtrair vetores com valores negativos", () => {
            const a = Vec2Factory.create(1, 2);
            const b = Vec2Factory.create(3, 4);

            const result = Vec2Operations.subtract(a, b);

            expect(result).toEqual({ x: -2, y: -2 });
        });

        it("deve subtrair vetores com valores decimais", () => {
            const a = Vec2Factory.create(3.5, 4.5);
            const b = Vec2Factory.create(1.5, 2.5);

            const result = Vec2Operations.subtract(a, b);

            expect(result).toEqual({ x: 2, y: 2 });
        });
    });

    describe("multiply", () => {
        it("deve multiplicar um vetor por um escalar", () => {
            const vec = Vec2Factory.create(2, 3);
            const scalar = 4;

            const result = Vec2Operations.multiply(vec, scalar);

            expect(result).toEqual({ x: 8, y: 12 });
        });

        it("deve multiplicar por zero", () => {
            const vec = Vec2Factory.create(2, 3);
            const scalar = 0;

            const result = Vec2Operations.multiply(vec, scalar);

            expect(result).toEqual({ x: 0, y: 0 });
        });

        it("deve multiplicar por valor negativo", () => {
            const vec = Vec2Factory.create(2, 3);
            const scalar = -2;

            const result = Vec2Operations.multiply(vec, scalar);

            expect(result).toEqual({ x: -4, y: -6 });
        });

        it("deve multiplicar por valor decimal", () => {
            const vec = Vec2Factory.create(2, 3);
            const scalar = 0.5;

            const result = Vec2Operations.multiply(vec, scalar);

            expect(result).toEqual({ x: 1, y: 1.5 });
        });
    });

    describe("divide", () => {
        it("deve dividir um vetor por um escalar", () => {
            const vec = Vec2Factory.create(8, 12);
            const scalar = 4;

            const result = Vec2Operations.divide(vec, scalar);

            expect(result).toEqual({ x: 2, y: 3 });
        });

        it("deve dividir por valor decimal", () => {
            const vec = Vec2Factory.create(1, 1.5);
            const scalar = 0.5;

            const result = Vec2Operations.divide(vec, scalar);

            expect(result).toEqual({ x: 2, y: 3 });
        });

        it("deve dividir por valor negativo", () => {
            const vec = Vec2Factory.create(-4, -6);
            const scalar = -2;

            const result = Vec2Operations.divide(vec, scalar);

            expect(result).toEqual({ x: 2, y: 3 });
        });

        it("deve lançar erro ao dividir por zero", () => {
            const vec = Vec2Factory.create(2, 3);
            const scalar = 0;

            expect(() => {
                Vec2Operations.divide(vec, scalar);
            }).toThrow("Divisão por zero não é permitida");
        });
    });

    describe("equals", () => {
        it("deve retornar true para vetores iguais", () => {
            const a = Vec2Factory.create(2, 3);
            const b = Vec2Factory.create(2, 3);

            const result = Vec2Operations.equals(a, b);

            expect(result).toBe(true);
        });

        it("deve retornar false para vetores diferentes", () => {
            const a = Vec2Factory.create(2, 3);
            const b = Vec2Factory.create(2, 4);

            const result = Vec2Operations.equals(a, b);

            expect(result).toBe(false);
        });

        it("deve retornar false para vetores com valores decimais diferentes", () => {
            const a = Vec2Factory.create(2.0, 3.0);
            const b = Vec2Factory.create(2.0, 3.1);

            const result = Vec2Operations.equals(a, b);

            expect(result).toBe(false);
        });

        it("deve retornar true para vetores com valores decimais iguais", () => {
            const a = Vec2Factory.create(2.5, 3.5);
            const b = Vec2Factory.create(2.5, 3.5);

            const result = Vec2Operations.equals(a, b);

            expect(result).toBe(true);
        });
    });

    describe("imutabilidade", () => {
        it("deve não modificar os vetores originais", () => {
            const a = Vec2Factory.create(1, 2);
            const b = Vec2Factory.create(3, 4);
            const originalA = { ...a };
            const originalB = { ...b };

            Vec2Operations.add(a, b);
            Vec2Operations.subtract(a, b);
            Vec2Operations.multiply(a, 2);

            expect(a).toEqual(originalA);
            expect(b).toEqual(originalB);
        });
    });
});
