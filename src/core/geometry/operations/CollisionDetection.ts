/**
 * Sistema de detecção de colisão
 *
 * Implementa algoritmos básicos de detecção de colisão para formas geométricas simples.
 * Segue os princípios da Clean Architecture mantendo-se na camada core.
 */
import type {
    Vec3,
    AABB,
    CollisionResult,
    CollisionBody,
    CollisionConfig,
    RaycastQuery,
    RaycastResult,
    SphereCollisionData,
} from "../types";
import { DEFAULT_COLLISION_CONFIG } from "../types/Collision";
import { Vec3Factory } from "../factories/Vec3Factory";
import { Vec3Operations } from "./Vec3Operations";
import { Vec3Math } from "../math/Vec3Math";
import { AABBOperations } from "./AABBOperations";

/**
 * Sistema de detecção de colisão básico
 */
export class CollisionDetection {
    /**
     * Detecta colisão entre duas AABBs
     */
    static checkAABBCollision(
        boxA: AABB,
        boxB: AABB,
        config: Partial<CollisionConfig> = {},
    ): CollisionResult {
        const finalConfig = { ...DEFAULT_COLLISION_CONFIG, ...config };

        // Verifica se há interseção básica
        if (!AABBOperations.intersects(boxA, boxB)) {
            return { hasCollision: false };
        }

        const result: CollisionResult = { hasCollision: true };

        if (finalConfig.calculateSeparation || finalConfig.calculateContact) {
            const overlap = this.calculateAABBOverlap(boxA, boxB);

            if (finalConfig.calculateSeparation) {
                result.separationVector = this.calculateSeparationVector(boxA, boxB, overlap);
                result.penetrationDepth = Vec3Math.magnitude(result.separationVector);
            }

            if (finalConfig.calculateContact) {
                result.contactPoint = this.calculateContactPoint(boxA, boxB);
            }
        }

        return result;
    }

    /**
     * Detecta colisão entre dois corpos de colisão
     */
    static checkBodyCollision(
        bodyA: CollisionBody,
        bodyB: CollisionBody,
        config: Partial<CollisionConfig> = {},
    ): CollisionResult {
        // Verifica filtros de camada se especificado
        if (config.layerMask !== undefined) {
            if (
                (bodyA.layers & config.layerMask) === 0 ||
                (bodyB.layers & config.layerMask) === 0
            ) {
                return { hasCollision: false };
            }
        }

        // Translada as AABBs para suas posições atuais
        const translatedBoxA = this.translateAABB(bodyA.bounds, bodyA.position);
        const translatedBoxB = this.translateAABB(bodyB.bounds, bodyB.position);

        return this.checkAABBCollision(translatedBoxA, translatedBoxB, config);
    }

    /**
     * Verifica se um ponto está dentro de uma AABB
     */
    static pointInAABB(point: Vec3, box: AABB): boolean {
        return AABBOperations.containsPoint(box, point);
    }

    /**
     * Detecta colisão entre esfera e AABB
     */
    static checkSphereAABBCollision(
        sphere: SphereCollisionData,
        box: AABB,
        config: Partial<CollisionConfig> = {},
    ): CollisionResult {
        const finalConfig = { ...DEFAULT_COLLISION_CONFIG, ...config };

        // Encontra o ponto mais próximo na AABB
        const closestPoint = this.closestPointOnAABB(sphere.center, box);

        // Calcula a distância entre o centro da esfera e o ponto mais próximo
        const distance = Vec3Math.distance(sphere.center, closestPoint);

        if (distance > sphere.radius + finalConfig.tolerance) {
            return { hasCollision: false };
        }

        const result: CollisionResult = { hasCollision: true };

        if (finalConfig.calculateSeparation) {
            const direction = Vec3Operations.subtract(sphere.center, closestPoint);
            const directionNormalized = Vec3Math.normalize(direction);
            const penetration = sphere.radius - distance;

            result.penetrationDepth = penetration;
            result.separationVector = Vec3Operations.multiply(directionNormalized, penetration);
        }

        if (finalConfig.calculateContact) {
            result.contactPoint = closestPoint;
        }

        return result;
    }

    /**
     * Executa raycasting contra uma AABB
     */
    static raycastAABB(query: RaycastQuery, box: AABB): RaycastResult {
        // Implementação baseada no algoritmo de intersecção raio-caixa
        const invDir = Vec3Factory.create(
            1.0 / query.direction.x,
            1.0 / query.direction.y,
            1.0 / query.direction.z,
        );

        const t1 = (box.min.x - query.origin.x) * invDir.x;
        const t2 = (box.max.x - query.origin.x) * invDir.x;
        const t3 = (box.min.y - query.origin.y) * invDir.y;
        const t4 = (box.max.y - query.origin.y) * invDir.y;
        const t5 = (box.min.z - query.origin.z) * invDir.z;
        const t6 = (box.max.z - query.origin.z) * invDir.z;

        const tMin = Math.max(Math.max(Math.min(t1, t2), Math.min(t3, t4)), Math.min(t5, t6));
        const tMax = Math.min(Math.min(Math.max(t1, t2), Math.max(t3, t4)), Math.max(t5, t6));

        // Se tMax < 0, o raio está apontando para longe da AABB
        if (tMax < 0) {
            return { hit: false };
        }

        // Se tMin > tMax, não há intersecção
        if (tMin > tMax) {
            return { hit: false };
        }

        // Se tMin < 0, estamos dentro da caixa, usa tMax
        const t = tMin < 0 ? tMax : tMin;

        // Verifica se a distância está dentro do limite
        if (t > query.maxDistance) {
            return { hit: false };
        }

        const hitPoint = Vec3Operations.add(
            query.origin,
            Vec3Operations.multiply(query.direction, t),
        );

        const normal = this.calculateAABBNormal(hitPoint, box);

        return {
            hit: true,
            distance: t,
            point: hitPoint,
            normal,
        };
    }

    static raycastBodies(query: RaycastQuery, bodies: CollisionBody[]): RaycastResult {
        let closest: RaycastResult | null = null;

        for (const body of bodies) {
            if (query.layerMask !== undefined && (body.layers & query.layerMask) === 0) {
                continue;
            }

            const translated = this.translateAABB(body.bounds, body.position);
            const result = this.raycastAABB(query, translated);
            if (!result.hit) {
                continue;
            }

            if (!closest || (result.distance ?? Infinity) < (closest.distance ?? Infinity)) {
                closest = { ...result, body };
            }
        }

        return closest ?? { hit: false };
    }

    /**
     * Calcula sobreposição entre duas AABBs
     */
    private static calculateAABBOverlap(boxA: AABB, boxB: AABB): Vec3 {
        return Vec3Factory.create(
            Math.min(boxA.max.x, boxB.max.x) - Math.max(boxA.min.x, boxB.min.x),
            Math.min(boxA.max.y, boxB.max.y) - Math.max(boxA.min.y, boxB.min.y),
            Math.min(boxA.max.z, boxB.max.z) - Math.max(boxA.min.z, boxB.min.z),
        );
    }

    /**
     * Calcula vetor de separação mínima entre duas AABBs
     */
    private static calculateSeparationVector(boxA: AABB, boxB: AABB, overlap: Vec3): Vec3 {
        // Encontra a dimensão com menor sobreposição
        let minAxis = 0;
        let minOverlap = overlap.x;

        if (overlap.y < minOverlap) {
            minAxis = 1;
            minOverlap = overlap.y;
        }

        if (overlap.z < minOverlap) {
            minAxis = 2;
            minOverlap = overlap.z;
        }

        // Determina a direção da separação
        const centerA = AABBOperations.getCenter(boxA);
        const centerB = AABBOperations.getCenter(boxB);

        if (minAxis === 0) {
            const x = centerA.x < centerB.x ? -minOverlap : minOverlap;
            return Vec3Factory.create(x, 0, 0);
        } else if (minAxis === 1) {
            const y = centerA.y < centerB.y ? -minOverlap : minOverlap;
            return Vec3Factory.create(0, y, 0);
        } else {
            const z = centerA.z < centerB.z ? -minOverlap : minOverlap;
            return Vec3Factory.create(0, 0, z);
        }
    }

    /**
     * Calcula ponto de contato entre duas AABBs
     */
    private static calculateContactPoint(boxA: AABB, boxB: AABB): Vec3 {
        // Usa o centro da interseção como ponto de contato aproximado
        const intersectionMin = Vec3Factory.create(
            Math.max(boxA.min.x, boxB.min.x),
            Math.max(boxA.min.y, boxB.min.y),
            Math.max(boxA.min.z, boxB.min.z),
        );

        const intersectionMax = Vec3Factory.create(
            Math.min(boxA.max.x, boxB.max.x),
            Math.min(boxA.max.y, boxB.max.y),
            Math.min(boxA.max.z, boxB.max.z),
        );

        return Vec3Operations.divide(Vec3Operations.add(intersectionMin, intersectionMax), 2);
    }

    /**
     * Encontra o ponto mais próximo em uma AABB a partir de um ponto
     */
    private static closestPointOnAABB(point: Vec3, box: AABB): Vec3 {
        return Vec3Factory.create(
            Math.max(box.min.x, Math.min(point.x, box.max.x)),
            Math.max(box.min.y, Math.min(point.y, box.max.y)),
            Math.max(box.min.z, Math.min(point.z, box.max.z)),
        );
    }

    /**
     * Translada uma AABB por um vetor de posição
     */
    private static translateAABB(box: AABB, translation: Vec3): AABB {
        return {
            min: Vec3Operations.add(box.min, translation),
            max: Vec3Operations.add(box.max, translation),
        };
    }

    /**
     * Calcula a normal da superfície de uma AABB em um ponto
     */
    private static calculateAABBNormal(point: Vec3, box: AABB): Vec3 {
        const center = AABBOperations.getCenter(box);
        const size = AABBOperations.getSize(box);

        // Calcula as distâncias relativas para cada face
        const dx = Math.abs(point.x - center.x) / (size.x * 0.5);
        const dy = Math.abs(point.y - center.y) / (size.y * 0.5);
        const dz = Math.abs(point.z - center.z) / (size.z * 0.5);

        // Encontra a face mais próxima
        if (dx >= dy && dx >= dz) {
            return Vec3Factory.create(point.x > center.x ? 1 : -1, 0, 0);
        } else if (dy >= dz) {
            return Vec3Factory.create(0, point.y > center.y ? 1 : -1, 0);
        } else {
            return Vec3Factory.create(0, 0, point.z > center.z ? 1 : -1);
        }
    }
}
