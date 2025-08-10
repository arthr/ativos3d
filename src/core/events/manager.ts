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
