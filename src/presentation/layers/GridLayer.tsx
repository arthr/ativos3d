import React from "react";
import type { JSX } from "react";

/**
 * GridLayer: renderiza uma grade de referência no plano XZ.
 *
 * Útil para orientar o posicionamento e o snap de objetos no ambiente 3D.
 */
export function GridLayer({
    size = 100,
    divisions = 100,
    colorCenterLine = "#444444",
    colorGrid = "#222222",
    y = 0,
}: {
    /** Tamanho total da grade (em unidades) */
    readonly size?: number;
    /** Número de divisões da grade */
    readonly divisions?: number;
    /** Cor das linhas centrais X/Z */
    readonly colorCenterLine?: string;
    /** Cor das demais linhas da grade */
    readonly colorGrid?: string;
    /** Posição Y da grade (altura) */
    readonly y?: number;
}): JSX.Element {
    return <gridHelper args={[size, divisions, colorCenterLine, colorGrid]} position={[0, y, 0]} />;
}
