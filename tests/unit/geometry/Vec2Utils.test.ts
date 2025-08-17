import { describe, it, expect } from "vitest";
import { Vec2Utils } from "../../../src/core/geometry/utils/Vec2Utils";
import { Vec2Factory } from "../../../src/core/geometry/factories/Vec2Factory";
import type { Vec2 } from "../../../src/core/geometry/types/Vec2";

describe("Vec2Utils", () => {
    describe("toString", () => {
        it("deve converter Vec2 para string", () => {
            const vec = Vec2Factory.create(10, 20);

            const result = Vec2Utils.toString(vec);

            expect(result).toBe("(10, 20)");
        });

        it("deve converter Vec2 com valores negativos para string", () => {
            const vec = Vec2Factory.create(-5, -15);

            const result = Vec2Utils.toString(vec);

            expect(result).toBe("(-5, -15)");
        });

        it("deve converter Vec2 com valores decimais para string", () => {
            const vec = Vec2Factory.create(3.14, 2.71);

            const result = Vec2Utils.toString(vec);

            expect(result).toBe("(3.14, 2.71)");
        });
    });

    describe("toArray", () => {
        it("deve converter Vec2 para array", () => {
            const vec = Vec2Factory.create(10, 20);

            const result = Vec2Utils.toArray(vec);

            expect(result).toEqual([10, 20]);
        });

        it("deve converter Vec2 com valores negativos para array", () => {
            const vec = Vec2Factory.create(-5, -15);

            const result = Vec2Utils.toArray(vec);

            expect(result).toEqual([-5, -15]);
        });

        it("deve converter Vec2 com valores decimais para array", () => {
            const vec = Vec2Factory.create(3.14, 2.71);

            const result = Vec2Utils.toArray(vec);

            expect(result).toEqual([3.14, 2.71]);
        });
    });

    describe("fromArray", () => {
        it("deve criar Vec2 a partir de array", () => {
            const arr: [number, number] = [10, 20];

            const result = Vec2Utils.fromArray(arr);

            expect(result).toEqual({ x: 10, y: 20 });
        });

        it("deve criar Vec2 a partir de array com valores negativos", () => {
            const arr: [number, number] = [-5, -15];

            const result = Vec2Utils.fromArray(arr);

            expect(result).toEqual({ x: -5, y: -15 });
        });

        it("deve criar Vec2 a partir de array com valores decimais", () => {
            const arr: [number, number] = [3.14, 2.71];

            const result = Vec2Utils.fromArray(arr);

            expect(result).toEqual({ x: 3.14, y: 2.71 });
        });
    });

    describe("fromObject", () => {
        it("deve criar Vec2 a partir de objeto", () => {
            const obj = { x: 10, y: 20 };

            const result = Vec2Utils.fromObject(obj);

            expect(result).toEqual({ x: 10, y: 20 });
        });

        it("deve criar Vec2 a partir de objeto com valores negativos", () => {
            const obj = { x: -5, y: -15 };

            const result = Vec2Utils.fromObject(obj);

            expect(result).toEqual({ x: -5, y: -15 });
        });

        it("deve criar Vec2 a partir de objeto com valores decimais", () => {
            const obj = { x: 3.14, y: 2.71 };

            const result = Vec2Utils.fromObject(obj);

            expect(result).toEqual({ x: 3.14, y: 2.71 });
        });
    });

    describe("isValid", () => {
        it("deve retornar true para Vec2 válido", () => {
            const vec = Vec2Factory.create(10, 20);

            const result = Vec2Utils.isValid(vec);

            expect(result).toBe(true);
        });

        it("deve retornar false para null", () => {
            const result = Vec2Utils.isValid(null);

            expect(result).toBe(false);
        });

        it("deve retornar false para undefined", () => {
            const result = Vec2Utils.isValid(undefined);

            expect(result).toBe(false);
        });

        it("deve retornar false para objeto sem propriedades x, y", () => {
            const obj = { a: 1, b: 2 };

            const result = Vec2Utils.isValid(obj);

            expect(result).toBe(false);
        });

        it("deve retornar false para objeto com propriedades x, y mas valores não numéricos", () => {
            const obj = { x: "10", y: "20" };

            const result = Vec2Utils.isValid(obj);

            expect(result).toBe(false);
        });

        it("deve retornar false para objeto com apenas uma propriedade", () => {
            const obj = { x: 10 };

            const result = Vec2Utils.isValid(obj);

            expect(result).toBe(false);
        });

        it("deve retornar true para objeto com propriedades x, y numéricas", () => {
            const obj = { x: 10, y: 20 };

            const result = Vec2Utils.isValid(obj);

            expect(result).toBe(true);
        });
    });

    describe("round", () => {
        it("deve arredondar as coordenadas do Vec2", () => {
            const vec = Vec2Factory.create(3.7, 4.2);

            const result = Vec2Utils.round(vec);

            expect(result).toEqual({ x: 4, y: 4 });
        });

        it("deve arredondar valores negativos", () => {
            const vec = Vec2Factory.create(-3.7, -4.2);

            const result = Vec2Utils.round(vec);

            expect(result).toEqual({ x: -4, y: -4 });
        });

        it("deve manter valores inteiros inalterados", () => {
            const vec = Vec2Factory.create(3, 4);

            const result = Vec2Utils.round(vec);

            expect(result).toEqual({ x: 3, y: 4 });
        });
    });

    describe("floor", () => {
        it("deve aplicar Math.floor nas coordenadas", () => {
            const vec = Vec2Factory.create(3.7, 4.2);

            const result = Vec2Utils.floor(vec);

            expect(result).toEqual({ x: 3, y: 4 });
        });

        it("deve aplicar Math.floor em valores negativos", () => {
            const vec = Vec2Factory.create(-3.7, -4.2);

            const result = Vec2Utils.floor(vec);

            expect(result).toEqual({ x: -4, y: -5 });
        });

        it("deve manter valores inteiros inalterados", () => {
            const vec = Vec2Factory.create(3, 4);

            const result = Vec2Utils.floor(vec);

            expect(result).toEqual({ x: 3, y: 4 });
        });
    });

    describe("ceil", () => {
        it("deve aplicar Math.ceil nas coordenadas", () => {
            const vec = Vec2Factory.create(3.7, 4.2);

            const result = Vec2Utils.ceil(vec);

            expect(result).toEqual({ x: 4, y: 5 });
        });

        it("deve aplicar Math.ceil em valores negativos", () => {
            const vec = Vec2Factory.create(-3.7, -4.2);

            const result = Vec2Utils.ceil(vec);

            expect(result).toEqual({ x: -3, y: -4 });
        });

        it("deve manter valores inteiros inalterados", () => {
            const vec = Vec2Factory.create(3, 4);

            const result = Vec2Utils.ceil(vec);

            expect(result).toEqual({ x: 3, y: 4 });
        });
    });

    describe("imutabilidade", () => {
        it("deve não modificar o vetor original", () => {
            const vec = Vec2Factory.create(3.7, 4.2);
            const originalVec = { ...vec };

            Vec2Utils.toString(vec);
            Vec2Utils.toArray(vec);
            Vec2Utils.round(vec);
            Vec2Utils.floor(vec);
            Vec2Utils.ceil(vec);

            expect(vec).toEqual(originalVec);
        });
    });
});
