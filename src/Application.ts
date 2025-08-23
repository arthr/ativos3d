/**
 * TODO: Refatorar para estar de acordo com o Roadmap de Refatoração do projeto.
 * Arquivo `REFAC.md` para mais detalhes.
 */

import { EventBus } from "@core/events/EventBus";
import { CommandStack } from "@core/commands";
import { EntityManager } from "@domain/entities";
import { createWebGLRenderAdapter, RenderSystem } from "@infrastructure/render";

import { Scene, Camera } from "three";

/**
 * Classe principal da aplicação
 */
export class Application {
    private readonly container = new Map<DependencyKey, DependencyMap[DependencyKey]>();

    /**
     * Inicializa o container de dependências
     */
    constructor(eventBus: EventBus) {
        this.initializeContainer(eventBus);
    }

    /**
     * Resolve uma dependência do container
     * @param key - A chave da dependência
     * @returns A dependência resolvida
     */
    resolve<K extends DependencyKey>(key: K): DependencyMap[K] {
        const dependency = this.container.get(key);
        if (!dependency) {
            throw new Error(`Dependência não encontrada: ${key}`);
        }
        return dependency as DependencyMap[K];
    }

    /**
     * Inicializa o container de dependências
     */
    private initializeContainer(eventBus: EventBus): DependencyMap {
        const commandStack = new CommandStack();
        const entityManager = EntityManager.getInstance({}, { eventBus });
        const renderSystem = RenderSystem.getInstance(
            {},
            {
                eventBus,
                adapter: createWebGLRenderAdapter(),
                scene: new Scene(),
                camera: new Camera(),
            },
        );

        this.container.set("eventBus", eventBus);
        this.container.set("commandStack", commandStack);
        this.container.set("entityManager", entityManager);
        this.container.set("renderSystem", renderSystem);

        return { eventBus, commandStack, entityManager, renderSystem };
    }
}

/**
 * Mapa de dependências
 */
type DependencyMap = {
    eventBus: EventBus;
    commandStack: CommandStack;
    entityManager: EntityManager;
    renderSystem: RenderSystem;
};

/**
 * Chave da dependência
 */
type DependencyKey = keyof DependencyMap;
