import { describe, it, expect } from "vitest";
import { Vec3Utils } from "@core/geometry/utils/Vec3Utils";
import { Vec3Factory } from "@core/geometry/factories/Vec3Factory";

describe("Vec3Utils", () => {
    describe("toString", () => {
        it("deve converter Vec3 para string", () => {
            const vec = Vec3Factory.create(10, 20, 30);

            const result = Vec3Utils.toString(vec);

            expect(result).toBe("(10, 20, 30)");
        });

        it("deve converter Vec3 com valores negativos para string", () => {
            const vec = Vec3Factory.create(-5, -15, -25);

            const result = Vec3Utils.toString(vec);

            expect(result).toBe("(-5, -15, -25)");
        });

        it("deve converter Vec3 com valores decimais para string", () => {
            const vec = Vec3Factory.create(3.14, 2.71, 1.41);

            const result = Vec3Utils.toString(vec);

            expect(result).toBe("(3.14, 2.71, 1.41)");
        });
    });

    describe("toArray", () => {
        it("deve converter Vec3 para array", () => {
            const vec = Vec3Factory.create(10, 20, 30);

            const result = Vec3Utils.toArray(vec);

            expect(result).toEqual([10, 20, 30]);
        });

        it("deve converter Vec3 com valores negativos para array", () => {
            const vec = Vec3Factory.create(-5, -15, -25);

            const result = Vec3Utils.toArray(vec);

            expect(result).toEqual([-5, -15, -25]);
        });

        it("deve converter Vec3 com valores decimais para array", () => {
            const vec = Vec3Factory.create(3.14, 2.71, 1.41);

            const result = Vec3Utils.toArray(vec);

            expect(result).toEqual([3.14, 2.71, 1.41]);
        });
    });

    describe("fromArray", () => {
        it("deve criar Vec3 a partir de array", () => {
            const arr: [number, number, number] = [10, 20, 30];

            const result = Vec3Utils.fromArray(arr);

            expect(result).toEqual({ x: 10, y: 20, z: 30 });
        });

        it("deve criar Vec3 a partir de array com valores negativos", () => {
            const arr: [number, number, number] = [-5, -15, -25];

            const result = Vec3Utils.fromArray(arr);

            expect(result).toEqual({ x: -5, y: -15, z: -25 });
        });

        it("deve criar Vec3 a partir de array com valores decimais", () => {
            const arr: [number, number, number] = [3.14, 2.71, 1.41];

            const result = Vec3Utils.fromArray(arr);

            expect(result).toEqual({ x: 3.14, y: 2.71, z: 1.41 });
        });
    });

    describe("fromObject", () => {
        it("deve criar Vec3 a partir de objeto", () => {
            const obj = { x: 10, y: 20, z: 30 };

            const result = Vec3Utils.fromObject(obj);

            expect(result).toEqual({ x: 10, y: 20, z: 30 });
        });

        it("deve criar Vec3 a partir de objeto com valores negativos", () => {
            const obj = { x: -5, y: -15, z: -25 };

            const result = Vec3Utils.fromObject(obj);

            expect(result).toEqual({ x: -5, y: -15, z: -25 });
        });

        it("deve criar Vec3 a partir de objeto com valores decimais", () => {
            const obj = { x: 3.14, y: 2.71, z: 1.41 };

            const result = Vec3Utils.fromObject(obj);

            expect(result).toEqual({ x: 3.14, y: 2.71, z: 1.41 });
        });
    });

    describe("isValid", () => {
        it("deve retornar true para Vec3 válido", () => {
            const vec = Vec3Factory.create(10, 20, 30);

            const result = Vec3Utils.isValid(vec);

            expect(result).toBe(true);
        });

        it("deve retornar false para null", () => {
            const result = Vec3Utils.isValid(null);

            expect(result).toBe(false);
        });

        it("deve retornar false para undefined", () => {
            const result = Vec3Utils.isValid(undefined);

            expect(result).toBe(false);
        });

        it("deve retornar false para objeto sem propriedades x, y, z", () => {
            const obj = { a: 1, b: 2, c: 3 };

            const result = Vec3Utils.isValid(obj);

            expect(result).toBe(false);
        });

        it("deve retornar false para objeto com propriedades x, y, z mas valores não numéricos", () => {
            const obj = { x: "10", y: "20", z: "30" };

            const result = Vec3Utils.isValid(obj);

            expect(result).toBe(false);
        });

        it("deve retornar false para objeto com apenas duas propriedades", () => {
            const obj = { x: 10, y: 20 };

            const result = Vec3Utils.isValid(obj);

            expect(result).toBe(false);
        });

        it("deve retornar true para objeto com propriedades x, y, z numéricas", () => {
            const obj = { x: 10, y: 20, z: 30 };

            const result = Vec3Utils.isValid(obj);

            expect(result).toBe(true);
        });
    });

    describe("round", () => {
        it("deve arredondar as coordenadas do Vec3", () => {
            const vec = Vec3Factory.create(3.7, 4.2, 5.8);

            const result = Vec3Utils.round(vec);

            expect(result).toEqual({ x: 4, y: 4, z: 6 });
        });

        it("deve arredondar valores negativos", () => {
            const vec = Vec3Factory.create(-3.7, -4.2, -5.8);

            const result = Vec3Utils.round(vec);

            expect(result).toEqual({ x: -4, y: -4, z: -6 });
        });

        it("deve manter valores inteiros inalterados", () => {
            const vec = Vec3Factory.create(3, 4, 5);

            const result = Vec3Utils.round(vec);

            expect(result).toEqual({ x: 3, y: 4, z: 5 });
        });
    });

    describe("floor", () => {
        it("deve aplicar Math.floor nas coordenadas", () => {
            const vec = Vec3Factory.create(3.7, 4.2, 5.8);

            const result = Vec3Utils.floor(vec);

            expect(result).toEqual({ x: 3, y: 4, z: 5 });
        });

        it("deve aplicar Math.floor em valores negativos", () => {
            const vec = Vec3Factory.create(-3.7, -4.2, -5.8);

            const result = Vec3Utils.floor(vec);

            expect(result).toEqual({ x: -4, y: -5, z: -6 });
        });

        it("deve manter valores inteiros inalterados", () => {
            const vec = Vec3Factory.create(3, 4, 5);

            const result = Vec3Utils.floor(vec);

            expect(result).toEqual({ x: 3, y: 4, z: 5 });
        });
    });

    describe("ceil", () => {
        it("deve aplicar Math.ceil nas coordenadas", () => {
            const vec = Vec3Factory.create(3.7, 4.2, 5.8);

            const result = Vec3Utils.ceil(vec);

            expect(result).toEqual({ x: 4, y: 5, z: 6 });
        });

        it("deve aplicar Math.ceil em valores negativos", () => {
            const vec = Vec3Factory.create(-3.7, -4.2, -5.8);

            const result = Vec3Utils.ceil(vec);

            expect(result).toEqual({ x: -3, y: -4, z: -5 });
        });

        it("deve manter valores inteiros inalterados", () => {
            const vec = Vec3Factory.create(3, 4, 5);

            const result = Vec3Utils.ceil(vec);

            expect(result).toEqual({ x: 3, y: 4, z: 5 });
        });
    });

    describe("imutabilidade", () => {
        it("deve não modificar o vetor original", () => {
            const vec = Vec3Factory.create(3.7, 4.2, 5.8);
            const originalVec = { ...vec };

            Vec3Utils.toString(vec);
            Vec3Utils.toArray(vec);
            Vec3Utils.round(vec);
            Vec3Utils.floor(vec);
            Vec3Utils.ceil(vec);

            expect(vec).toEqual(originalVec);
        });
    });
});
