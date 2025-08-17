import { describe, it, expect } from "vitest";
import { Vec3Operations } from "../../../src/core/geometry/operations/Vec3Operations";
import { Vec3Factory } from "../../../src/core/geometry/factories/Vec3Factory";
import type { Vec3 } from "../../../src/core/geometry/types/Vec3";

describe("Vec3Operations", () => {
    describe("add", () => {
        it("deve adicionar dois vetores", () => {
            const a = Vec3Factory.create(1, 2, 3);
            const b = Vec3Factory.create(4, 5, 6);

            const result = Vec3Operations.add(a, b);

            expect(result).toEqual({ x: 5, y: 7, z: 9 });
        });

        it("deve adicionar vetores com valores negativos", () => {
            const a = Vec3Factory.create(-1, -2, -3);
            const b = Vec3Factory.create(4, 5, 6);

            const result = Vec3Operations.add(a, b);

            expect(result).toEqual({ x: 3, y: 3, z: 3 });
        });

        it("deve adicionar vetores com valores decimais", () => {
            const a = Vec3Factory.create(1.5, 2.5, 3.5);
            const b = Vec3Factory.create(0.5, 1.5, 2.5);

            const result = Vec3Operations.add(a, b);

            expect(result).toEqual({ x: 2, y: 4, z: 6 });
        });
    });

    describe("subtract", () => {
        it("deve subtrair dois vetores", () => {
            const a = Vec3Factory.create(5, 8, 11);
            const b = Vec3Factory.create(2, 3, 4);

            const result = Vec3Operations.subtract(a, b);

            expect(result).toEqual({ x: 3, y: 5, z: 7 });
        });

        it("deve subtrair vetores com valores negativos", () => {
            const a = Vec3Factory.create(1, 2, 3);
            const b = Vec3Factory.create(4, 5, 6);

            const result = Vec3Operations.subtract(a, b);

            expect(result).toEqual({ x: -3, y: -3, z: -3 });
        });

        it("deve subtrair vetores com valores decimais", () => {
            const a = Vec3Factory.create(3.5, 4.5, 5.5);
            const b = Vec3Factory.create(1.5, 2.5, 3.5);

            const result = Vec3Operations.subtract(a, b);

            expect(result).toEqual({ x: 2, y: 2, z: 2 });
        });
    });

    describe("multiply", () => {
        it("deve multiplicar um vetor por um escalar", () => {
            const vec = Vec3Factory.create(2, 3, 4);
            const scalar = 5;

            const result = Vec3Operations.multiply(vec, scalar);

            expect(result).toEqual({ x: 10, y: 15, z: 20 });
        });

        it("deve multiplicar por zero", () => {
            const vec = Vec3Factory.create(2, 3, 4);
            const scalar = 0;

            const result = Vec3Operations.multiply(vec, scalar);

            expect(result).toEqual({ x: 0, y: 0, z: 0 });
        });

        it("deve multiplicar por valor negativo", () => {
            const vec = Vec3Factory.create(2, 3, 4);
            const scalar = -2;

            const result = Vec3Operations.multiply(vec, scalar);

            expect(result).toEqual({ x: -4, y: -6, z: -8 });
        });

        it("deve multiplicar por valor decimal", () => {
            const vec = Vec3Factory.create(2, 3, 4);
            const scalar = 0.5;

            const result = Vec3Operations.multiply(vec, scalar);

            expect(result).toEqual({ x: 1, y: 1.5, z: 2 });
        });
    });

    describe("divide", () => {
        it("deve dividir um vetor por um escalar", () => {
            const vec = Vec3Factory.create(10, 15, 20);
            const scalar = 5;

            const result = Vec3Operations.divide(vec, scalar);

            expect(result).toEqual({ x: 2, y: 3, z: 4 });
        });

        it("deve dividir por valor decimal", () => {
            const vec = Vec3Factory.create(1, 1.5, 2);
            const scalar = 0.5;

            const result = Vec3Operations.divide(vec, scalar);

            expect(result).toEqual({ x: 2, y: 3, z: 4 });
        });

        it("deve dividir por valor negativo", () => {
            const vec = Vec3Factory.create(-4, -6, -8);
            const scalar = -2;

            const result = Vec3Operations.divide(vec, scalar);

            expect(result).toEqual({ x: 2, y: 3, z: 4 });
        });

        it("deve lançar erro ao dividir por zero", () => {
            const vec = Vec3Factory.create(2, 3, 4);
            const scalar = 0;

            expect(() => {
                Vec3Operations.divide(vec, scalar);
            }).toThrow("Divisão por zero não é permitida");
        });
    });

    describe("equals", () => {
        it("deve retornar true para vetores iguais", () => {
            const a = Vec3Factory.create(2, 3, 4);
            const b = Vec3Factory.create(2, 3, 4);

            const result = Vec3Operations.equals(a, b);

            expect(result).toBe(true);
        });

        it("deve retornar false para vetores diferentes", () => {
            const a = Vec3Factory.create(2, 3, 4);
            const b = Vec3Factory.create(2, 3, 5);

            const result = Vec3Operations.equals(a, b);

            expect(result).toBe(false);
        });

        it("deve retornar false para vetores com valores decimais diferentes", () => {
            const a = Vec3Factory.create(2.0, 3.0, 4.0);
            const b = Vec3Factory.create(2.0, 3.0, 4.1);

            const result = Vec3Operations.equals(a, b);

            expect(result).toBe(false);
        });

        it("deve retornar true para vetores com valores decimais iguais", () => {
            const a = Vec3Factory.create(2.5, 3.5, 4.5);
            const b = Vec3Factory.create(2.5, 3.5, 4.5);

            const result = Vec3Operations.equals(a, b);

            expect(result).toBe(true);
        });
    });

    describe("imutabilidade", () => {
        it("deve não modificar os vetores originais", () => {
            const a = Vec3Factory.create(1, 2, 3);
            const b = Vec3Factory.create(4, 5, 6);
            const originalA = { ...a };
            const originalB = { ...b };

            Vec3Operations.add(a, b);
            Vec3Operations.subtract(a, b);
            Vec3Operations.multiply(a, 2);

            expect(a).toEqual(originalA);
            expect(b).toEqual(originalB);
        });
    });
});
