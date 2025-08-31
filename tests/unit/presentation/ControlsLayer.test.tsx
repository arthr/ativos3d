import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import type { CameraGesture } from "@core/types/camera";

const orbitProps: Array<Record<string, unknown>> = [];
vi.mock("@react-three/drei", () => ({
    OrbitControls: (props: Record<string, unknown>) => {
        orbitProps.push(props);
        return null;
    },
}));

vi.mock("@react-three/fiber", () => ({
    useThree: () => ({ camera: {} }),
}));

const eventBus = { on: vi.fn(() => () => {}), emit: vi.fn() };
let gestures: Set<CameraGesture> = new Set();

const cameraSystem = {
    getMode: () => "persp",
    isControlsEnabled: () => true,
    getGestures: () => gestures,
};

vi.mock("@presentation/hooks/useApplication", () => ({
    useApplication: () => ({ eventBus, cameraSystem }),
}));

describe("ControlsLayer gestures", () => {
    beforeEach(() => {
        cleanup();
        orbitProps.length = 0;
        eventBus.on.mockClear();
        eventBus.emit.mockClear();
    });

    it("habilita pan e zoom conforme gestos permitidos", async () => {
        gestures = new Set(["pan", "zoom"]);
        const { ControlsLayer } = await import("@presentation/layers/ControlsLayer");
        render(<ControlsLayer />);
        expect(orbitProps[0].enablePan).toBe(true);
        expect(orbitProps[0].enableZoom).toBe(true);
    });

    it("desabilita zoom quando gesto não permitido", async () => {
        gestures = new Set(["pan"]);
        const { ControlsLayer } = await import("@presentation/layers/ControlsLayer");
        render(<ControlsLayer />);
        expect(orbitProps[0].enablePan).toBe(true);
        expect(orbitProps[0].enableZoom).toBe(false);
    });

    it("desabilita pan quando gesto não permitido", async () => {
        gestures = new Set(["zoom"]);
        const { ControlsLayer } = await import("@presentation/layers/ControlsLayer");
        render(<ControlsLayer />);
        expect(orbitProps[0].enablePan).toBe(false);
        expect(orbitProps[0].enableZoom).toBe(true);
    });
});
