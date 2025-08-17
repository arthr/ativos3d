import type { Vec3, Vec2 } from "@core/geometry";
import type { Modifiers } from "@core/types/input/Modifiers";

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
