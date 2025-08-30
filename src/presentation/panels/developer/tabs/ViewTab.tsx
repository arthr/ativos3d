import type { JSX } from "react";
import type { CameraMode } from "@core/types/camera/CameraTypes";
import { FiAperture, FiGrid, FiCrosshair, FiCamera } from "react-icons/fi";

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
                        <button
                            onClick={onToggleCameraMode}
                            className="rounded-md bg-indigo-600 px-2 py-1 text-[11px] text-white hover:bg-indigo-700"
                        >
                            Toggle mode
                        </button>
                    </div>
                </section>

                {/* Gizmo */}
                <section className="rounded border border-slate-200 bg-white p-2">
                    <div className="mb-1 text-[11px] font-semibold flex items-center gap-1">
                        <FiAperture size={12} /> Gizmo
                    </div>
                    <button
                        onClick={onToggleGizmo}
                        className={`rounded-md px-2 py-1 text-[11px] ${showGizmo ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
                    >
                        {showGizmo ? "Hide" : "Show"}
                    </button>
                </section>

                {/* Grid */}
                <section className="rounded border border-slate-200 bg-white p-2">
                    <div className="mb-1 text-[11px] font-semibold flex items-center gap-1">
                        <FiGrid size={12} /> Grid
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onToggleGridFollow}
                            className={`rounded-md px-2 py-1 text-[11px] ${gridFollow ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
                        >
                            <span className="inline-flex items-center gap-1">
                                <FiCrosshair size={12} /> Follow: {gridFollow ? "on" : "off"}
                            </span>
                        </button>
                        <button
                            onClick={onToggleGridInfinite}
                            className={`rounded-md px-2 py-1 text-[11px] ${gridInfinite ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
                        >
                            <span className="inline-flex items-center gap-1">
                                <FiGrid size={12} /> Infinite: {gridInfinite ? "on" : "off"}
                            </span>
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
}
