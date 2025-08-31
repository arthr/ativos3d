import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act, waitFor, cleanup } from "@testing-library/react";

// Fake EventBus simples
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

const initial = { type: "TestComponent", value: 0 } as any;
const entityManagerMock = {
    getEntitiesWithComponent: (componentType: string) => {
        if (componentType !== "TestComponent") return [];
        return [fakeEntity("e1", initial)];
    },
};

const app = { eventBus: undefined as any, entityManager: entityManagerMock as any };
vi.mock("@presentation/hooks/useApplication", () => ({ useApplication: () => app }));

describe("useComponentSubscription", () => {
    beforeEach(() => {
        cleanup();
        bus = new FakeBus();
        app.eventBus = bus as any;
    });

    it("mantém o mapa de componentes sincronizado", async () => {
        const { useComponentSubscription } = await import(
            "@presentation/hooks/useComponentSubscription"
        );

        function Probe() {
            const map = useComponentSubscription<{ type: string; value: number }>("TestComponent");
            const entries = Array.from(map.entries());
            return React.createElement(
                "div",
                null,
                React.createElement("span", { "data-testid": "count" }, String(entries.length)),
                ...entries.map(([id, comp]) =>
                    React.createElement("span", { "data-testid": id }, String(comp.value)),
                ),
            );
        }

        render(React.createElement(Probe));

        expect(screen.getByTestId("count").textContent).toBe("1");
        expect(screen.getByTestId("e1").textContent).toBe("0");

        await act(async () => {
            bus.emit("componentAdded", {
                entityId: "e2",
                component: { type: "TestComponent", value: 1 },
            });
        });
        await waitFor(() => {
            expect(screen.getByTestId("count").textContent).toBe("2");
        });

        await act(async () => {
            bus.emit("componentAdded", {
                entityId: "e2",
                component: { type: "TestComponent", value: 2 },
            });
        });
        await waitFor(() => {
            expect(screen.getByTestId("e2").textContent).toBe("2");
        });

        await act(async () => {
            bus.emit("componentRemoved", { entityId: "e2", componentType: "TestComponent" });
        });
        await waitFor(() => {
            expect(screen.getByTestId("count").textContent).toBe("1");
        });

        await act(async () => {
            bus.emit("entityDestroyed", { entityId: "e1" });
        });
        await waitFor(() => {
            expect(screen.getByTestId("count").textContent).toBe("0");
        });
    });
});
