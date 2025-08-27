import { EventBus } from "@core/events/EventBus";
import { Application } from "./Application";

/**
 * Instância única da aplicação e seu EventBus
 */
const eventBus = new EventBus();
export const application = new Application(eventBus);
