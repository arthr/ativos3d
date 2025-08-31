import type { CameraDimensions } from "@core/types/camera";
import { EventBus } from "@core/events/EventBus";
import { Application } from "./Application";

/**
 * Instância única da aplicação e seu EventBus
 */
const eventBus = new EventBus();
const canvasSize: CameraDimensions = { width: window.innerWidth, height: window.innerHeight };
export const application = new Application(eventBus, canvasSize, window);
