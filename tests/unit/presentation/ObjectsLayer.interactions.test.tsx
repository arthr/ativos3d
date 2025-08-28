import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, cleanup, fireEvent } from "@testing-library/react";

vi.mock("@presentation/hooks/useRenderObjects", () => ({
    useRenderObjects: () => ({
        list: [
            {
                entityId: "e1",
                render: {
                    type: "RenderComponent",
                    color: "#ff0000",
                    visible: true,
                    lodLevel: 0,
                    material: { type: "standard", opacity: 1, transparent: false, receiveShadow: true, castShadow: true },
                },
                transform: {
                    type: "TransformComponent",
                    position: { x: 0, y: 0, z: 0 },
                    rotation: { x: 0, y: 0, z: 0 },
                    scale: { x: 1, y: 1, z: 1 },
                },
            },
        ],
    }),
}));

const emit = vi.fn();
vi.mock("@presentation/hooks/useApplication", () => ({
    useApplication: () => ({ eventBus: { emit } }),
}));

describe("ObjectsLayer interactions", () => {
    beforeEach(() => {
        cleanup();
        emit.mockReset();
    });

    it("emite entitySelected, entityHovered e entityUnhovered nos eventos de ponteiro", async () => {
        const { ObjectsLayer } = await import("@presentation/layers/ObjectsLayer");
        const { container } = render(<ObjectsLayer />);
        const mesh = container.querySelector("mesh");
        expect(mesh).toBeTruthy();

        if (!mesh) throw new Error("mesh não encontrado");

        fireEvent.pointerOver(mesh);
        fireEvent.pointerDown(mesh);
        fireEvent.pointerOut(mesh);

        expect(emit).toHaveBeenCalledWith("entityHovered", { entityId: "e1" });
        expect(emit).toHaveBeenCalledWith("entitySelected", { entityId: "e1" });
        expect(emit).toHaveBeenCalledWith("entityUnhovered", { entityId: "e1" });
    });
});

