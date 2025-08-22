/**
 * Testes para o sistema de detecção de colisão
 */
import { describe, it, expect } from "vitest";
import { CollisionDetection } from "../../../src/core/geometry/operations/CollisionDetection";
import {
    Vec3Factory,
    AABBFactory,
    CollisionFactory,
    type AABB,
    type RaycastQuery,
    type SphereCollisionData,
} from "@core/geometry";

describe("CollisionDetection", () => {
    describe("checkAABBCollision", () => {
        it("deve detectar colisão entre AABBs que se intersectam", () => {
            const boxA: AABB = AABBFactory.create(
                Vec3Factory.create(0, 0, 0),
                Vec3Factory.create(2, 2, 2),
            );
            const boxB: AABB = AABBFactory.create(
                Vec3Factory.create(1, 1, 1),
                Vec3Factory.create(3, 3, 3),
            );

            const result = CollisionDetection.checkAABBCollision(boxA, boxB);

            expect(result.hasCollision).toBe(true);
        });

        it("não deve detectar colisão entre AABBs que não se intersectam", () => {
            const boxA: AABB = AABBFactory.create(
                Vec3Factory.create(0, 0, 0),
                Vec3Factory.create(1, 1, 1),
            );
            const boxB: AABB = AABBFactory.create(
                Vec3Factory.create(2, 2, 2),
                Vec3Factory.create(3, 3, 3),
            );

            const result = CollisionDetection.checkAABBCollision(boxA, boxB);

            expect(result.hasCollision).toBe(false);
        });

        it("deve calcular vetor de separação quando solicitado", () => {
            const boxA: AABB = AABBFactory.create(
                Vec3Factory.create(0, 0, 0),
                Vec3Factory.create(2, 2, 2),
            );
            const boxB: AABB = AABBFactory.create(
                Vec3Factory.create(1, 0, 0),
                Vec3Factory.create(3, 2, 2),
            );

            const result = CollisionDetection.checkAABBCollision(boxA, boxB, {
                calculateSeparation: true,
            });

            expect(result.hasCollision).toBe(true);
            expect(result.separationVector).toBeDefined();
            expect(result.penetrationDepth).toBeDefined();
            expect(result.penetrationDepth).toBeGreaterThan(0);
        });

        it("deve calcular ponto de contato quando solicitado", () => {
            const boxA: AABB = AABBFactory.create(
                Vec3Factory.create(0, 0, 0),
                Vec3Factory.create(2, 2, 2),
            );
            const boxB: AABB = AABBFactory.create(
                Vec3Factory.create(1, 1, 1),
                Vec3Factory.create(3, 3, 3),
            );

            const result = CollisionDetection.checkAABBCollision(boxA, boxB, {
                calculateContact: true,
            });

            expect(result.hasCollision).toBe(true);
            expect(result.contactPoint).toBeDefined();
            expect(result.contactPoint?.x).toBe(1.5);
            expect(result.contactPoint?.y).toBe(1.5);
            expect(result.contactPoint?.z).toBe(1.5);
        });

        it("deve lidar com caso de borda de AABBs perfeitamente encostados", () => {
            const boxA: AABB = AABBFactory.create(
                Vec3Factory.create(0, 0, 0),
                Vec3Factory.create(1, 1, 1),
            );
            const boxB: AABB = AABBFactory.create(
                Vec3Factory.create(1, 0, 0),
                Vec3Factory.create(2, 1, 1),
            );

            const result = CollisionDetection.checkAABBCollision(boxA, boxB);

            expect(result.hasCollision).toBe(true);
        });
    });

    describe("checkBodyCollision", () => {
        it("deve detectar colisão entre dois corpos de colisão", () => {
            const bodyA = CollisionFactory.createCollisionBodyFromBox({
                id: "bodyA",
                position: Vec3Factory.create(0, 0, 0),
                size: Vec3Factory.create(2, 2, 2),
            });

            const bodyB = CollisionFactory.createCollisionBodyFromBox({
                id: "bodyB",
                position: Vec3Factory.create(1, 1, 1),
                size: Vec3Factory.create(2, 2, 2),
            });

            const result = CollisionDetection.checkBodyCollision(bodyA, bodyB);

            expect(result.hasCollision).toBe(true);
        });

        it("não deve detectar colisão quando os corpos estão separados", () => {
            const bodyA = CollisionFactory.createCollisionBodyFromBox({
                id: "bodyA",
                position: Vec3Factory.create(0, 0, 0),
                size: Vec3Factory.create(1, 1, 1),
            });

            const bodyB = CollisionFactory.createCollisionBodyFromBox({
                id: "bodyB",
                position: Vec3Factory.create(5, 5, 5),
                size: Vec3Factory.create(1, 1, 1),
            });

            const result = CollisionDetection.checkBodyCollision(bodyA, bodyB);

            expect(result.hasCollision).toBe(false);
        });

        it("deve respeitar máscaras de camada", () => {
            const bodyA = CollisionFactory.createCollisionBodyFromBox({
                id: "bodyA",
                position: Vec3Factory.create(0, 0, 0),
                size: Vec3Factory.create(2, 2, 2),
                layers: 1, // Camada 1
            });

            const bodyB = CollisionFactory.createCollisionBodyFromBox({
                id: "bodyB",
                position: Vec3Factory.create(1, 1, 1),
                size: Vec3Factory.create(2, 2, 2),
                layers: 2, // Camada 2
            });

            // Teste com máscara que inclui apenas camada 1
            const resultLayer1 = CollisionDetection.checkBodyCollision(bodyA, bodyB, {
                layerMask: 1,
            });

            expect(resultLayer1.hasCollision).toBe(false);

            // Teste com máscara que inclui ambas as camadas
            const resultBothLayers = CollisionDetection.checkBodyCollision(bodyA, bodyB, {
                layerMask: 3, // 1 | 2
            });

            expect(resultBothLayers.hasCollision).toBe(true);
        });
    });

    describe("pointInAABB", () => {
        it("deve detectar ponto dentro de AABB", () => {
            const box: AABB = AABBFactory.create(
                Vec3Factory.create(0, 0, 0),
                Vec3Factory.create(2, 2, 2),
            );
            const point = Vec3Factory.create(1, 1, 1);

            const result = CollisionDetection.pointInAABB(point, box);

            expect(result).toBe(true);
        });

        it("deve detectar ponto fora de AABB", () => {
            const box: AABB = AABBFactory.create(
                Vec3Factory.create(0, 0, 0),
                Vec3Factory.create(2, 2, 2),
            );
            const point = Vec3Factory.create(3, 3, 3);

            const result = CollisionDetection.pointInAABB(point, box);

            expect(result).toBe(false);
        });

        it("deve detectar ponto na borda de AABB", () => {
            const box: AABB = AABBFactory.create(
                Vec3Factory.create(0, 0, 0),
                Vec3Factory.create(2, 2, 2),
            );
            const point = Vec3Factory.create(2, 1, 1);

            const result = CollisionDetection.pointInAABB(point, box);

            expect(result).toBe(true);
        });
    });

    describe("checkSphereAABBCollision", () => {
        it("deve detectar colisão entre esfera e AABB", () => {
            const sphere: SphereCollisionData = CollisionFactory.createSphereCollisionData(
                Vec3Factory.create(0, 0, 0),
                2.0, // Radius large enough to reach the AABB
            );
            const box: AABB = AABBFactory.create(
                Vec3Factory.create(1, 1, 1),
                Vec3Factory.create(2, 2, 2),
            );

            const result = CollisionDetection.checkSphereAABBCollision(sphere, box);

            expect(result.hasCollision).toBe(true);
        });

        it("não deve detectar colisão quando esfera e AABB estão separados", () => {
            const sphere: SphereCollisionData = CollisionFactory.createSphereCollisionData(
                Vec3Factory.create(0, 0, 0),
                0.5,
            );
            const box: AABB = AABBFactory.create(
                Vec3Factory.create(2, 2, 2),
                Vec3Factory.create(3, 3, 3),
            );

            const result = CollisionDetection.checkSphereAABBCollision(sphere, box);

            expect(result.hasCollision).toBe(false);
        });

        it("deve calcular vetor de separação para colisão entre esfera e AABB", () => {
            const sphere: SphereCollisionData = CollisionFactory.createSphereCollisionData(
                Vec3Factory.create(0, 0, 0),
                1.5,
            );
            const box: AABB = AABBFactory.create(
                Vec3Factory.create(1, -0.5, -0.5),
                Vec3Factory.create(2, 0.5, 0.5),
            );

            const result = CollisionDetection.checkSphereAABBCollision(sphere, box, {
                calculateSeparation: true,
            });

            expect(result.hasCollision).toBe(true);
            expect(result.separationVector).toBeDefined();
            expect(result.penetrationDepth).toBeGreaterThan(0);
        });

        it("deve calcular ponto de contato para colisão entre esfera e AABB", () => {
            const sphere: SphereCollisionData = CollisionFactory.createSphereCollisionData(
                Vec3Factory.create(0, 0, 0),
                1.5,
            );
            const box: AABB = AABBFactory.create(
                Vec3Factory.create(1, -0.5, -0.5),
                Vec3Factory.create(2, 0.5, 0.5),
            );

            const result = CollisionDetection.checkSphereAABBCollision(sphere, box, {
                calculateContact: true,
            });

            expect(result.hasCollision).toBe(true);
            expect(result.contactPoint).toBeDefined();
            expect(result.contactPoint?.x).toBe(1);
            expect(result.contactPoint?.y).toBe(0);
            expect(result.contactPoint?.z).toBe(0);
        });
    });

    describe("raycastAABB", () => {
        it("deve detectar raio atingindo AABB", () => {
            const query: RaycastQuery = CollisionFactory.createRaycastQuery({
                origin: Vec3Factory.create(-5, 0, 0),
                direction: Vec3Factory.create(1, 0, 0), // Direção normalizada para direita
                maxDistance: 10,
            });

            const box: AABB = AABBFactory.create(
                Vec3Factory.create(-1, -1, -1),
                Vec3Factory.create(1, 1, 1),
            );

            const result = CollisionDetection.raycastAABB(query, box);

            expect(result.hit).toBe(true);
            expect(result.distance).toBe(4); // Distância de -5 até -1
            expect(result.point).toBeDefined();
            expect(result.normal).toBeDefined();
        });

        it("não deve detectar raio faltando AABB", () => {
            const query: RaycastQuery = CollisionFactory.createRaycastQuery({
                origin: Vec3Factory.create(0, 5, 0),
                direction: Vec3Factory.create(0, 1, 0), // Direção para cima
                maxDistance: 10,
            });

            const box: AABB = AABBFactory.create(
                Vec3Factory.create(-1, -1, -1),
                Vec3Factory.create(1, 1, 1),
            );

            const result = CollisionDetection.raycastAABB(query, box);

            expect(result.hit).toBe(false);
        });

        it("deve respeitar distância máxima", () => {
            const query: RaycastQuery = CollisionFactory.createRaycastQuery({
                origin: Vec3Factory.create(-10, 0, 0),
                direction: Vec3Factory.create(1, 0, 0),
                maxDistance: 5, // Distância insuficiente
            });

            const box: AABB = AABBFactory.create(
                Vec3Factory.create(1, -1, -1),
                Vec3Factory.create(2, 1, 1),
            );

            const result = CollisionDetection.raycastAABB(query, box);

            expect(result.hit).toBe(false);
        });

        it("deve lidar com raio iniciando dentro de AABB", () => {
            const query: RaycastQuery = CollisionFactory.createRaycastQuery({
                origin: Vec3Factory.create(0, 0, 0), // Dentro da caixa
                direction: Vec3Factory.create(1, 0, 0),
                maxDistance: 10,
            });

            const box: AABB = AABBFactory.create(
                Vec3Factory.create(-1, -1, -1),
                Vec3Factory.create(1, 1, 1),
            );

            const result = CollisionDetection.raycastAABB(query, box);

            expect(result.hit).toBe(true);
            expect(result.distance).toBe(1); // Distância até a saída
        });

        it("deve calcular a normal correta para a interseção do raio", () => {
            const query: RaycastQuery = CollisionFactory.createRaycastQuery({
                origin: Vec3Factory.create(-5, 0, 0),
                direction: Vec3Factory.create(1, 0, 0),
                maxDistance: 10,
            });

            const box: AABB = AABBFactory.create(
                Vec3Factory.create(-1, -1, -1),
                Vec3Factory.create(1, 1, 1),
            );

            const result = CollisionDetection.raycastAABB(query, box);

            expect(result.hit).toBe(true);
            expect(result.normal).toBeDefined();
            expect(result.normal?.x).toBe(-1); // Normal apontando para esquerda
            expect(result.normal?.y).toBe(0);
            expect(result.normal?.z).toBe(0);
        });
    });

    describe("edge cases", () => {
        it("deve lidar com AABB de tamanho zero", () => {
            const boxA: AABB = AABBFactory.create(
                Vec3Factory.create(0, 0, 0),
                Vec3Factory.create(0, 0, 0),
            );
            const boxB: AABB = AABBFactory.create(
                Vec3Factory.create(0, 0, 0),
                Vec3Factory.create(1, 1, 1),
            );

            const result = CollisionDetection.checkAABBCollision(boxA, boxB);

            expect(result.hasCollision).toBe(true);
        });

        it("deve lidar com esfera com raio zero", () => {
            const sphere: SphereCollisionData = {
                center: Vec3Factory.create(0, 0, 0),
                radius: 0,
            };
            const box: AABB = AABBFactory.create(
                Vec3Factory.create(-1, -1, -1),
                Vec3Factory.create(1, 1, 1),
            );

            const result = CollisionDetection.checkSphereAABBCollision(sphere, box);

            expect(result.hasCollision).toBe(true);
        });

        it("deve lidar com raio com componente de direção zero", () => {
            const query: RaycastQuery = CollisionFactory.createRaycastQuery({
                origin: Vec3Factory.create(0, -5, 0),
                direction: Vec3Factory.create(0, 1, 0),
                maxDistance: 10,
            });

            const box: AABB = AABBFactory.create(
                Vec3Factory.create(-1, -1, -1),
                Vec3Factory.create(1, 1, 1),
            );

            const result = CollisionDetection.raycastAABB(query, box);

            expect(result.hit).toBe(true);
        });
    });
});
