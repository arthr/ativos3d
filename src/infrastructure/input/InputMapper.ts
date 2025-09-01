import type { InputMapping } from "@core/types/input";
import type { InputEvents } from "@core/types/events/InputEvents";
import { EventBus } from "@core/events/EventBus";

/**
 * Mapeia eventos de teclado para ações do sistema.
 */
export class InputMapper {
    private readonly eventBus: EventBus;
    private readonly mappings: InputMapping[] = [];
    private context: string | undefined;
    private unsubscribe: () => void;

    constructor(dependencies: { eventBus: EventBus; mappings?: InputMapping[] }) {
        this.eventBus = dependencies.eventBus;
        this.mappings.push(...(dependencies.mappings ?? []));
        this.unsubscribe = this.eventBus.on("keyDown", this.handleKeyDown);
    }

    /** Registra um novo mapeamento */
    registerMapping(mapping: InputMapping): void {
        this.mappings.push(mapping);
    }

    /** Define o contexto ativo */
    setContext(context?: string): void {
        this.context = context;
    }

    /** Remove o listener registrado */
    dispose(): void {
        this.unsubscribe();
    }

    /** Lida com eventos de tecla pressionada */
    private handleKeyDown = (event: InputEvents["keyDown"]): void => {
        const mapping = this.mappings.find((m) => this.matches(m, event));
        if (!mapping) return;
        this.eventBus.emit("actionTriggered", { action: mapping.action });
    };

    /** Verifica se o evento corresponde ao mapeamento */
    private matches(mapping: InputMapping, event: InputEvents["keyDown"]): boolean {
        if (mapping.key !== event.code) return false;
        if (mapping.context && mapping.context !== this.context) return false;
        if (mapping.modifiers && !this.modifiersMatch(event.modifiers, mapping.modifiers)) return false;
        return true;
    }

    /** Compara modificadores do evento com os do mapeamento */
    private modifiersMatch(a: InputMapping["modifiers"], b: InputMapping["modifiers"]): boolean {
        return (
            a.shift === b.shift &&
            a.ctrl === b.ctrl &&
            a.alt === b.alt &&
            a.meta === b.meta &&
            a.space === b.space
        );
    }
}

