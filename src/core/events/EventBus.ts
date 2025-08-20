import type { SystemEventMap, EventListener, Unsubscribe } from "@core/types";

/**
 * Gerenciador de eventos do sistema
 */
export class EventBus {
    private readonly listeners = new Map<keyof SystemEventMap, EventListener[]>();

    /**
     * Registra um listener para um tipo de evento
     */
    on<K extends keyof SystemEventMap>(
        eventType: K,
        listener: EventListener<SystemEventMap[K]>,
    ): Unsubscribe {
        if (!this.listeners.has(eventType)) {
            this.listeners.set(eventType, []);
        }

        const eventListeners = this.listeners.get(eventType)!;
        eventListeners.push(listener as EventListener);

        // Retorna função para cancelar a inscrição
        return () => {
            const index = eventListeners.indexOf(listener as EventListener);
            if (index > -1) {
                eventListeners.splice(index, 1);
            }
        };
    }

    /**
     * Registra um listener que será executado apenas uma vez
     */
    once<K extends keyof SystemEventMap>(
        eventType: K,
        listener: EventListener<SystemEventMap[K]>,
    ): Unsubscribe {
        const wrappedListener = (payload: SystemEventMap[K]): void => {
            listener(payload);
            unsubscribe();
        };

        const unsubscribe = this.on(eventType, wrappedListener);
        return unsubscribe;
    }

    /**
     * Remove um listener específico
     */
    off<K extends keyof SystemEventMap>(
        eventType: K,
        listener: EventListener<SystemEventMap[K]>,
    ): void {
        const eventListeners = this.listeners.get(eventType);
        if (!eventListeners) return;

        const index = eventListeners.indexOf(listener as EventListener);
        if (index > -1) {
            eventListeners.splice(index, 1);
        }
    }

    /**
     * Emite um evento para todos os listeners registrados
     */
    emit<K extends keyof SystemEventMap>(eventType: K, payload: SystemEventMap[K]): void {
        const eventListeners = this.listeners.get(eventType);
        if (!eventListeners || eventListeners.length === 0) return;

        // Copia o array para evitar problemas se listeners forem removidos durante a execução
        const listenersCopy = [...eventListeners];

        for (const listener of listenersCopy) {
            try {
                listener(payload);
            } catch (error) {
                if (eventType === "error") continue;
                // Emite evento de erro
                this.emit("error", {
                    message: `Erro no listener do evento ${eventType}: ${error}`,
                    code: "LISTENER_ERROR",
                });
            }
        }
    }

    /**
     * Emite um evento com delay
     */
    emitAsync<K extends keyof SystemEventMap>(
        eventType: K,
        payload: SystemEventMap[K],
        delay: number = 0,
    ): void {
        if (delay <= 0) {
            this.emit(eventType, payload);
        } else {
            setTimeout(() => {
                this.emit(eventType, payload);
            }, delay);
        }
    }

    /**
     * Remove todos os listeners de um tipo de evento
     */
    clear<K extends keyof SystemEventMap>(eventType: K): void {
        this.listeners.delete(eventType);
    }

    /**
     * Remove todos os listeners de todos os eventos
     */
    clearAll(): void {
        this.listeners.clear();
    }

    /**
     * Retorna o número de listeners para um tipo de evento
     */
    listenerCount<K extends keyof SystemEventMap>(eventType: K): number {
        const eventListeners = this.listeners.get(eventType);
        return eventListeners ? eventListeners.length : 0;
    }

    /**
     * Retorna todos os tipos de eventos que têm listeners
     */
    getEventTypes(): (keyof SystemEventMap)[] {
        return Array.from(this.listeners.keys());
    }

    /**
     * Verifica se há listeners para um tipo de evento
     */
    hasListeners<K extends keyof SystemEventMap>(eventType: K): boolean {
        return this.listenerCount(eventType) > 0;
    }
}

/**
 * Instância global do EventBus
 */
export const eventBus = new EventBus();
