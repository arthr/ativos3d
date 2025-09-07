import type { AABB } from "@core/geometry";

export type { AABB };

/**
 * Interface para indexação espacial simples baseados em AABB.
 */
export interface SpatialIndex {
    /**
     * Insere um volume no índice.
     */
    insert(box: AABB): void;

    /**
     * Consulta volumes potencialmente colidentes com a caixa fornecida.
     */
    query(box: AABB): AABB[];

    /**
     * Remove todos os volumes do índice.
     */
    clear(): void;
}
