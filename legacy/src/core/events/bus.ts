import { EventManager } from "./manager";
import type { AppEvents } from "./types";

export const eventBus = new EventManager<AppEvents>();
