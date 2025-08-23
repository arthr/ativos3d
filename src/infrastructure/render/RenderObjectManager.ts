import type { EntityId } from "@core/types/Entity";
import type { RenderComponent } from "@core/types/components";
import { eventBus } from "@core/events/EventBus";

/**
 * Objeto renderizável registrado no sistema de renderização
 */
export interface RenderObject {
    readonly entityId: EntityId;
    readonly component: RenderComponent;
}

/**
 * Gerenciador de objetos renderizáveis
 *
 * Responsável por registrar, atualizar e remover objetos
 * que devem ser renderizados pelo RenderSystem.
 */
export class RenderObjectManager {
    private static instance: RenderObjectManager | null = null;
    private readonly objects: Map<EntityId, RenderComponent> = new Map();
    private readonly eventBus: typeof eventBus;

    private constructor(eventBusInstance: typeof eventBus) {
        this.eventBus = eventBusInstance;
    }

    /**
     * Obtém a instância singleton do RenderObjectManager
     */
    public static getInstance(eventBusInstance?: typeof eventBus): RenderObjectManager {
        if (!RenderObjectManager.instance) {
            RenderObjectManager.instance = new RenderObjectManager(eventBusInstance ?? eventBus);
        }
        return RenderObjectManager.instance;
    }

    /**
     * Reseta a instância singleton (apenas para testes)
     */
    public static resetInstance(): void {
        RenderObjectManager.instance = null;
    }

    /**
     * Registra um objeto para renderização
     */
    public registerObject(entityId: EntityId, component: RenderComponent): void {
        this.objects.set(entityId, component);
        this.eventBus.emit("renderObjectAdded", { entityId });
    }

    /**
     * Atualiza um objeto já registrado
     */
    public updateObject(entityId: EntityId, component: RenderComponent): void {
        if (!this.objects.has(entityId)) {
            this.registerObject(entityId, component);
            return;
        }

        this.objects.set(entityId, component);
        this.eventBus.emit("renderObjectUpdated", { entityId });
    }

    /**
     * Remove um objeto já registrado
     */
    public removeObject(entityId: EntityId): void {
        if (!this.objects.delete(entityId)) return;
        this.eventBus.emit("renderObjectRemoved", { entityId });
    }

    /**
     * Obtém o componente de renderização de um objeto
     */
    public getObjectComponent(entityId: EntityId): RenderComponent | undefined {
        return this.objects.get(entityId);
    }

    /**
     * Verifica se um objeto está registrado
     */
    public hasObject(entityId: EntityId): boolean {
        return this.objects.has(entityId);
    }

    /**
     * Obtém todos os objetos registrados
     */
    public getObjects(): RenderObject[] {
        return Array.from(this.objects.entries()).map(([entityId, component]) => ({
            entityId,
            component,
        }));
    }

    /**
     * Obtém o número de objetos registrados
     */
    public getObjectCount(): number {
        return this.objects.size;
    }

    /**
     * Remove todos os objetos registrados
     */
    public clearObjects(): void {
        this.objects.clear();
    }
}
