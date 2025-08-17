import { describe, it, expect, beforeEach, vi } from "vitest";
import { EventBus } from "@core/events/EventBus";
import { Vec2Factory } from "@core/geometry/factories/Vec2Factory";
import { Vec3Factory } from "@core/geometry/factories/Vec3Factory";

describe("EventBus", () => {
    let eventBus: EventBus;

    beforeEach(() => {
        eventBus = new EventBus();
    });

    describe("Sistema de Assinatura/Desassinatura", () => {
        it("deve registrar um listener e retornar função de unsubscribe", () => {
            const listener = vi.fn();
            const payload = {
                worldPosition: Vec3Factory.create(1, 2, 3),
                screenPosition: Vec2Factory.create(100, 200),
                ndc: Vec2Factory.create(0.5, 0.5),
            };

            const unsubscribe = eventBus.on("pointerMove", listener);

            expect(typeof unsubscribe).toBe("function");
            expect(eventBus.listenerCount("pointerMove")).toBe(1);

            eventBus.emit("pointerMove", payload);
            expect(listener).toHaveBeenCalledWith(payload);
        });

        it("deve remover listener quando unsubscribe é chamado", () => {
            const listener = vi.fn();
            const payload = {
                worldPosition: Vec3Factory.create(1, 2, 3),
                screenPosition: Vec2Factory.create(100, 200),
                ndc: Vec2Factory.create(0.5, 0.5),
            };

            const unsubscribe = eventBus.on("pointerMove", listener);
            expect(eventBus.listenerCount("pointerMove")).toBe(1);

            unsubscribe();
            expect(eventBus.listenerCount("pointerMove")).toBe(0);

            eventBus.emit("pointerMove", payload);
            expect(listener).not.toHaveBeenCalled();
        });

        it("deve registrar múltiplos listeners para o mesmo evento", () => {
            const listener1 = vi.fn();
            const listener2 = vi.fn();
            const payload = {
                worldPosition: Vec3Factory.create(1, 2, 3),
                screenPosition: Vec2Factory.create(100, 200),
                ndc: Vec2Factory.create(0.5, 0.5),
            };

            eventBus.on("pointerMove", listener1);
            eventBus.on("pointerMove", listener2);

            expect(eventBus.listenerCount("pointerMove")).toBe(2);

            eventBus.emit("pointerMove", payload);
            expect(listener1).toHaveBeenCalledWith(payload);
            expect(listener2).toHaveBeenCalledWith(payload);
        });

        it("deve remover apenas o listener específico quando unsubscribe é chamado", () => {
            const listener1 = vi.fn();
            const listener2 = vi.fn();
            const payload = {
                worldPosition: Vec3Factory.create(1, 2, 3),
                screenPosition: Vec2Factory.create(100, 200),
                ndc: Vec2Factory.create(0.5, 0.5),
            };

            const unsubscribe1 = eventBus.on("pointerMove", listener1);
            eventBus.on("pointerMove", listener2);

            expect(eventBus.listenerCount("pointerMove")).toBe(2);

            unsubscribe1();
            expect(eventBus.listenerCount("pointerMove")).toBe(1);

            eventBus.emit("pointerMove", payload);
            expect(listener1).not.toHaveBeenCalled();
            expect(listener2).toHaveBeenCalledWith(payload);
        });

        it("deve funcionar com once() - listener executado apenas uma vez", () => {
            const listener = vi.fn();
            const payload = {
                worldPosition: Vec3Factory.create(1, 2, 3),
                screenPosition: Vec2Factory.create(100, 200),
                ndc: Vec2Factory.create(0.5, 0.5),
            };

            eventBus.once("pointerMove", listener);
            expect(eventBus.listenerCount("pointerMove")).toBe(1);

            eventBus.emit("pointerMove", payload);
            expect(listener).toHaveBeenCalledWith(payload);
            expect(eventBus.listenerCount("pointerMove")).toBe(0);

            eventBus.emit("pointerMove", payload);
            expect(listener).toHaveBeenCalledTimes(1);
        });

        it("deve remover listener específico com off()", () => {
            const listener = vi.fn();
            const payload = {
                worldPosition: Vec3Factory.create(1, 2, 3),
                screenPosition: Vec2Factory.create(100, 200),
                ndc: Vec2Factory.create(0.5, 0.5),
            };

            eventBus.on("pointerMove", listener);
            expect(eventBus.listenerCount("pointerMove")).toBe(1);

            eventBus.off("pointerMove", listener);
            expect(eventBus.listenerCount("pointerMove")).toBe(0);

            eventBus.emit("pointerMove", payload);
            expect(listener).not.toHaveBeenCalled();
        });

        it("deve limpar todos os listeners de um tipo de evento", () => {
            const listener1 = vi.fn();
            const listener2 = vi.fn();

            eventBus.on("pointerMove", listener1);
            eventBus.on("pointerMove", listener2);
            eventBus.on("keyDown", listener1);

            expect(eventBus.listenerCount("pointerMove")).toBe(2);
            expect(eventBus.listenerCount("keyDown")).toBe(1);

            eventBus.clear("pointerMove");
            expect(eventBus.listenerCount("pointerMove")).toBe(0);
            expect(eventBus.listenerCount("keyDown")).toBe(1);
        });

        it("deve limpar todos os listeners de todos os eventos", () => {
            const listener = vi.fn();

            eventBus.on("pointerMove", listener);
            eventBus.on("keyDown", listener);
            eventBus.on("click", listener);

            expect(eventBus.getEventTypes().length).toBe(3);

            eventBus.clearAll();
            expect(eventBus.getEventTypes().length).toBe(0);
        });

        it("deve retornar tipos de eventos que têm listeners", () => {
            const listener = vi.fn();

            eventBus.on("pointerMove", listener);
            eventBus.on("keyDown", listener);

            const eventTypes = eventBus.getEventTypes();
            expect(eventTypes).toContain("pointerMove");
            expect(eventTypes).toContain("keyDown");
            expect(eventTypes.length).toBe(2);
        });

        it("deve verificar se há listeners para um tipo de evento", () => {
            const listener = vi.fn();

            expect(eventBus.hasListeners("pointerMove")).toBe(false);

            eventBus.on("pointerMove", listener);
            expect(eventBus.hasListeners("pointerMove")).toBe(true);

            eventBus.clear("pointerMove");
            expect(eventBus.hasListeners("pointerMove")).toBe(false);
        });

        it("deve lidar com erros nos listeners e emitir evento de erro", () => {
            const errorListener = vi.fn();
            const failingListener = vi.fn().mockImplementation(() => {
                throw new Error("Erro no listener");
            });
            const payload = {
                worldPosition: Vec3Factory.create(1, 2, 3),
                screenPosition: Vec2Factory.create(100, 200),
                ndc: Vec2Factory.create(0.5, 0.5),
            };

            eventBus.on("error", errorListener);
            eventBus.on("pointerMove", failingListener);

            eventBus.emit("pointerMove", payload);

            expect(errorListener).toHaveBeenCalledWith({
                message: expect.stringContaining("Erro no listener do evento pointerMove"),
                code: "LISTENER_ERROR",
            });
        });

        it("deve emitir eventos com delay usando emitAsync", () => {
            const listener = vi.fn();
            const payload = {
                worldPosition: Vec3Factory.create(1, 2, 3),
                screenPosition: Vec2Factory.create(100, 200),
                ndc: Vec2Factory.create(0.5, 0.5),
            };

            eventBus.on("pointerMove", listener);

            eventBus.emitAsync("pointerMove", payload, 10);
            expect(listener).not.toHaveBeenCalled();

            // Aguarda o delay
            return new Promise((resolve) => {
                setTimeout(() => {
                    expect(listener).toHaveBeenCalledWith(payload);
                    resolve(undefined);
                }, 20);
            });
        });

        it("deve emitir eventos imediatamente quando delay é 0 ou negativo", () => {
            const listener = vi.fn();
            const payload = {
                worldPosition: Vec3Factory.create(1, 2, 3),
                screenPosition: Vec2Factory.create(100, 200),
                ndc: Vec2Factory.create(0.5, 0.5),
            };

            eventBus.on("pointerMove", listener);

            eventBus.emitAsync("pointerMove", payload, 0);
            expect(listener).toHaveBeenCalledWith(payload);

            eventBus.emitAsync("pointerMove", payload, -10);
            expect(listener).toHaveBeenCalledTimes(2);
        });
    });

    describe("Funcionalidades Avançadas", () => {
        it("deve manter listeners durante a execução se novos forem adicionados", () => {
            const listener1 = vi.fn();
            const listener2 = vi.fn();
            const payload = {
                worldPosition: Vec3Factory.create(1, 2, 3),
                screenPosition: Vec2Factory.create(100, 200),
                ndc: Vec2Factory.create(0.5, 0.5),
            };

            eventBus.on("pointerMove", listener1);

            // Listener que adiciona outro listener durante a execução
            const dynamicListener = vi.fn(() => {
                eventBus.on("pointerMove", listener2);
            });

            eventBus.on("pointerMove", dynamicListener);

            eventBus.emit("pointerMove", payload);

            expect(listener1).toHaveBeenCalledWith(payload);
            expect(dynamicListener).toHaveBeenCalledWith(payload);
            expect(listener2).not.toHaveBeenCalled(); // Não deve ser chamado na primeira execução
        });

        it("deve lidar com unsubscribe durante a execução", () => {
            const listener1 = vi.fn();
            const listener2 = vi.fn();
            const payload = {
                worldPosition: Vec3Factory.create(1, 2, 3),
                screenPosition: Vec2Factory.create(100, 200),
                ndc: Vec2Factory.create(0.5, 0.5),
            };

            eventBus.on("pointerMove", listener1);
            const unsubscribe2 = eventBus.on("pointerMove", listener2);

            // Listener que remove outro listener durante a execução
            const removalListener = vi.fn(() => {
                unsubscribe2();
            });

            eventBus.on("pointerMove", removalListener);

            eventBus.emit("pointerMove", payload);

            expect(listener1).toHaveBeenCalledWith(payload);
            expect(listener2).toHaveBeenCalledWith(payload);
            expect(removalListener).toHaveBeenCalledWith(payload);
        });
    });
});
