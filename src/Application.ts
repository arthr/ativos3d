import type { CameraDimensions } from "@core/types/camera";
import { EventBus } from "@core/events/EventBus";
import { CommandStack } from "@core/commands";
import { EntityManager } from "@domain/entities";
import { CameraSystem, CameraController, RenderLoop } from "@infrastructure/render";
import { InputManager, InputMapper } from "@infrastructure/input";
import { ToolManager } from "@application/tools/ToolManager";
import { registerBasicTools } from "@application/tools/basic";
import { ValidationSystem } from "@application/validation/ValidationSystem";
import { createPlacementValidator } from "@application/validation/validators/PlacementValidator";
import { TransformComponent } from "@domain/components/TransformComponent";

/**
 * Classe principal da aplicação
 */
export class Application {
    private readonly container = new Map<DependencyKey, DependencyMap[DependencyKey]>();
    private readonly resizeTarget: Window;
    private readonly handleResize: () => void;

    /**
     * Inicializa o container de dependências
     */
    constructor(
        eventBus: EventBus,
        canvasSize: CameraDimensions,
        inputTarget: HTMLElement | Window = window,
    ) {
        this.resizeTarget = inputTarget instanceof Window ? inputTarget : window;
        this.initializeContainer(eventBus, canvasSize, inputTarget);
        this.handleResize = (): void => {
            const cameraSystem = this.resolve("cameraSystem");
            cameraSystem.resize({
                width: this.resizeTarget.innerWidth,
                height: this.resizeTarget.innerHeight,
            });
        };
        this.resizeTarget.addEventListener("resize", this.handleResize);
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
    private initializeContainer(
        eventBus: EventBus,
        canvasSize: CameraDimensions,
        inputTarget: HTMLElement | Window,
    ): DependencyMap {
        const commandStack = new CommandStack(eventBus);
        const entityManager = EntityManager.getInstance({}, { eventBus });
        const cameraSystem = CameraSystem.getInstance({}, { eventBus, canvasSize });
        const cameraController = new CameraController({ eventBus, cameraSystem });
        // Inicializa o RenderLoop (usado pelo R3F)
        const renderLoop = new RenderLoop();
        const inputManager = new InputManager({ eventBus, cameraSystem, target: inputTarget });
        const inputMapper = new InputMapper({ eventBus });
        const toolManager = new ToolManager(eventBus);
        registerBasicTools(toolManager, eventBus);
        const validationSystem = ValidationSystem.getInstance(
            eventBus,
            (id) => entityManager.getEntity(id) ?? null,
        );
        const placementValidator = createPlacementValidator({
            getLot: () => ({ width: 100, depth: 100 }), // TODO: substituir quando houver informação do lote real
            getExistingEntities: () => entityManager.getAllEntities(),
            getFootprint: () => null, // TODO: Implementar recuperação de footprint
            getTransform: (entity) => {
                const transform = entity.getComponent<TransformComponent>("TransformComponent");
                if (!transform) return null;
                return { position: transform.position, rotation: transform.rotation };
            },
        });
        validationSystem.addValidator(placementValidator);

        this.container.set("eventBus", eventBus);
        this.container.set("commandStack", commandStack);
        this.container.set("entityManager", entityManager);
        this.container.set("cameraSystem", cameraSystem);
        this.container.set("cameraController", cameraController);
        this.container.set("renderLoop", renderLoop);
        this.container.set("inputManager", inputManager);
        this.container.set("inputMapper", inputMapper);
        this.container.set("toolManager", toolManager);
        this.container.set("validationSystem", validationSystem);

        return {
            eventBus,
            commandStack,
            entityManager,
            cameraSystem,
            cameraController,
            renderLoop,
            inputManager,
            inputMapper,
            toolManager,
            validationSystem,
        } as DependencyMap;
    }

    /**
     * Remove listeners e finaliza sistemas ativos
     */
    dispose(): void {
        this.resolve("cameraController").dispose();
        this.resolve("inputManager").dispose();
        this.resolve("inputMapper").dispose();
        this.resolve("entityManager").clear();
        this.resolve("eventBus").clearAll();
        this.resizeTarget.removeEventListener("resize", this.handleResize);
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
    cameraController: CameraController;
    renderLoop: RenderLoop;
    inputManager: InputManager;
    inputMapper: InputMapper;
    toolManager: ToolManager;
    validationSystem: ValidationSystem;
};

/**
 * Chave da dependência
 */
type DependencyKey = keyof DependencyMap;
