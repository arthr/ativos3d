import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act, waitFor, cleanup } from "@testing-library/react";

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

const fakeEntity = (id: string, comp: any) => ({
    id,
    getComponent: (type: string) => (type === comp.type ? comp : undefined),
});

const wall = { type: "WallComponent", height: 3 } as any;
const entityManagerMock = {
    getEntitiesWithComponent: (componentType: string) => {
        if (componentType !== "WallComponent") return [];
        return [fakeEntity("w1", wall)];
    },
};

const app = { eventBus: undefined as any, entityManager: entityManagerMock as any };
vi.mock("@presentation/hooks/useApplication", () => ({ useApplication: () => app }));

describe("useWalls", () => {
    beforeEach(() => {
        cleanup();
        bus = new FakeBus();
        app.eventBus = bus as any;
    });

    it("retorna lista de paredes consistente com eventos", async () => {
        const { useWalls } = await import("@presentation/hooks/useWalls");

        function Probe() {
            const { list } = useWalls();
            return React.createElement(
                "div",
                null,
                React.createElement("span", { "data-testid": "count" }, String(list.length)),
                ...list.map((i) =>
                    React.createElement(
                        "span",
                        { "data-testid": i.entityId },
                        String(i.wall.height),
                    ),
                ),
            );
        }

        render(React.createElement(Probe));
        expect(screen.getByTestId("count").textContent).toBe("1");
        expect(screen.getByTestId("w1").textContent).toBe("3");

        await act(async () => {
            bus.emit("componentAdded", {
                entityId: "w2",
                component: { type: "WallComponent", height: 4 },
            });
        });
        await waitFor(() => {
            expect(screen.getByTestId("count").textContent).toBe("2");
        });

        await act(async () => {
            bus.emit("componentAdded", {
                entityId: "w2",
                component: { type: "WallComponent", height: 5 },
            });
        });
        await waitFor(() => {
            expect(screen.getByTestId("w2").textContent).toBe("5");
        });

        await act(async () => {
            bus.emit("componentRemoved", { entityId: "w2", componentType: "WallComponent" });
        });
        await waitFor(() => {
            expect(screen.getByTestId("count").textContent).toBe("1");
        });

        await act(async () => {
            bus.emit("entityDestroyed", { entityId: "w1" });
        });
        await waitFor(() => {
            expect(screen.getByTestId("count").textContent).toBe("0");
        });
    });
});
