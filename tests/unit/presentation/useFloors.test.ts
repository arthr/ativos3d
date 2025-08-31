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

const floor = { type: "FloorComponent", material: "wood" } as any;
const entityManagerMock = {
    getEntitiesWithComponent: (componentType: string) => {
        if (componentType !== "FloorComponent") return [];
        return [fakeEntity("f1", floor)];
    },
};

const app = { eventBus: undefined as any, entityManager: entityManagerMock as any };
vi.mock("@presentation/hooks/useApplication", () => ({ useApplication: () => app }));

describe("useFloors", () => {
    beforeEach(() => {
        cleanup();
        bus = new FakeBus();
        app.eventBus = bus as any;
    });

    it("retorna lista de pisos consistente com eventos", async () => {
        const { useFloors } = await import("@presentation/hooks/useFloors");

        function Probe() {
            const { list } = useFloors();
            return React.createElement(
                "div",
                null,
                React.createElement("span", { "data-testid": "count" }, String(list.length)),
                ...list.map((i) =>
                    React.createElement(
                        "span",
                        { "data-testid": i.entityId },
                        i.floor.material as string,
                    ),
                ),
            );
        }

        render(React.createElement(Probe));
        expect(screen.getByTestId("count").textContent).toBe("1");
        expect(screen.getByTestId("f1").textContent).toBe("wood");

        await act(async () => {
            bus.emit("componentAdded", {
                entityId: "f2",
                component: { type: "FloorComponent", material: "stone" },
            });
        });
        await waitFor(() => {
            expect(screen.getByTestId("count").textContent).toBe("2");
        });

        await act(async () => {
            bus.emit("componentAdded", {
                entityId: "f2",
                component: { type: "FloorComponent", material: "tile" },
            });
        });
        await waitFor(() => {
            expect(screen.getByTestId("f2").textContent).toBe("tile");
        });

        await act(async () => {
            bus.emit("componentRemoved", { entityId: "f2", componentType: "FloorComponent" });
        });
        await waitFor(() => {
            expect(screen.getByTestId("count").textContent).toBe("1");
        });

        await act(async () => {
            bus.emit("entityDestroyed", { entityId: "f1" });
        });
        await waitFor(() => {
            expect(screen.getByTestId("count").textContent).toBe("0");
        });
    });
});
