import type { Vec3 } from "../../geometry/types/Vec3";
import type { Vec2 } from "../../geometry/types/Vec2";
import type { Modifiers } from "../input/Modifiers";

/**
 * Eventos de input do sistema
 */
export interface InputEvents {
    // Eventos de ponteiro no mundo 3D
    pointerMove: {
        worldPosition: Vec3;
        screenPosition: Vec2;
        ndc: Vec2;
    };

    pointerDown: {
        worldPosition: Vec3;
        screenPosition: Vec2;
        ndc: Vec2;
        button: number;
        modifiers: Modifiers;
        hudTarget: boolean;
    };

    pointerUp: {
        worldPosition: Vec3;
        screenPosition: Vec2;
        ndc: Vec2;
        button: number;
        modifiers: Modifiers;
        hudTarget: boolean;
    };

    click: {
        worldPosition: Vec3;
        screenPosition: Vec2;
        button: number;
        hudTarget: boolean;
    };

    // Eventos de teclado
    keyDown: {
        code: string;
        modifiers: Modifiers;
        repeat: boolean;
    };

    keyUp: {
        code: string;
        modifiers: Modifiers;
    };
}
