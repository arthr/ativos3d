export type Unsubscribe = () => void;

export class EventManager<EventMap extends Record<string, unknown>> {
  private listeners: { [K in keyof EventMap]?: Array<(payload: EventMap[K]) => void> } = {};

  on<K extends keyof EventMap>(event: K, listener: (payload: EventMap[K]) => void): Unsubscribe {
    const arr = (this.listeners[event] ??= []);
    arr.push(listener);
    return () => this.off(event, listener);
  }

  once<K extends keyof EventMap>(event: K, listener: (payload: EventMap[K]) => void): Unsubscribe {
    const wrapper = (payload: EventMap[K]) => {
      this.off(event, wrapper);
      listener(payload);
    };
    return this.on(event, wrapper);
  }

  off<K extends keyof EventMap>(event: K, listener: (payload: EventMap[K]) => void): void {
    const arr = this.listeners[event];
    if (!arr) return;
    const idx = arr.indexOf(listener);
    if (idx >= 0) arr.splice(idx, 1);
  }

  emit<K extends keyof EventMap>(event: K, payload: EventMap[K]): void {
    const arr = this.listeners[event];
    if (!arr || arr.length === 0) return;
    // Copiar para evitar mutação durante iteração
    [...arr].forEach((fn) => fn(payload));
  }
}

export type AppEvents = {
  pointerNdc: { x: number; y: number };
  groundPoint: { x: number; y: number; z: number } | null;
  keyDown: { code: string; shift: boolean; alt: boolean; ctrl: boolean; meta: boolean };
  keyUp: { code: string; shift: boolean; alt: boolean; ctrl: boolean; meta: boolean };
  pointerDown: {
    button: number;
    ndc: { x: number; y: number };
    ground: { x: number; y: number; z: number } | null;
    hudTarget: boolean;
    shift: boolean;
    alt: boolean;
    ctrl: boolean;
    meta: boolean;
  };
  pointerUp: {
    button: number;
    ndc: { x: number; y: number };
    ground: { x: number; y: number; z: number } | null;
    hudTarget: boolean;
    shift: boolean;
    alt: boolean;
    ctrl: boolean;
    meta: boolean;
  };
  click: {
    button: number;
    ndc: { x: number; y: number };
    ground: { x: number; y: number; z: number } | null;
    hudTarget: boolean;
  };
};

export const eventBus = new EventManager<AppEvents>();
