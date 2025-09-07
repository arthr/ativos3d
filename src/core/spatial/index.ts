export * from "./types";
export * from "./GridSpatialIndex";

/**
 * Opções para criação de um {@link SpatialIndex}.
 */
export interface SpatialIndexFactoryOptions {
    /**
     * Tamanho das células do grid utilizado pelo índice.
     *
     * @default 1
     */
    cellSize?: number;
}

import type { SpatialIndex } from "./types";
import { GridSpatialIndex } from "./GridSpatialIndex";

/**
 * Cria um índice espacial baseado em grid.
 */
export function createSpatialIndex(options: SpatialIndexFactoryOptions = {}): SpatialIndex {
    const { cellSize = 1 } = options;
    return new GridSpatialIndex(cellSize);
}
