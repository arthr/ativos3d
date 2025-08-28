import React from "react";
import type { JSX } from "react";
import { GizmoHelper, GizmoViewport } from "@react-three/drei";

/**
 * GizmoLayer: exibe um gizmo de orientação (eixos/view) sobreposto ao Canvas.
 * - Usa GizmoHelper + GizmoViewport do Drei.
 * - Não interfere no ciclo de vida do R3F e é opcional via prop `show`.
 */
export function GizmoLayer({
    show = true,
    alignment = "bottom-right",
    margin = [80, 80],
    axisColors = ["#ff6b6b", "#6bff8a", "#6bb8ff"],
    labelColor = "#cccccc",
}: {
    readonly show?: boolean;
    readonly alignment?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
    readonly margin?: [number, number];
    readonly axisColors?: [string, string, string];
    readonly labelColor?: string;
}): JSX.Element | null {
    if (!show) return null;
    return (
        <GizmoHelper alignment={alignment} margin={margin} renderPriority={1}>
            <GizmoViewport axisColors={axisColors} labelColor={labelColor} />
        </GizmoHelper>
    );
}

