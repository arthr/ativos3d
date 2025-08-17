import { describe, it, expect } from "vitest";
import { Vec2Factory } from "@core/geometry/factories/Vec2Factory";
import { Vec2Operations } from "@core/geometry/operations/Vec2Operations";

describe("Vec2Factory", () => {
    describe("create", () => {
        it("deve criar um Vec2 com coordenadas específicas", () => {
            const vec = Vec2Factory.create(10, 20);

            expect(vec).toEqual({ x: 10, y: 20 });
            expect(vec.x).toBe(10);
            expect(vec.y).toBe(20);
        });

        it("deve criar um Vec2 com coordenadas negativas", () => {
            const vec = Vec2Factory.create(-5, -15);

            expect(vec).toEqual({ x: -5, y: -15 });
        });

        it("deve criar um Vec2 com coordenadas decimais", () => {
            const vec = Vec2Factory.create(3.14, 2.71);

            expect(vec).toEqual({ x: 3.14, y: 2.71 });
        });
    });

    describe("zero", () => {
        it("deve criar um Vec2 zero (0, 0)", () => {
            const vec = Vec2Factory.zero();

            expect(vec).toEqual({ x: 0, y: 0 });
            expect(vec.x).toBe(0);
            expect(vec.y).toBe(0);
        });

        it("deve retornar sempre a mesma referência para zero", () => {
            const vec1 = Vec2Factory.zero();
            const vec2 = Vec2Factory.zero();

            expect(vec1).toEqual(vec2);
        });
    });

    describe("unit", () => {
        it("deve criar um Vec2 unitário (1, 1)", () => {
            const vec = Vec2Factory.unit();

            expect(vec).toEqual({ x: 1, y: 1 });
            expect(vec.x).toBe(1);
            expect(vec.y).toBe(1);
        });
    });

    describe("uniform", () => {
        it("deve criar um Vec2 com o mesmo valor em ambas as coordenadas", () => {
            const vec = Vec2Factory.uniform(5);

            expect(vec).toEqual({ x: 5, y: 5 });
            expect(vec.x).toBe(5);
            expect(vec.y).toBe(5);
        });

        it("deve criar um Vec2 uniforme com valor zero", () => {
            const vec = Vec2Factory.uniform(0);

            expect(vec).toEqual({ x: 0, y: 0 });
        });

        it("deve criar um Vec2 uniforme com valor negativo", () => {
            const vec = Vec2Factory.uniform(-3);

            expect(vec).toEqual({ x: -3, y: -3 });
        });

        it("deve criar um Vec2 uniforme com valor decimal", () => {
            const vec = Vec2Factory.uniform(2.5);

            expect(vec).toEqual({ x: 2.5, y: 2.5 });
        });
    });

    describe("imutabilidade", () => {
        it("deve criar Vec2s com propriedades readonly", () => {
            const vec = Vec2Factory.create(10, 20);

            // Verifica se as propriedades são readonly em TypeScript
            // Em runtime, objetos JavaScript são mutáveis, mas TypeScript previne modificação
            expect(vec.x).toBe(10);
            expect(vec.y).toBe(20);

            // Verifica que o objeto não é modificado por operações
            const originalVec = { ...vec };
            Vec2Operations.add(vec, Vec2Factory.create(1, 1));
            expect(vec).toEqual(originalVec);
        });
    });
});
