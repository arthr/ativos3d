/**
 * TODO: Refatorar para estar de acordo com o Roadmap de Refatoração do projeto.
 * Arquivo `REFAC.md` para mais detalhes.
 */

import { EventBus } from "@core/events/EventBus";
import { CommandStack } from "@core/commands";
import { EntityManager } from "@domain/entities";

/**
 * Classe principal da aplicação
 */
export class Application {
    private readonly container = new Map<DependencyKey, DependencyValue>();

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
    resolve<K extends DependencyKey>(key: K): DependencyValue {
        const dependency = this.container.get(key);
        if (!dependency) {
            throw new Error(`Dependência não encontrada: ${key}`);
        }
        return dependency;
    }

    /**
     * Inicializa o container de dependências
     */
    private initializeContainer(eventBus: EventBus): DependencyMap {
        const commandStack = new CommandStack();
        const entityManager = EntityManager.getInstance(undefined, { eventBus });

        this.container.set("eventBus", eventBus);
        this.container.set("commandStack", commandStack);
        this.container.set("entityManager", entityManager);

        return { eventBus, commandStack, entityManager };
    }
}

/**
 * Mapa de dependências
 */
type DependencyMap = {
    eventBus: EventBus;
    commandStack: CommandStack;
    entityManager: EntityManager;
};

/**
 * Chave da dependência
 */
type DependencyKey = keyof DependencyMap;

/**
 * Valor da dependência
 */
type DependencyValue = DependencyMap[DependencyKey];
