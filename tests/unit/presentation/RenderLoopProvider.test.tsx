import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, cleanup } from "@testing-library/react";

let captured: ((state: unknown, delta: number) => void) | null = null;

vi.mock("@react-three/fiber", () => ({
    useFrame: (cb: (state: unknown, delta: number) => void) => {
        captured = cb;
    },
}));

const tick = vi.fn();
vi.mock("@/applicationInstance", () => ({
    application: {
        resolve: (key: string) => {
            if (key === "renderLoop") return { tick };
            throw new Error(`Unexpected resolve for ${key}`);
        },
    },
}));

describe("RenderLoopProvider", () => {
    beforeEach(() => {
        cleanup();
        captured = null;
        tick.mockReset();
    });

    it("registra callback no useFrame e encaminha delta para tick", async () => {
        const { RenderLoopProvider } = await import("@presentation/providers/RenderLoopProvider");
        render(<RenderLoopProvider />);

        expect(captured).toBeTypeOf("function");
        captured?.({}, 0.02);
        expect(tick).toHaveBeenCalledTimes(1);
        expect(tick).toHaveBeenCalledWith(0.02);
    });
});

