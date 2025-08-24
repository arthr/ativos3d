/**
 * TODO: Refatorar para estar de acordo com o Roadmap de Refatoração do projeto.
 * Arquivo `REFAC.md` para mais detalhes.
 */

import { EventBus } from "@core/events/EventBus";
import { CommandStack } from "@core/commands";
import { EntityManager } from "@domain/entities";
import {
    createWebGLRenderAdapter,
    RenderSystem,
    RenderObjectManager,
    RenderSync,
    CameraSystem,
} from "@infrastructure/render";

import { Scene } from "three";

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
        const renderObjectManager = RenderObjectManager.getInstance(eventBus);
        const cameraSystem = CameraSystem.getInstance({}, { eventBus });

        // Sincroniza o RenderObjectManager com o resto do lifecycle da aplicação
        new RenderSync(eventBus, renderObjectManager);

        // Inicializa o RenderSystem
        const renderSystem = RenderSystem.getInstance(
            {},
            {
                eventBus,
                adapter: createWebGLRenderAdapter(),
                scene: new Scene(),
                cameraSystem,
            },
        );

        this.container.set("eventBus", eventBus);
        this.container.set("commandStack", commandStack);
        this.container.set("entityManager", entityManager);
        this.container.set("cameraSystem", cameraSystem);
        this.container.set("renderSystem", renderSystem);

        return { eventBus, commandStack, entityManager, cameraSystem, renderSystem };
    }
}

/**
 * Mapa de dependências
 */
type DependencyMap = {
    eventBus: EventBus;
    commandStack: CommandStack;
    entityManager: EntityManager;
    cameraSystem: CameraSystem;
    renderSystem: RenderSystem;
};

/**
 * Chave da dependência
 */
type DependencyKey = keyof DependencyMap;
