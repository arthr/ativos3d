/**
 * Testes para CollisionFactory
 */
import { describe, it, expect } from "vitest";
import { Vec3Factory, AABBFactory, CollisionFactory } from "@core/geometry";

describe("CollisionFactory", () => {
    describe("createCollisionBody", () => {
        it("deve criar corpo de colisão com configuração básica", () => {
            const bounds = AABBFactory.create(
                Vec3Factory.create(-1, -1, -1),
                Vec3Factory.create(1, 1, 1),
            );

            const body = CollisionFactory.createCollisionBody({
                id: "test-body",
                bounds,
            });

            expect(body.id).toBe("test-body");
            expect(body.bounds).toEqual(bounds);
            expect(body.position).toEqual(Vec3Factory.zero());
            expect(body.isStatic).toBe(false);
            expect(body.layers).toBe(1);
        });

        it("deve criar corpo de colisão com configuração personalizada", () => {
            const bounds = AABBFactory.create(
                Vec3Factory.create(-2, -2, -2),
                Vec3Factory.create(2, 2, 2),
            );
            const position = Vec3Factory.create(5, 5, 5);

            const body = CollisionFactory.createCollisionBody({
                id: "custom-body",
                bounds,
                position,
                isStatic: true,
                layers: 4,
            });

            expect(body.id).toBe("custom-body");
            expect(body.bounds).toEqual(bounds);
            expect(body.position).toEqual(position);
            expect(body.isStatic).toBe(true);
            expect(body.layers).toBe(4);
        });
    });

    describe("createCollisionBodyFromBox", () => {
        it("deve criar corpo de colisão a partir de parâmetros de caixa", () => {
            const position = Vec3Factory.create(10, 20, 30);
            const size = Vec3Factory.create(4, 6, 8);

            const body = CollisionFactory.createCollisionBodyFromBox({
                id: "box-body",
                position,
                size,
            });

            expect(body.id).toBe("box-body");
            expect(body.position).toEqual(position);
            expect(body.isStatic).toBe(false);
            expect(body.layers).toBe(1);

            // Verifica se os bounds estão corretos
            const expectedBounds = AABBFactory.fromCenterSize(Vec3Factory.zero(), size);
            expect(body.bounds).toEqual(expectedBounds);
        });

        it("deve criar corpo de colisão estático a partir de caixa", () => {
            const body = CollisionFactory.createCollisionBodyFromBox({
                id: "static-box",
                position: Vec3Factory.zero(),
                size: Vec3Factory.create(2, 2, 2),
                isStatic: true,
                layers: 8,
            });

            expect(body.isStatic).toBe(true);
            expect(body.layers).toBe(8);
        });
    });

    describe("createCollisionConfig", () => {
        it("deve criar configuração de colisão padrão", () => {
            const config = CollisionFactory.createCollisionConfig();

            expect(config.tolerance).toBe(0.001);
            expect(config.calculateContact).toBe(false);
            expect(config.calculateSeparation).toBe(false);
            expect(config.layerMask).toBeUndefined();
        });

        it("deve criar configuração de colisão personalizada", () => {
            const config = CollisionFactory.createCollisionConfig({
                tolerance: 0.01,
                calculateContact: true,
                calculateSeparation: true,
                layerMask: 15,
            });

            expect(config.tolerance).toBe(0.01);
            expect(config.calculateContact).toBe(true);
            expect(config.calculateSeparation).toBe(true);
            expect(config.layerMask).toBe(15);
        });
    });

    describe("createRaycastQuery", () => {
        it("deve criar consulta de raycast com valores padrão", () => {
            const origin = Vec3Factory.create(1, 2, 3);
            const direction = Vec3Factory.create(0, 1, 0);

            const query = CollisionFactory.createRaycastQuery({
                origin,
                direction,
            });

            expect(query.origin).toEqual(origin);
            expect(query.direction).toEqual(direction);
            expect(query.maxDistance).toBe(1000);
            expect(query.layerMask).toBeUndefined();
        });

        it("deve criar consulta de raycast com valores personalizados", () => {
            const origin = Vec3Factory.create(1, 2, 3);
            const direction = Vec3Factory.create(1, 0, 0);

            const query = CollisionFactory.createRaycastQuery({
                origin,
                direction,
                maxDistance: 50,
                layerMask: 7,
            });

            expect(query.origin).toEqual(origin);
            expect(query.direction).toEqual(direction);
            expect(query.maxDistance).toBe(50);
            expect(query.layerMask).toBe(7);
        });
    });

    describe("createSphereCollisionData", () => {
        it("deve criar dados de colisão de esfera", () => {
            const center = Vec3Factory.create(5, 10, 15);
            const radius = 3.5;

            const sphere = CollisionFactory.createSphereCollisionData(center, radius);

            expect(sphere.center).toEqual(center);
            expect(sphere.radius).toBe(radius);
        });

        it("deve lançar erro para raio negativo", () => {
            const center = Vec3Factory.zero();

            expect(() => {
                CollisionFactory.createSphereCollisionData(center, -1);
            }).toThrow("Raio da esfera deve ser positivo");
        });

        it("deve lançar erro para raio zero", () => {
            const center = Vec3Factory.zero();

            expect(() => {
                CollisionFactory.createSphereCollisionData(center, 0);
            }).toThrow("Raio da esfera deve ser positivo");
        });
    });

    describe("createCapsuleCollisionData", () => {
        it("deve criar dados de colisão de cápsula", () => {
            const start = Vec3Factory.create(0, 0, 0);
            const end = Vec3Factory.create(0, 10, 0);
            const radius = 2;

            const capsule = CollisionFactory.createCapsuleCollisionData(start, end, radius);

            expect(capsule.start).toEqual(start);
            expect(capsule.end).toEqual(end);
            expect(capsule.radius).toBe(radius);
        });

        it("deve lançar erro para raio inválido", () => {
            const start = Vec3Factory.zero();
            const end = Vec3Factory.create(0, 5, 0);

            expect(() => {
                CollisionFactory.createCapsuleCollisionData(start, end, -1);
            }).toThrow("Raio da cápsula deve ser positivo");
        });
    });

    describe("createPlaneCollisionData", () => {
        it("deve criar dados de colisão de plano", () => {
            const normal = Vec3Factory.create(0, 1, 0);
            const distance = 5;

            const plane = CollisionFactory.createPlaneCollisionData(normal, distance);

            expect(plane.normal).toEqual(normal);
            expect(plane.distance).toBe(distance);
        });
    });

    describe("createCenteredAABB", () => {
        it("deve criar AABB centralizado na origem", () => {
            const size = Vec3Factory.create(4, 6, 8);

            const aabb = AABBFactory.fromCenterSize(Vec3Factory.zero(), size);

            expect(aabb.min).toEqual(Vec3Factory.create(-2, -3, -4));
            expect(aabb.max).toEqual(Vec3Factory.create(2, 3, 4));
        });

        it("deve lidar com cubo unitário", () => {
            const size = Vec3Factory.create(1, 1, 1);

            const aabb = AABBFactory.fromCenterSize(Vec3Factory.zero(), size);

            expect(aabb.min).toEqual(Vec3Factory.create(-0.5, -0.5, -0.5));
            expect(aabb.max).toEqual(Vec3Factory.create(0.5, 0.5, 0.5));
        });
    });

    describe("createGridOfBodies", () => {
        it("deve criar grade 2x2x1 de corpos", () => {
            const bodies = CollisionFactory.createGridOfBodies({
                baseId: "grid",
                gridSize: { x: 2, y: 2, z: 1 },
                spacing: Vec3Factory.create(3, 3, 3),
                bodySize: Vec3Factory.create(1, 1, 1),
            });

            expect(bodies).toHaveLength(4);

            expect(bodies[0]!.id).toBe("grid_0_0_0");
            expect(bodies[0]!.position).toEqual(Vec3Factory.create(0, 0, 0));

            expect(bodies[1]!.id).toBe("grid_0_1_0");
            expect(bodies[1]!.position).toEqual(Vec3Factory.create(0, 3, 0));

            expect(bodies[2]!.id).toBe("grid_1_0_0");
            expect(bodies[2]!.position).toEqual(Vec3Factory.create(3, 0, 0));

            expect(bodies[3]!.id).toBe("grid_1_1_0");
            expect(bodies[3]!.position).toEqual(Vec3Factory.create(3, 3, 0));
        });

        it("deve criar grade com posição inicial personalizada", () => {
            const startPosition = Vec3Factory.create(10, 20, 30);

            const bodies = CollisionFactory.createGridOfBodies({
                baseId: "offset-grid",
                gridSize: { x: 1, y: 1, z: 2 },
                spacing: Vec3Factory.create(2, 2, 2),
                bodySize: Vec3Factory.create(1, 1, 1),
                startPosition,
            });

            expect(bodies).toHaveLength(2);
            expect(bodies[0]!.position).toEqual(Vec3Factory.create(10, 20, 30));
            expect(bodies[1]!.position).toEqual(Vec3Factory.create(10, 20, 32));
        });

        it("deve criar corpos de grade estáticos", () => {
            const bodies = CollisionFactory.createGridOfBodies({
                baseId: "static-grid",
                gridSize: { x: 1, y: 1, z: 1 },
                spacing: Vec3Factory.create(1, 1, 1),
                bodySize: Vec3Factory.create(1, 1, 1),
                isStatic: true,
                layers: 16,
            });

            expect(bodies[0]!.isStatic).toBe(true);
            expect(bodies[0]!.layers).toBe(16);
        });
    });

    describe("createFastCollisionConfig", () => {
        it("deve criar configuração otimizada para detecção rápida", () => {
            const config = CollisionFactory.createFastCollisionConfig();

            expect(config.tolerance).toBe(0.01);
            expect(config.calculateContact).toBe(false);
            expect(config.calculateSeparation).toBe(false);
        });
    });

    describe("createDetailedCollisionConfig", () => {
        it("deve criar configuração detalhada para resolução de colisão", () => {
            const config = CollisionFactory.createDetailedCollisionConfig();

            expect(config.tolerance).toBe(0.001);
            expect(config.calculateContact).toBe(true);
            expect(config.calculateSeparation).toBe(true);
        });
    });
});
