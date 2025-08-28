import type { JSX } from "react";
import { Grid as DreiGrid } from "@react-three/drei";

/**
 * GridLayer: renderiza uma grade de referência no plano XZ.
 *
 * Útil para orientar o posicionamento e o snap de objetos no ambiente 3D.
 */
export function GridLayer({
    y = 0,
    config,
}: {
    /** Posição Y da grade (altura) */
    readonly y?: number;
    /** Configuração específica do Drei Grid (override dos defaults) */
    readonly config?: Partial<{
        cellSize: number;
        cellThickness: number;
        cellColor: string;
        sectionSize: number;
        sectionThickness: number;
        sectionColor: string;
        fadeDistance: number;
        fadeStrength: number;
        followCamera: boolean;
        infiniteGrid: boolean;
    }>;
}): JSX.Element {
    const defaults = {
        cellSize: 0.5,
        cellThickness: 0.5,
        cellColor: "#6f6f6f",
        sectionSize: 3,
        sectionThickness: 1,
        sectionColor: "#9d4b4b",
        fadeDistance: 80,
        fadeStrength: 1,
        followCamera: false,
        infiniteGrid: true,
    } as const;

    const props = { ...defaults, ...(config ?? {}) };

    return <DreiGrid position={[0, y, 0]} {...props} />;
}
