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
        it("deve detectar colisão entre AABBs sobrepostos", () => {
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

        it("não deve detectar colisão entre AABBs separados", () => {
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

        it("deve detectar colisão entre AABBs tangentes", () => {
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
        it("deve detectar colisão entre corpos sobrepostos", () => {
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

        it("não deve detectar colisão entre corpos separados", () => {
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

        it("deve respeitar máscaras de camadas de colisão", () => {
            const bodyA = CollisionFactory.createCollisionBodyFromBox({
                id: "bodyA",
                position: Vec3Factory.create(0, 0, 0),
                size: Vec3Factory.create(2, 2, 2),
                layers: 1, // Camada de colisão 1
            });

            const bodyB = CollisionFactory.createCollisionBodyFromBox({
                id: "bodyB",
                position: Vec3Factory.create(1, 1, 1),
                size: Vec3Factory.create(2, 2, 2),
                layers: 2, // Camada de colisão 2
            });

            // Teste com máscara que inclui apenas a camada 1
            const resultLayer1 = CollisionDetection.checkBodyCollision(bodyA, bodyB, {
                layerMask: 1,
            });

            expect(resultLayer1.hasCollision).toBe(false);

            // Teste com máscara que inclui ambas as camadas
            const resultBothLayers = CollisionDetection.checkBodyCollision(bodyA, bodyB, {
                layerMask: 3, // Combinação das camadas 1 e 2
            });

            expect(resultBothLayers.hasCollision).toBe(true);
        });
    });

    describe("pointInAABB", () => {
        it("deve detectar ponto contido em AABB", () => {
            const box: AABB = AABBFactory.create(
                Vec3Factory.create(0, 0, 0),
                Vec3Factory.create(2, 2, 2),
            );
            const point = Vec3Factory.create(1, 1, 1);

            const result = CollisionDetection.pointInAABB(point, box);

            expect(result).toBe(true);
        });

        it("deve detectar ponto externo ao AABB", () => {
            const box: AABB = AABBFactory.create(
                Vec3Factory.create(0, 0, 0),
                Vec3Factory.create(2, 2, 2),
            );
            const point = Vec3Factory.create(3, 3, 3);

            const result = CollisionDetection.pointInAABB(point, box);

            expect(result).toBe(false);
        });

        it("deve detectar ponto na fronteira do AABB", () => {
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
        it("deve detectar colisão entre esfera e AABB sobrepostos", () => {
            const sphere: SphereCollisionData = CollisionFactory.createSphereCollisionData(
                Vec3Factory.create(0, 0, 0),
                2.0, // Raio grande o suficiente para atingir o AABB
            );
            const box: AABB = AABBFactory.create(
                Vec3Factory.create(1, 1, 1),
                Vec3Factory.create(2, 2, 2),
            );

            const result = CollisionDetection.checkSphereAABBCollision(sphere, box);

            expect(result.hasCollision).toBe(true);
        });

        it("não deve detectar colisão entre esfera e AABB separados", () => {
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

        it("deve calcular vetor de separação na colisão esfera-AABB", () => {
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

        it("deve calcular ponto de contato na colisão esfera-AABB", () => {
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
        it("deve detectar interseção de raio com AABB", () => {
            const query: RaycastQuery = CollisionFactory.createRaycastQuery({
                origin: Vec3Factory.create(-5, 0, 0),
                direction: Vec3Factory.create(1, 0, 0), // Direção para direita
                maxDistance: 10,
            });

            const box: AABB = AABBFactory.create(
                Vec3Factory.create(-1, -1, -1),
                Vec3Factory.create(1, 1, 1),
            );

            const result = CollisionDetection.raycastAABB(query, box);

            expect(result.hit).toBe(true);
            expect(result.distance).toBe(4); // Distância da origem até o AABB
            expect(result.point).toBeDefined();
            expect(result.normal).toBeDefined();
        });

        it("não deve detectar interseção quando raio não atinge AABB", () => {
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

        it("deve respeitar limite de distância do raycast", () => {
            const query: RaycastQuery = CollisionFactory.createRaycastQuery({
                origin: Vec3Factory.create(-10, 0, 0),
                direction: Vec3Factory.create(1, 0, 0),
                maxDistance: 5, // Distância insuficiente para atingir o AABB
            });

            const box: AABB = AABBFactory.create(
                Vec3Factory.create(1, -1, -1),
                Vec3Factory.create(2, 1, 1),
            );

            const result = CollisionDetection.raycastAABB(query, box);

            expect(result.hit).toBe(false);
        });

        it("deve detectar raio originado dentro do AABB", () => {
            const query: RaycastQuery = CollisionFactory.createRaycastQuery({
                origin: Vec3Factory.create(0, 0, 0), // Origem dentro do AABB
                direction: Vec3Factory.create(1, 0, 0),
                maxDistance: 10,
            });

            const box: AABB = AABBFactory.create(
                Vec3Factory.create(-1, -1, -1),
                Vec3Factory.create(1, 1, 1),
            );

            const result = CollisionDetection.raycastAABB(query, box);

            expect(result.hit).toBe(true);
            expect(result.distance).toBe(1); // Distância até a borda do AABB
        });

        it("deve calcular normal correta na interseção do raio", () => {
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

    describe("casos extremos", () => {
        it("deve lidar com AABB degenerado (tamanho zero)", () => {
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

        it("deve lidar com esfera degenerada (raio zero)", () => {
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

        it("deve lidar com raio com componentes de direção nulos", () => {
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
