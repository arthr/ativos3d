import type { JSX } from "react";
import type { CameraMode } from "@core/types/camera/CameraTypes";
import { FiAperture, FiGrid, FiCrosshair, FiCamera } from "react-icons/fi";
import { DevButton } from "@presentation/panels/developer/components/DevButton";

/**
 * ViewTab: controles de visualização (Gizmo, Grid, Câmera).
 */
export function ViewTab({
    showGizmo,
    gridFollow,
    gridInfinite,
    cameraMode,
    onToggleGizmo,
    onToggleGridFollow,
    onToggleGridInfinite,
    onToggleCameraMode,
}: {
    readonly showGizmo: boolean;
    readonly gridFollow: boolean;
    readonly gridInfinite: boolean;
    readonly cameraMode: CameraMode | string;
    onToggleGizmo(): void;
    onToggleGridFollow(): void;
    onToggleGridInfinite(): void;
    onToggleCameraMode(): void;
}): JSX.Element {
    return (
        <div className="flex h-full flex-col">
            <div className="grid grid-cols-1 gap-3 p-3 md:grid-cols-2">
                {/* Camera */}
                <section className="rounded border border-slate-200 bg-white p-2">
                    <div className="mb-1 text-[11px] font-semibold flex items-center gap-1">
                        <FiCamera size={12} /> Camera
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px]">
                            {cameraMode}
                        </span>
                        <DevButton onClick={onToggleCameraMode} variant="secondary">
                            Toggle mode
                        </DevButton>
                    </div>
                </section>

                {/* Gizmo */}
                <section className="rounded border border-slate-200 bg-white p-2">
                    <div className="mb-1 text-[11px] font-semibold flex items-center gap-1">
                        <FiAperture size={12} /> Gizmo
                    </div>
                    <DevButton onClick={onToggleGizmo} variant="toggle" active={showGizmo}>
                        {showGizmo ? "Hide" : "Show"}
                    </DevButton>
                </section>

                {/* Grid */}
                <section className="rounded border border-slate-200 bg-white p-2">
                    <div className="mb-1 text-[11px] font-semibold flex items-center gap-1">
                        <FiGrid size={12} /> Grid
                    </div>
                    <div className="flex items-center gap-2">
                        <DevButton onClick={onToggleGridFollow} variant="toggle" active={gridFollow}>
                            <span className="inline-flex items-center gap-1">
                                <FiCrosshair size={12} /> Follow: {gridFollow ? "on" : "off"}
                            </span>
                        </DevButton>
                        <DevButton onClick={onToggleGridInfinite} variant="toggle" active={gridInfinite}>
                            <span className="inline-flex items-center gap-1">
                                <FiGrid size={12} /> Infinite: {gridInfinite ? "on" : "off"}
                            </span>
                        </DevButton>
                    </div>
                </section>
            </div>
        </div>
    );
}
