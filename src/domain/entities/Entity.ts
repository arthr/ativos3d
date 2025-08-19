import type { Entity as EntityInterface, EntityId, Component } from "@core/types";

/**
 * Implementação base da Entity seguindo Domain-Driven Design
 *
 * Esta classe implementa a interface Entity e fornece funcionalidades
 * para gerenciar componentes de forma imutável e thread-safe.
 */
export class Entity implements EntityInterface {
    public readonly id: EntityId;
    public readonly components: Map<string, Component>;

    constructor(id: EntityId, components: Map<string, Component> = new Map()) {
        this.id = id;
        this.components = new Map(components);
    }

    /**
     * Adiciona um componente à entidade
     * Retorna uma nova instância da entidade (imutável)
     */
    public addComponent(component: Component): Entity {
        const newComponents = new Map(this.components);
        newComponents.set(component.type, component);
        return new Entity(this.id, newComponents);
    }

    /**
     * Remove um componente da entidade
     * Retorna uma nova instância da entidade (imutável)
     */
    public removeComponent(componentType: string): Entity {
        const newComponents = new Map(this.components);
        newComponents.delete(componentType);
        return new Entity(this.id, newComponents);
    }

    /**
     * Obtém um componente específico
     */
    public getComponent<T extends Component>(componentType: string): T | undefined {
        return this.components.get(componentType) as T | undefined;
    }

    /**
     * Verifica se a entidade possui um componente específico
     */
    public hasComponent(componentType: string): boolean {
        return this.components.has(componentType);
    }

    /**
     * Obtém todos os tipos de componentes da entidade
     */
    public getComponentTypes(): string[] {
        return Array.from(this.components.keys());
    }

    /**
     * Obtém todos os componentes da entidade
     */
    public getAllComponents(): Component[] {
        return Array.from(this.components.values());
    }

    /**
     * Verifica se a entidade possui todos os componentes especificados
     */
    public hasAllComponents(componentTypes: string[]): boolean {
        return componentTypes.every((type) => this.hasComponent(type));
    }

    /**
     * Verifica se a entidade possui pelo menos um dos componentes especificados
     */
    public hasAnyComponent(componentTypes: string[]): boolean {
        return componentTypes.some((type) => this.hasComponent(type));
    }

    /**
     * Obtém múltiplos componentes de uma vez
     */
    public getComponents<T extends Component>(componentTypes: string[]): T[] {
        return componentTypes
            .map((type) => this.getComponent<T>(type))
            .filter((component): component is T => component !== undefined);
    }

    /**
     * Cria uma cópia da entidade
     */
    public clone(): Entity {
        return new Entity(this.id, new Map(this.components));
    }

    /**
     * Verifica se duas entidades são iguais
     */
    public equals(other: EntityInterface): boolean {
        if (this.id !== other.id) return false;
        if (this.components.size !== other.components.size) return false;

        for (const [key, value] of this.components) {
            const otherValue = other.components.get(key);
            if (!otherValue || otherValue !== value) return false;
        }

        return true;
    }

    /**
     * Converte a entidade para string (para debugging)
     */
    public toString(): string {
        const componentTypes = this.getComponentTypes();
        return `Entity(${this.id})[${componentTypes.join(", ")}]`;
    }

    /**
     * Cria uma entidade vazia
     */
    public static create(id: EntityId): Entity {
        return new Entity(id);
    }

    /**
     * Cria uma entidade com componentes iniciais
     */
    public static createWithComponents(id: EntityId, components: Component[]): Entity {
        const componentsMap = new Map();
        components.forEach((component) => {
            componentsMap.set(component.type, component);
        });
        return new Entity(id, componentsMap);
    }
}
