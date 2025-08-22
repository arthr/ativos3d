/**
 * Factory para criação de objetos de colisão
 *
 * Fornece métodos convenientes para criar corpos de colisão e consultas de raycasting
 * seguindo o padrão Factory Method estabelecido no projeto.
 */
import type {
    Vec3,
    AABB,
    CollisionBody,
    CollisionConfig,
    RaycastQuery,
    SphereCollisionData,
    CapsuleCollisionData,
    PlaneCollisionData,
} from "@core/geometry";
import { Vec3Factory, AABBFactory } from "@core/geometry";

/**
 * Factory para objetos relacionados à detecção de colisão
 */
export class CollisionFactory {
    /**
     * Cria um corpo de colisão básico
     */
    static createCollisionBody(config: {
        id: string;
        bounds: AABB;
        position?: Vec3;
        isStatic?: boolean;
        layers?: number;
    }): CollisionBody {
        return {
            id: config.id,
            bounds: config.bounds,
            position: config.position ?? Vec3Factory.zero(),
            isStatic: config.isStatic ?? false,
            layers: config.layers ?? 1, // Camada padrão: 1
        };
    }

    /**
     * Cria um corpo de colisão a partir de posição e tamanho
     */
    static createCollisionBodyFromBox(config: {
        id: string;
        position: Vec3;
        size: Vec3;
        isStatic?: boolean;
        layers?: number;
    }): CollisionBody {
        const bounds = AABBFactory.fromCenterSize(Vec3Factory.zero(), config.size);

        return this.createCollisionBody({
            id: config.id,
            bounds,
            position: config.position,
            isStatic: config.isStatic ?? false,
            layers: config.layers ?? 1,
        });
    }

    /**
     * Cria uma configuração de colisão padrão
     */
    static createCollisionConfig(config: Partial<CollisionConfig> = {}): CollisionConfig {
        return {
            tolerance: config.tolerance ?? 0.001,
            calculateContact: config.calculateContact ?? false,
            calculateSeparation: config.calculateSeparation ?? false,
            layerMask: config.layerMask,
        };
    }

    /**
     * Cria uma consulta de raycasting
     */
    static createRaycastQuery(config: {
        origin: Vec3;
        direction: Vec3;
        maxDistance?: number;
        layerMask?: number;
    }): RaycastQuery {
        return {
            origin: config.origin,
            direction: config.direction, // Assume que já está normalizada
            maxDistance: config.maxDistance ?? 1000,
            layerMask: config.layerMask,
        };
    }

    /**
     * Cria dados de colisão para uma esfera
     */
    static createSphereCollisionData(center: Vec3, radius: number): SphereCollisionData {
        if (radius <= 0) {
            throw new Error("Raio da esfera deve ser positivo");
        }

        return {
            center,
            radius,
        };
    }

    /**
     * Cria dados de colisão para uma cápsula
     */
    static createCapsuleCollisionData(
        start: Vec3,
        end: Vec3,
        radius: number,
    ): CapsuleCollisionData {
        if (radius <= 0) {
            throw new Error("Raio da cápsula deve ser positivo");
        }

        return {
            start,
            end,
            radius,
        };
    }

    /**
     * Cria dados de colisão para um plano
     */
    static createPlaneCollisionData(normal: Vec3, distance: number): PlaneCollisionData {
        return {
            normal,
            distance,
        };
    }

    /**
     * Cria múltiplos corpos de colisão em grade
     */
    static createGridOfBodies(config: {
        baseId: string;
        gridSize: { x: number; y: number; z: number };
        spacing: Vec3;
        bodySize: Vec3;
        startPosition?: Vec3;
        isStatic?: boolean;
        layers?: number;
    }): CollisionBody[] {
        const bodies: CollisionBody[] = [];
        const startPos = config.startPosition ?? Vec3Factory.zero();

        for (let x = 0; x < config.gridSize.x; x++) {
            for (let y = 0; y < config.gridSize.y; y++) {
                for (let z = 0; z < config.gridSize.z; z++) {
                    const position = Vec3Factory.create(
                        startPos.x + x * config.spacing.x,
                        startPos.y + y * config.spacing.y,
                        startPos.z + z * config.spacing.z,
                    );

                    const id = `${config.baseId}_${x}_${y}_${z}`;

                    const body = this.createCollisionBodyFromBox({
                        id,
                        position,
                        size: config.bodySize,
                        isStatic: config.isStatic ?? false,
                        layers: config.layers ?? 1,
                    });

                    bodies.push(body);
                }
            }
        }

        return bodies;
    }

    /**
     * Cria uma configuração otimizada para detecção rápida (sem detalhes)
     */
    static createFastCollisionConfig(): CollisionConfig {
        return this.createCollisionConfig({
            tolerance: 0.01,
            calculateContact: false,
            calculateSeparation: false,
        });
    }

    /**
     * Cria uma configuração detalhada para resolução de colisão
     */
    static createDetailedCollisionConfig(): CollisionConfig {
        return this.createCollisionConfig({
            tolerance: 0.001,
            calculateContact: true,
            calculateSeparation: true,
        });
    }
}
