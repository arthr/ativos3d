import { useEffect, useMemo, useState, type JSX } from "react";
import { useApplication } from "@presentation/hooks/useApplication";
import type { WallComponent as IWallComponent } from "@core/types/components/WallComponent";
import type { RenderComponent as IRenderComponent } from "@core/types/components/RenderComponent";

/**
 * InspectorTab: edita propriedades da entidade selecionada (paredes/cores).
 */
export function InspectorTab({ activeEntityId }: { readonly activeEntityId?: string | null }): JSX.Element {
    const { entityManager } = useApplication();

    const entity = useMemo(() => {
        return activeEntityId ? entityManager.getEntity(activeEntityId) : undefined;
    }, [entityManager, activeEntityId]);

    const wall = entity?.getComponent<IWallComponent>("WallComponent");
    const render = entity?.getComponent<IRenderComponent>("RenderComponent");

    const [height, setHeight] = useState<number | "">(wall?.height ?? "");
    const [thickness, setThickness] = useState<number | "">(wall?.thickness ?? "");
    const [color, setColor] = useState<string>(render?.color ?? "#b8b8b8");

    useEffect(() => {
        setHeight(wall?.height ?? "");
        setThickness(wall?.thickness ?? "");
    }, [wall?.height, wall?.thickness]);

    useEffect(() => {
        if (render?.color) setColor(render.color);
    }, [render?.color]);

    if (!entity) {
        return (
            <div className="flex h-full items-center justify-center text-slate-500">
                Select an entity to edit
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col">
            <div className="border-b border-slate-100 px-3 py-2 text-[12px]">
                <div className="font-mono">Entity: {entity.id}</div>
            </div>
            <div className="flex-1 overflow-auto px-3 py-2 space-y-3">
                {wall ? (
                    <section className="rounded border border-slate-200 bg-white p-2">
                        <div className="mb-1 text-[11px] font-semibold">Wall</div>
                        <div className="grid grid-cols-2 gap-2 items-center">
                            <label className="text-[11px] text-slate-600">Height</label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    value={height}
                                    onChange={(e) => setHeight(e.target.value === "" ? "" : Number(e.target.value))}
                                    className="w-28 rounded border border-slate-300 px-2 py-1 text-[11px]"
                                />
                                <button
                                    disabled={height === ""}
                                    onClick={() => {
                                        if (height === "") return;
                                        const updated = wall.setHeight(height as number);
                                        entityManager.addComponent(entity.id, updated);
                                    }}
                                    className="rounded bg-slate-800 px-2 py-1 text-[11px] text-white disabled:bg-slate-200"
                                >
                                    Apply
                                </button>
                            </div>

                            <label className="text-[11px] text-slate-600">Thickness</label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    value={thickness}
                                    onChange={(e) =>
                                        setThickness(e.target.value === "" ? "" : Number(e.target.value))
                                    }
                                    className="w-28 rounded border border-slate-300 px-2 py-1 text-[11px]"
                                />
                                <button
                                    disabled={thickness === ""}
                                    onClick={() => {
                                        if (thickness === "") return;
                                        const updated = wall.setThickness(thickness as number);
                                        entityManager.addComponent(entity.id, updated);
                                    }}
                                    className="rounded bg-slate-800 px-2 py-1 text-[11px] text-white disabled:bg-slate-200"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    </section>
                ) : (
                    <section className="rounded border border-slate-200 bg-white p-2 text-[11px] text-slate-500">
                        No WallComponent found on this entity
                    </section>
                )}

                {render ? (
                    <section className="rounded border border-slate-200 bg-white p-2">
                        <div className="mb-1 text-[11px] font-semibold">Render</div>
                        <div className="grid grid-cols-2 gap-2 items-center">
                            <label className="text-[11px] text-slate-600">Color</label>
                            <div className="flex gap-2 items-center">
                                <input
                                    type="color"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                />
                                <button
                                    onClick={() => {
                                        const updated = render.setColor(color);
                                        entityManager.addComponent(entity.id, updated);
                                    }}
                                    className="rounded bg-slate-800 px-2 py-1 text-[11px] text-white"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    </section>
                ) : (
                    <section className="rounded border border-slate-200 bg-white p-2 text-[11px] text-slate-500">
                        No RenderComponent found on this entity
                    </section>
                )}
            </div>
        </div>
    );
}
