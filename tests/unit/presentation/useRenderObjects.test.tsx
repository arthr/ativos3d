import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, cleanup, act } from "@testing-library/react";

// Fake EventBus com API mínima
type Handler = (payload: any) => void;
class FakeBus {
    private map = new Map<string, Set<Handler>>();
    on(type: string, handler: Handler) {
        const set = this.map.get(type) ?? new Set<Handler>();
        set.add(handler);
        this.map.set(type, set);
        return () => set.delete(handler);
    }
    emit(type: string, payload: any) {
        const set = this.map.get(type);
        if (!set) return;
        for (const h of set) h(payload);
    }
}

let bus: FakeBus;

const fakeEntity = (id: string) => ({
    id,
    getComponent: (type: string) => {
        if (type === "RenderComponent")
            return {
                type: "RenderComponent",
                color: "#fff",
                visible: true,
                lodLevel: 0,
                material: {
                    type: "standard",
                    opacity: 1,
                    transparent: false,
                    receiveShadow: true,
                    castShadow: true,
                },
            } as any;
        if (type === "TransformComponent")
            return {
                type: "TransformComponent",
                position: { x: 0, y: 0, z: 0 },
                rotation: { x: 0, y: 0, z: 0 },
                scale: { x: 1, y: 1, z: 1 },
            } as any;
        return undefined;
    },
});

// Mantém referências estáveis para evitar re-render loops pelo useEffect depender de objetos
const entityManagerMock = {
    getEntitiesWithComponent: (componentType: string) => {
        if (componentType !== "RenderComponent") return [];
        return [fakeEntity("e1")];
    },
};
const app = { eventBus: bus as any, entityManager: entityManagerMock as any };
vi.mock("@presentation/hooks/useApplication", () => ({
    useApplication: () => app,
}));

describe("useRenderObjects", () => {
    beforeEach(() => {
        cleanup();
        bus = new FakeBus();
        // Atualiza o app mantendo a mesma referência
        app.eventBus = bus as any;
    });

    it("hidrata estado inicial e reage a remoções", async () => {
        const { useRenderObjects } = await import("@presentation/hooks/useRenderObjects");
        function Probe() {
            const { list } = useRenderObjects();
            return (
                <div>
                    <span data-testid="count">{list.length}</span>
                    {list.map((i) => (
                        <span key={i.entityId}>{i.entityId}</span>
                    ))}
                </div>
            );
        }

        render(<Probe />);
        expect(screen.getByTestId("count").textContent).toBe("1");

        // remove RenderComponent
        await act(async () => {
            bus.emit("componentRemoved", { entityId: "e1", componentType: "RenderComponent" });
        });

        await waitFor(() => {
            expect(screen.getByTestId("count").textContent).toBe("0");
        });
    });
});
