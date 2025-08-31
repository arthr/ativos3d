import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, cleanup, act } from "@testing-library/react";

/**
 * Pequeno EventBus fake usado nos testes
 */
type Handler = (payload: any) => void;
class FakeBus {
    private map = new Map<string, Set<Handler>>();
    /**
     * Registra um listener
     */
    on(type: string, handler: Handler) {
        const set = this.map.get(type) ?? new Set<Handler>();
        set.add(handler);
        this.map.set(type, set);
        return () => set.delete(handler);
    }
    /**
     * Emite um evento
     */
    emit(type: string, payload: any) {
        const set = this.map.get(type);
        if (!set) return;
        for (const h of set) h(payload);
    }
}

let bus: FakeBus;

/**
 * Cria uma entidade fake com um TransformComponent simples
 */
const fakeEntity = (id: string, comp: any) => ({
    id,
    getComponent: (type: string) => (type === "TransformComponent" ? comp : undefined),
});

// Mantém referências estáveis para evitar re-render loops
const entityManagerMock = {
    getEntitiesWithComponent: (componentType: string) => {
        if (componentType !== "TransformComponent") return [];
        const component = {
            type: "TransformComponent",
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
        };
        return [fakeEntity("e1", component)];
    },
};
const app = { eventBus: bus as any, entityManager: entityManagerMock as any };
vi.mock("@presentation/hooks/useApplication", () => ({
    useApplication: () => app,
}));

describe("useComponentSubscription", () => {
    beforeEach(() => {
        cleanup();
        bus = new FakeBus();
        // Atualiza o app mantendo a mesma referência
        app.eventBus = bus as any;
    });

    it("atualiza mapa ao receber componentUpdated", async () => {
        const { useComponentSubscription } = await import(
            "@presentation/hooks/useComponentSubscription"
        );
        const updated = {
            type: "TransformComponent",
            position: { x: 5, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
        };

        /**
         * Componente de teste que exibe a posição X
         */
        function Probe() {
            const map = useComponentSubscription<any>("TransformComponent");
            const x = map.get("e1")?.position.x ?? 0;
            return <span data-testid="x">{x}</span>;
        }

        render(<Probe />);
        expect(screen.getByTestId("x").textContent).toBe("0");

        await act(async () => {
            bus.emit("componentUpdated", { entityId: "e1", component: updated });
        });

        await waitFor(() => {
            expect(screen.getByTestId("x").textContent).toBe("5");
        });
    });
});
