import type { Modifiers } from "./Modifiers";
import type { InputAction } from "./InputAction";

/**
 * Define a associação entre uma tecla e uma ação.
 */
export interface InputMapping {
    readonly key: string;
    readonly action: InputAction;
    readonly modifiers?: Modifiers;
    readonly context?: string;
}
