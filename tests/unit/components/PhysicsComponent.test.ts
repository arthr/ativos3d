import { describe, it, expect } from "vitest";
import { PhysicsComponent } from "@domain/components";
import { Vec3Factory } from "@core/geometry";

describe("PhysicsComponent", () => {
    describe("Criação", () => {
        it("deve criar com valores padrão", () => {
            const component = new PhysicsComponent();

            expect(component.type).toBe("PhysicsComponent");
            expect(component.mass).toBe(1);
            expect(component.velocity).toEqual({ x: 0, y: 0, z: 0 });
            expect(component.acceleration).toEqual({ x: 0, y: 0, z: 0 });
            expect(component.useGravity).toBe(true);
        });

        it("deve criar com valores customizados", () => {
            const component = new PhysicsComponent({
                mass: 2,
                velocity: Vec3Factory.create(1, 0, 0),
                acceleration: Vec3Factory.create(0, 1, 0),
                useGravity: false,
            });

            expect(component.mass).toBe(2);
            expect(component.velocity).toEqual({ x: 1, y: 0, z: 0 });
            expect(component.acceleration).toEqual({ x: 0, y: 1, z: 0 });
            expect(component.useGravity).toBe(false);
        });
    });

    describe("Operações", () => {
        it("deve aplicar força e integrar", () => {
            const component = new PhysicsComponent({ mass: 2 });
            const force = Vec3Factory.create(2, 0, 0);
            const withForce = component.applyForce(force);
            expect(withForce.acceleration).toEqual({ x: 1, y: 0, z: 0 });

            const updated = withForce.integrate(1);
            expect(updated.velocity).toEqual({ x: 1, y: 0, z: 0 });
            expect(updated.acceleration).toEqual({ x: 0, y: 0, z: 0 });
        });

        it("deve definir massa e velocidade", () => {
            const component = new PhysicsComponent();
            const updated = component.setMass(5).setVelocity(Vec3Factory.create(1, 2, 3));
            expect(updated.mass).toBe(5);
            expect(updated.velocity).toEqual({ x: 1, y: 2, z: 3 });
        });
    });

    describe("Validação", () => {
        it("deve detectar massa inválida", () => {
            const component = new PhysicsComponent({ mass: 0 });
            expect(component.isValid()).toBe(false);
            expect(component.validate().errors).toContain("Massa deve ser positiva e finita");
        });

        it("deve ser válido com dados corretos", () => {
            const component = new PhysicsComponent({ mass: 1 });
            expect(component.isValid()).toBe(true);
        });
    });

    describe("Utilitários", () => {
        it("deve clonar e verificar igualdade", () => {
            const component = new PhysicsComponent({ mass: 2 });
            const clone = component.clone();
            expect(clone).not.toBe(component);
            expect(clone.equals(component)).toBe(true);
        });

        it("deve converter para string", () => {
            const component = new PhysicsComponent();
            const str = component.toString();
            expect(str).toContain("PhysicsComponent");
            expect(str).toContain("mass:1");
        });
    });
});
