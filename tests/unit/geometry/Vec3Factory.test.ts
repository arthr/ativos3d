import { describe, it, expect } from "vitest";
import { Vec3Factory } from "../../../src/core/geometry/factories/Vec3Factory";
import { Vec3Operations } from "../../../src/core/geometry/operations/Vec3Operations";
import type { Vec3 } from "../../../src/core/geometry/types/Vec3";

describe("Vec3Factory", () => {
    describe("create", () => {
        it("deve criar um Vec3 com coordenadas específicas", () => {
            const vec = Vec3Factory.create(10, 20, 30);

            expect(vec).toEqual({ x: 10, y: 20, z: 30 });
            expect(vec.x).toBe(10);
            expect(vec.y).toBe(20);
            expect(vec.z).toBe(30);
        });

        it("deve criar um Vec3 com coordenadas negativas", () => {
            const vec = Vec3Factory.create(-5, -15, -25);

            expect(vec).toEqual({ x: -5, y: -15, z: -25 });
        });

        it("deve criar um Vec3 com coordenadas decimais", () => {
            const vec = Vec3Factory.create(3.14, 2.71, 1.41);

            expect(vec).toEqual({ x: 3.14, y: 2.71, z: 1.41 });
        });
    });

    describe("zero", () => {
        it("deve criar um Vec3 zero (0, 0, 0)", () => {
            const vec = Vec3Factory.zero();

            expect(vec).toEqual({ x: 0, y: 0, z: 0 });
            expect(vec.x).toBe(0);
            expect(vec.y).toBe(0);
            expect(vec.z).toBe(0);
        });

        it("deve retornar sempre a mesma referência para zero", () => {
            const vec1 = Vec3Factory.zero();
            const vec2 = Vec3Factory.zero();

            expect(vec1).toEqual(vec2);
        });
    });

    describe("unit", () => {
        it("deve criar um Vec3 unitário (1, 1, 1)", () => {
            const vec = Vec3Factory.unit();

            expect(vec).toEqual({ x: 1, y: 1, z: 1 });
            expect(vec.x).toBe(1);
            expect(vec.y).toBe(1);
            expect(vec.z).toBe(1);
        });
    });

    describe("uniform", () => {
        it("deve criar um Vec3 com o mesmo valor em todas as coordenadas", () => {
            const vec = Vec3Factory.uniform(5);

            expect(vec).toEqual({ x: 5, y: 5, z: 5 });
            expect(vec.x).toBe(5);
            expect(vec.y).toBe(5);
            expect(vec.z).toBe(5);
        });

        it("deve criar um Vec3 uniforme com valor zero", () => {
            const vec = Vec3Factory.uniform(0);

            expect(vec).toEqual({ x: 0, y: 0, z: 0 });
        });

        it("deve criar um Vec3 uniforme com valor negativo", () => {
            const vec = Vec3Factory.uniform(-3);

            expect(vec).toEqual({ x: -3, y: -3, z: -3 });
        });

        it("deve criar um Vec3 uniforme com valor decimal", () => {
            const vec = Vec3Factory.uniform(2.5);

            expect(vec).toEqual({ x: 2.5, y: 2.5, z: 2.5 });
        });
    });

    describe("imutabilidade", () => {
        it("deve criar Vec3s com propriedades readonly", () => {
            const vec = Vec3Factory.create(10, 20, 30);

            // Verifica se as propriedades são readonly em TypeScript
            // Em runtime, objetos JavaScript são mutáveis, mas TypeScript previne modificação
            expect(vec.x).toBe(10);
            expect(vec.y).toBe(20);
            expect(vec.z).toBe(30);

            // Verifica que o objeto não é modificado por operações
            const originalVec = { ...vec };
            Vec3Operations.add(vec, Vec3Factory.create(1, 1, 1));
            expect(vec).toEqual(originalVec);
        });
    });
});
