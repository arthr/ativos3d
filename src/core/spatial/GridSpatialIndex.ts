import type { SpatialIndex, AABB } from "./types";

type CellKey = string;

function forEachCoveredCell(aabb: AABB, cell: number, fn: (key: CellKey) => void): void {
    const minCx = Math.floor(aabb.min.x / cell);
    const maxCx = Math.floor((aabb.max.x - 1e-6) / cell);
    const minCz = Math.floor(aabb.min.z / cell);
    const maxCz = Math.floor((aabb.max.z - 1e-6) / cell);

    for (let cx = minCx; cx <= maxCx; cx += 1) {
        for (let cz = minCz; cz <= maxCz; cz += 1) {
            fn(`${cx}:${cz}`);
        }
    }
}

/**
 * Índice espacial baseado em grid para consultas de AABB.
 */
export class GridSpatialIndex implements SpatialIndex {
    private readonly cellSize: number;
    private readonly cells = new Map<CellKey, AABB[]>();

    /**
     * Cria um indice espacial com tamanho de célula customizável.
     * @param cellSize - Tamanho da célula do grid.
     */
    constructor(cellSize = 1) {
        this.cellSize = Math.max(0.1, cellSize);
    }

    /**
     * Insere uma caixa no índice.
     * @param box - AABB a ser inserida.
     */
    insert(box: AABB): void {
        forEachCoveredCell(box, this.cellSize, (key) => {
            const arr = this.cells.get(key) ?? [];
            arr.push(box);
            this.cells.set(key, arr);
        });
    }

    /**
     * Consulta caixas potencialmente sobrepostas com a caixa fornecida.
     * @param box - AABB a ser consultada.
     * @returns Lista de AABB encontradas.
     */
    query(box: AABB): AABB[] {
        const seen = new Set<AABB>();
        const results: AABB[] = [];
        forEachCoveredCell(box, this.cellSize, (key) => {
            const arr = this.cells.get(key);
            if (!arr) return;
            for (const b of arr) {
                if (seen.has(b)) continue;
                seen.add(b);
                results.push(b);
            }
        });
        return results;
    }

    /**
     * Remove todos os caixas do índice.
     */
    clear(): void {
        this.cells.clear();
    }
}
