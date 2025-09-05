import type { Footprint3D, Vec3, AABB } from "../types";
import { AABBFactory } from "../factories/AABBFactory";
import { Vec3Factory } from "../factories/Vec3Factory";
import { AABBOperations } from "./AABBOperations";

/**
 * Operações utilitárias para Footprint3D
 */
export class FootprintOperations {
    /**
     * Rotaciona um Footprint3D considerando a rotação em Y
     * Para caixas, troca largura e profundidade em multiplos de 90 graus.
     */
    static rotateFootprint3D(fp: Footprint3D, rot: Vec3): Footprint3D {
        if(fp.kind === "poly") return fp;

        const yaw = ((rot.y % 360) + 360) % 360;
        if(yaw % 180 === 0) return fp;

        return { ...fp, w: fp.d, d: fp.w };
    }

    /**
     * Calcula o AABB de um Footprint3D na posição fornecida
     */
    static footprintAABB3D(fp: Footprint3D, pos: Vec3): AABB {
        if(fp.kind === "box") {
            const min = Vec3Factory.create(pos.x, pos.y, pos.z);
            const max = Vec3Factory.create(pos.x + fp.w, pos.y + fp.h, pos.z + fp.d);
            const box = AABBFactory.create(min, max);
            return AABBOperations.isValid(box) ? box : AABBFactory.empty();
        }

        if(fp.points.length === 0) return AABBFactory.empty();

        const xs = fp.points.map((p) => p.x + pos.x);
        const ys = fp.points.map((p) => p.y + pos.y);
        const zs = fp.points.map((p) => p.z + pos.z);

        const min = Vec3Factory.create(Math.min(...xs), Math.min(...ys), Math.min(...zs));
        const max = Vec3Factory.create(Math.max(...xs), Math.max(...ys), Math.max(...zs));
        const box = AABBFactory.create(min, max);
        return AABBOperations.isValid(box) ? box : AABBFactory.empty();
    }
}