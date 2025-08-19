import { describe, it, expect, beforeEach } from "vitest";
import { TransformComponent } from "@domain/components/TransformComponent";
import { Vec3Factory } from "@core/geometry";
import type { Vec3 } from "@core/geometry";

describe("TransformComponent", () => {
    let defaultTransform: TransformComponent;
    let customTransform: TransformComponent;

    beforeEach(() => {
        defaultTransform = new TransformComponent();
        customTransform = new TransformComponent({
            position: Vec3Factory.create(1, 2, 3),
            rotation: Vec3Factory.create(0.5, 1.0, 1.5),
            scale: Vec3Factory.create(2, 2, 2),
        });
    });

    describe("Criação", () => {
        it("deve criar com valores padrão", () => {
            expect(defaultTransform.type).toBe("TransformComponent");
            expect(defaultTransform.position).toEqual({ x: 0, y: 0, z: 0 });
            expect(defaultTransform.rotation).toEqual({ x: 0, y: 0, z: 0 });
            expect(defaultTransform.scale).toEqual({ x: 1, y: 1, z: 1 });
        });

        it("deve criar com valores customizados", () => {
            expect(customTransform.position).toEqual({ x: 1, y: 2, z: 3 });
            expect(customTransform.rotation).toEqual({ x: 0.5, y: 1.0, z: 1.5 });
            expect(customTransform.scale).toEqual({ x: 2, y: 2, z: 2 });
        });

        it("deve criar com valores parciais", () => {
            const partialTransform = new TransformComponent({
                position: Vec3Factory.create(5, 5, 5),
            });

            expect(partialTransform.position).toEqual({ x: 5, y: 5, z: 5 });
            expect(partialTransform.rotation).toEqual({ x: 0, y: 0, z: 0 });
            expect(partialTransform.scale).toEqual({ x: 1, y: 1, z: 1 });
        });

        it("deve usar factory method create", () => {
            const transform = TransformComponent.create({
                position: Vec3Factory.create(10, 20, 30),
            });

            expect(transform.position).toEqual({ x: 10, y: 20, z: 30 });
            expect(transform.type).toBe("TransformComponent");
        });

        it("deve usar factory methods específicos", () => {
            const pos = Vec3Factory.create(1, 2, 3);
            const rot = Vec3Factory.create(0.5, 1.0, 1.5);
            const scale = Vec3Factory.create(2, 2, 2);

            const atPos = TransformComponent.atPosition(pos);
            const withRot = TransformComponent.withRotation(rot);
            const withScale = TransformComponent.withScale(scale);

            expect(atPos.position).toEqual(pos);
            expect(withRot.rotation).toEqual(rot);
            expect(withScale.scale).toEqual(scale);
        });
    });

    describe("Operações de Posição", () => {
        it("deve traduzir a posição", () => {
            const delta = Vec3Factory.create(1, 2, 3);
            const translated = defaultTransform.translate(delta);

            expect(translated.position).toEqual({ x: 1, y: 2, z: 3 });
            expect(translated.rotation).toEqual(defaultTransform.rotation);
            expect(translated.scale).toEqual(defaultTransform.scale);
        });

        it("deve definir posição absoluta", () => {
            const newPosition = Vec3Factory.create(10, 20, 30);
            const positioned = defaultTransform.setPosition(newPosition);

            expect(positioned.position).toEqual(newPosition);
            expect(positioned.rotation).toEqual(defaultTransform.rotation);
            expect(positioned.scale).toEqual(defaultTransform.scale);
        });

        it("deve manter imutabilidade ao traduzir", () => {
            const originalPosition = defaultTransform.position;
            const delta = Vec3Factory.create(1, 1, 1);
            const translated = defaultTransform.translate(delta);

            expect(translated.position).not.toEqual(originalPosition);
            expect(defaultTransform.position).toEqual(originalPosition);
        });
    });

    describe("Operações de Rotação", () => {
        it("deve rotacionar", () => {
            const delta = Vec3Factory.create(0.5, 1.0, 1.5);
            const rotated = defaultTransform.rotate(delta);

            expect(rotated.rotation).toEqual({ x: 0.5, y: 1.0, z: 1.5 });
            expect(rotated.position).toEqual(defaultTransform.position);
            expect(rotated.scale).toEqual(defaultTransform.scale);
        });

        it("deve definir rotação absoluta", () => {
            const newRotation = Vec3Factory.create(1.5, 2.0, 2.5);
            const rotated = defaultTransform.setRotation(newRotation);

            expect(rotated.rotation).toEqual(newRotation);
            expect(rotated.position).toEqual(defaultTransform.position);
            expect(rotated.scale).toEqual(defaultTransform.scale);
        });

        it("deve manter imutabilidade ao rotacionar", () => {
            const originalRotation = defaultTransform.rotation;
            const delta = Vec3Factory.create(0.5, 0.5, 0.5);
            const rotated = defaultTransform.rotate(delta);

            expect(rotated.rotation).not.toEqual(originalRotation);
            expect(defaultTransform.rotation).toEqual(originalRotation);
        });
    });

    describe("Operações de Escala", () => {
        it("deve escalar", () => {
            const factor = 2;
            const scaled = defaultTransform.scaleBy(factor);

            expect(scaled.scale).toEqual({ x: 2, y: 2, z: 2 });
            expect(scaled.position).toEqual(defaultTransform.position);
            expect(scaled.rotation).toEqual(defaultTransform.rotation);
        });

        it("deve definir escala absoluta", () => {
            const newScale = Vec3Factory.create(5, 5, 5);
            const scaled = defaultTransform.setScale(newScale);

            expect(scaled.scale).toEqual(newScale);
            expect(scaled.position).toEqual(defaultTransform.position);
            expect(scaled.rotation).toEqual(defaultTransform.rotation);
        });

        it("deve manter imutabilidade ao escalar", () => {
            const originalScale = defaultTransform.scale;
            const factor = 2;
            const scaled = defaultTransform.scaleBy(factor);

            expect(scaled.scale).not.toEqual(originalScale);
            expect(defaultTransform.scale).toEqual(originalScale);
        });
    });

    describe("Operações de Transformação Completa", () => {
        it("deve aplicar transformação completa", () => {
            const transform = {
                position: Vec3Factory.create(10, 20, 30),
                rotation: Vec3Factory.create(1.0, 2.0, 3.0),
                scale: Vec3Factory.create(5, 5, 5),
            };

            const applied = defaultTransform.setTransform(transform);

            expect(applied.position).toEqual(transform.position);
            expect(applied.rotation).toEqual(transform.rotation);
            expect(applied.scale).toEqual(transform.scale);
        });

        it("deve aplicar transformação parcial", () => {
            const transform = {
                position: Vec3Factory.create(10, 20, 30),
                // rotation e scale não especificados
            };

            const applied = defaultTransform.setTransform(transform);

            expect(applied.position).toEqual(transform.position);
            expect(applied.rotation).toEqual(defaultTransform.rotation);
            expect(applied.scale).toEqual(defaultTransform.scale);
        });

        it("deve retornar transformação como objeto", () => {
            const transform = customTransform.getTransform();

            expect(transform).toEqual({
                position: customTransform.position,
                rotation: customTransform.rotation,
                scale: customTransform.scale,
            });
        });
    });

    describe("Validação", () => {
        it("deve validar transformação válida", () => {
            expect(defaultTransform.isValid()).toBe(true);
            expect(customTransform.isValid()).toBe(true);
        });

        it("deve detectar posição inválida", () => {
            const invalidTransform = new TransformComponent({
                position: { x: NaN, y: 0, z: 0 } as Vec3,
            });

            expect(invalidTransform.isValid()).toBe(false);
        });

        it("deve detectar rotação inválida", () => {
            const invalidTransform = new TransformComponent({
                rotation: { x: 0, y: Infinity, z: 0 } as Vec3,
            });

            expect(invalidTransform.isValid()).toBe(false);
        });

        it("deve detectar escala inválida", () => {
            const invalidTransform = new TransformComponent({
                scale: { x: 0, y: 1, z: 1 } as Vec3,
            });

            expect(invalidTransform.isValid()).toBe(false);
        });

        it("deve retornar detalhes de validação", () => {
            const invalidTransform = new TransformComponent({
                scale: { x: 0, y: 1, z: 1 } as Vec3,
            });

            const validation = invalidTransform.validate();
            expect(validation.isValid).toBe(false);
            expect(validation.errors).toContain("Escala não pode ser zero");
        });

        it("deve gerar warnings para escala muito pequena", () => {
            const smallScaleTransform = new TransformComponent({
                scale: Vec3Factory.create(0.0001, 1, 1),
            });

            const validation = smallScaleTransform.validate();
            expect(validation.isValid).toBe(true);
            expect(validation.warnings).toContain(
                "Escala muito pequena pode causar problemas de renderização",
            );
        });

        it("deve gerar warnings para escala muito grande", () => {
            const largeScaleTransform = new TransformComponent({
                scale: Vec3Factory.create(2000, 1, 1),
            });

            const validation = largeScaleTransform.validate();
            expect(validation.isValid).toBe(true);
            expect(validation.warnings).toContain(
                "Escala muito grande pode causar problemas de performance",
            );
        });
    });

    describe("Utilitários", () => {
        it("deve clonar corretamente", () => {
            const clone = customTransform.clone();

            expect(clone).not.toBe(customTransform);
            expect(clone.position).toEqual(customTransform.position);
            expect(clone.rotation).toEqual(customTransform.rotation);
            expect(clone.scale).toEqual(customTransform.scale);
            expect(clone.type).toBe(customTransform.type);
        });

        it("deve verificar igualdade", () => {
            const sameTransform = new TransformComponent({
                position: Vec3Factory.create(1, 2, 3),
                rotation: Vec3Factory.create(0.5, 1.0, 1.5),
                scale: Vec3Factory.create(2, 2, 2),
            });

            expect(customTransform.equals(sameTransform)).toBe(true);
            expect(customTransform.equals(defaultTransform)).toBe(false);
        });

        it("deve converter para string", () => {
            const str = customTransform.toString();
            expect(str).toContain("TransformComponent");
            expect(str).toContain("pos:(1,2,3)");
            expect(str).toContain("rot:(0.5,1,1.5)");
            expect(str).toContain("scale:(2,2,2)");
        });
    });

    describe("Casos de Borda", () => {
        it("deve lidar com valores muito pequenos", () => {
            const tinyTransform = new TransformComponent({
                position: Vec3Factory.create(0.000001, 0.000001, 0.000001),
                rotation: Vec3Factory.create(0.000001, 0.000001, 0.000001),
                scale: Vec3Factory.create(0.001, 0.001, 0.001),
            });

            expect(tinyTransform.isValid()).toBe(true);
        });

        it("deve lidar com valores muito grandes", () => {
            const hugeTransform = new TransformComponent({
                position: Vec3Factory.create(1000000, 1000000, 1000000),
                rotation: Vec3Factory.create(1000, 1000, 1000),
                scale: Vec3Factory.create(1000, 1000, 1000),
            });

            expect(hugeTransform.isValid()).toBe(true);
        });

        it("deve lidar com valores zero", () => {
            const zeroTransform = new TransformComponent({
                position: Vec3Factory.create(0, 0, 0),
                rotation: Vec3Factory.create(0, 0, 0),
                scale: Vec3Factory.create(0, 0, 0),
            });

            expect(zeroTransform.isValid()).toBe(false);
            expect(zeroTransform.validate().errors).toContain("Escala não pode ser zero");
        });

        it("deve lidar com valores negativos", () => {
            const negativeTransform = new TransformComponent({
                position: Vec3Factory.create(-1, -2, -3),
                rotation: Vec3Factory.create(-0.5, -1.0, -1.5),
                scale: Vec3Factory.create(-2, -2, -2),
            });

            expect(negativeTransform.isValid()).toBe(false);
            expect(negativeTransform.validate().errors).toContain("Escala não pode ser negativa.");
        });
    });
});
