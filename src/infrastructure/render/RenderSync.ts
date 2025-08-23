import type { EventBus } from "@core/events/EventBus";
import type { RenderObjectManager } from "./RenderObjectManager";
import type { EntityEvents } from "@core/types/events/EntityEvents";
import type { RenderComponent } from "@core/types/components/RenderComponent";
import type { Component } from "@core/types/ecs/Component";
import type { Unsubscribe } from "@core/types/Events";

/**
 * Sincroniza o RenderObjectManager com o resto do lifecycle da aplicação
 */
export class RenderSync {
    private readonly renderObjectManager: RenderObjectManager;
    private readonly unsubscribes: Unsubscribe[];

    /**
     * Registra listeners para manter o RenderObjectManager sincronizado
     */
    constructor(eventBus: EventBus, renderObjectManager: RenderObjectManager) {
        this.renderObjectManager = renderObjectManager;
        this.unsubscribes = [
            eventBus.on("componentAdded", this.handleComponentAdded),
            eventBus.on("componentRemoved", this.handleComponentRemoved),
            eventBus.on("entityDestroyed", this.handleEntityDestroyed),
        ];
    }

    /**
     * Remove os listeners registrados
     */
    public dispose(): void {
        for (const unsubscribe of this.unsubscribes) {
            unsubscribe();
        }
    }

    private isRenderComponent(component: Component): component is RenderComponent {
        return component.type === "RenderComponent";
    }

    /**
     * Lida com o evento de adição de um componente
     * registrando o objeto no RenderObjectManager
     */
    private handleComponentAdded = ({
        entityId,
        component,
    }: EntityEvents["componentAdded"]): void => {
        if (!this.isRenderComponent(component)) return;
        this.renderObjectManager.registerObject(entityId, component);
    };

    /**
     * Lida com o evento de remoção de um componente
     * removendo o objeto do RenderObjectManager
     */
    private handleComponentRemoved = ({
        entityId,
        componentType,
    }: EntityEvents["componentRemoved"]): void => {
        if (!this.renderObjectManager.hasObject(entityId)) return;
        if (componentType !== "RenderComponent") return;
        this.renderObjectManager.removeObject(entityId);
    };

    /**
     * Lida com o evento de destruição de uma entidade
     * removendo qualquer objeto associado a ela
     */
    private handleEntityDestroyed = ({ entityId }: EntityEvents["entityDestroyed"]): void => {
        this.renderObjectManager.removeObject(entityId);
    };
}
