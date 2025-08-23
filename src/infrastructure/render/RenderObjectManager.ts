import type { EntityId } from "@core/types/ecs/EntityId";
import type { RenderComponent } from "@core/types/components/RenderComponent";
import type { EventBus } from "@core/events/EventBus";

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
    private readonly eventBus: EventBus;

    private constructor(eventBusInstance: EventBus) {
        this.eventBus = eventBusInstance;
    }

    /**
     * Obtém a instância singleton do RenderObjectManager
     */
    public static getInstance(eventBusInstance: EventBus): RenderObjectManager {
        if (!RenderObjectManager.instance) {
            RenderObjectManager.instance = new RenderObjectManager(eventBusInstance);
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
     * Se o objeto não estiver registrado, não faz nada
     */
    public updateObject(entityId: EntityId, component: RenderComponent): void {
        if (!this.objects.has(entityId)) return;
        this.objects.set(entityId, component);
        this.eventBus.emit("renderObjectUpdated", { entityId });
    }

    /**
     * Remove um objeto já registrado
     * Se o objeto não estiver registrado, não faz nada
     */
    public removeObject(entityId: EntityId): void {
        if (!this.objects.delete(entityId)) return;
        this.eventBus.emit("renderObjectRemoved", { entityId });
    }

    /**
     * Obtém o componente de renderização de um objeto
     * Se o objeto não estiver registrado, retorna undefined
     */
    public getObjectComponent(entityId: EntityId): RenderComponent | undefined {
        return this.objects.get(entityId);
    }

    /**
     * Verifica se um objeto está registrado
     * Se o objeto não estiver registrado, retorna false
     */
    public hasObject(entityId: EntityId): boolean {
        return this.objects.has(entityId);
    }

    /**
     * Obtém todos os objetos registrados
     * Se não houver objetos registrados, retorna um array vazio
     */
    public getObjects(): RenderObject[] {
        return Array.from(this.objects.entries()).map(([entityId, component]) => ({
            entityId,
            component,
        }));
    }

    /**
     * Obtém o número de objetos registrados
     * Se não houver objetos registrados, retorna 0
     */
    public getObjectCount(): number {
        return this.objects.size;
    }

    /**
     * Remove todos os objetos registrados
     * emitindo eventos de remoção
     * Se não houver objetos registrados, não faz nada
     */
    public clearObjects(): void {
        for (const entityId of this.objects.keys()) {
            this.eventBus.emit("renderObjectRemoved", { entityId });
        }
        this.objects.clear();
    }
}
