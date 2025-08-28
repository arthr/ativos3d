import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, cleanup } from "@testing-library/react";

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
                    setModelUrl: vi.fn(),
                    removeModel: vi.fn(),
                    setTextureUrl: vi.fn(),
                    removeTexture: vi.fn(),
                    setColor: vi.fn(),
                    setVisible: vi.fn(),
                    setLodLevel: vi.fn(),
                    setMaterial: vi.fn(),
                    isValid: vi.fn(() => true),
                    hasCustomModel: vi.fn(() => false),
                    hasCustomTexture: vi.fn(() => false),
                },
                transform: {
                    type: "TransformComponent",
                    position: { x: 1, y: 2, z: 3 },
                    rotation: { x: 0, y: 0, z: 0 },
                    scale: { x: 1, y: 1, z: 1 },
                    translate: vi.fn(),
                    setPosition: vi.fn(),
                    rotate: vi.fn(),
                    setRotation: vi.fn(),
                    scaleBy: vi.fn(),
                    setScale: vi.fn(),
                    setTransform: vi.fn(),
                    getTransform: vi.fn(() => ({ position: { x: 1, y: 2, z: 3 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } })),
                    isValid: vi.fn(() => true),
                },
            },
            {
                entityId: "e2",
                render: {
                    type: "RenderComponent",
                    color: "#00ff00",
                    visible: true,
                    lodLevel: 0,
                    material: { type: "standard", opacity: 1, transparent: false, receiveShadow: true, castShadow: true },
                    setModelUrl: vi.fn(),
                    removeModel: vi.fn(),
                    setTextureUrl: vi.fn(),
                    removeTexture: vi.fn(),
                    setColor: vi.fn(),
                    setVisible: vi.fn(),
                    setLodLevel: vi.fn(),
                    setMaterial: vi.fn(),
                    isValid: vi.fn(() => true),
                    hasCustomModel: vi.fn(() => false),
                    hasCustomTexture: vi.fn(() => false),
                },
                transform: undefined,
            },
        ],
    }),
}));

describe("ObjectsLayer", () => {
    beforeEach(() => {
        cleanup();
    });

    it("renderiza um group/mesh por objeto", async () => {
        const { ObjectsLayer } = await import("@presentation/layers/ObjectsLayer");
        const { container } = render(<ObjectsLayer />);
        const groups = container.querySelectorAll("group");
        const meshes = container.querySelectorAll("mesh");
        expect(groups.length).toBe(2);
        expect(meshes.length).toBe(2);
    });
});

