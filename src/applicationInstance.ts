import type { CameraDimensions } from "@core/types/camera";
import { EventBus } from "@core/events/EventBus";
import { Application } from "./Application";

let instance: Application;

/**
 * Inicializa a aplicação
 */
export function initializeApplication(
    size: CameraDimensions,
    target: HTMLElement | Window = window,
): Application {
    instance = new Application(new EventBus(), size, target);
    return instance;
}

export { instance as application };
