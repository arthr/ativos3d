import type { Camera } from "three";
import type { Vec2 } from "@core/geometry/types/Vec2";
import type { Vec3 } from "@core/geometry/types/Vec3";
import type { InputManagerDependencies, InputManagerProvider, Modifiers } from "@core/types/input";
import { Vec2Factory, Vec3Factory } from "@core/geometry";
import { Raycaster, Plane, Vector2, Vector3 } from "three";

/**
 * Gerencia eventos de input e publica no EventBus
 */
export class InputManager implements InputManagerProvider {
    private readonly dependencies: InputManagerDependencies;
    private readonly eventBus: InputManagerDependencies["eventBus"];
    private readonly cameraSystem: InputManagerDependencies["cameraSystem"];
    private readonly target: InputManagerDependencies["target"];
    private readonly raycaster = new Raycaster();
    private readonly plane = new Plane(new Vector3(0, 1, 0), 0);
    private lastScreen = Vec2Factory.create(-Infinity, -Infinity);

    constructor(dependencies: InputManagerDependencies) {
        this.dependencies = dependencies;
        this.eventBus = this.dependencies.eventBus;
        this.cameraSystem = this.dependencies.cameraSystem;
        this.target = this.dependencies.target;
        this.target.addEventListener("pointermove", this.handlePointerMove);
        this.target.addEventListener("pointerdown", this.handlePointerDown);
        this.target.addEventListener("pointerup", this.handlePointerUp);
        this.target.addEventListener("click", this.handleClick);
        this.target.addEventListener("keydown", this.handleKeyDown);
        this.target.addEventListener("keyup", this.handleKeyUp);
    }

    /** Remove todos os listeners registrados */
    dispose(): void {
        this.target.removeEventListener("pointermove", this.handlePointerMove);
        this.target.removeEventListener("pointerdown", this.handlePointerDown);
        this.target.removeEventListener("pointerup", this.handlePointerUp);
        this.target.removeEventListener("click", this.handleClick);
        this.target.removeEventListener("keydown", this.handleKeyDown);
        this.target.removeEventListener("keyup", this.handleKeyUp);
    }

    /** Lida com movimento do ponteiro */
    private handlePointerMove = (event: Event): void => {
        const pointerEvent = event as PointerEvent;
        const screen = Vec2Factory.create(pointerEvent.clientX, pointerEvent.clientY);
        if (screen.x === this.lastScreen.x && screen.y === this.lastScreen.y) return;
        this.lastScreen = screen;
        const ndc = this.toNdc(screen);
        const world = this.toWorld(ndc);
        this.eventBus.emit("pointerMove", {
            worldPosition: world,
            screenPosition: screen,
            ndc,
        });
    };

    /** Lida com pressionar botão do ponteiro */
    private handlePointerDown = (event: Event): void => {
        const pointerEvent = event as PointerEvent;
        const screen = Vec2Factory.create(pointerEvent.clientX, pointerEvent.clientY);
        const ndc = this.toNdc(screen);
        const world = this.toWorld(ndc);
        const modifiers = this.getModifiers(pointerEvent);
        const hudTarget = this.isHudTarget(pointerEvent);
        this.eventBus.emit("pointerDown", {
            worldPosition: world,
            screenPosition: screen,
            ndc,
            button: pointerEvent.button,
            modifiers,
            hudTarget,
        });
    };

    /** Lida com soltar botão do ponteiro */
    private handlePointerUp = (event: Event): void => {
        const pointerEvent = event as PointerEvent;
        const screen = Vec2Factory.create(pointerEvent.clientX, pointerEvent.clientY);
        const ndc = this.toNdc(screen);
        const world = this.toWorld(ndc);
        const modifiers = this.getModifiers(pointerEvent);
        const hudTarget = this.isHudTarget(pointerEvent);
        this.eventBus.emit("pointerUp", {
            worldPosition: world,
            screenPosition: screen,
            ndc,
            button: pointerEvent.button,
            modifiers,
            hudTarget,
        });
    };

    /** Lida com clique do ponteiro */
    private handleClick = (event: Event): void => {
        const mouseEvent = event as MouseEvent;
        const screen = Vec2Factory.create(mouseEvent.clientX, mouseEvent.clientY);
        const ndc = this.toNdc(screen);
        const world = this.toWorld(ndc);
        const hudTarget = this.isHudTarget(mouseEvent);
        this.eventBus.emit("click", {
            worldPosition: world,
            screenPosition: screen,
            button: mouseEvent.button,
            hudTarget,
        });
    };

    /** Lida com pressionar tecla */
    private handleKeyDown = (event: Event): void => {
        const keyboardEvent = event as KeyboardEvent;
        if (keyboardEvent.repeat) return;
        const modifiers = this.getModifiers(keyboardEvent);
        this.eventBus.emit("keyDown", {
            code: keyboardEvent.code,
            modifiers,
            repeat: keyboardEvent.repeat,
        });
    };

    /** Lida com soltar tecla */
    private handleKeyUp = (event: Event): void => {
        const keyboardEvent = event as KeyboardEvent;
        const modifiers = this.getModifiers(keyboardEvent);
        this.eventBus.emit("keyUp", {
            code: keyboardEvent.code,
            modifiers,
        });
    };

    /** Converte screen position para NDC */
    private toNdc(screen: { x: number; y: number }): Vec2 {
        const { width, height } = this.getTargetSize();
        const x = (screen.x / width) * 2 - 1;
        const y = -(screen.y / height) * 2 + 1;
        return Vec2Factory.create(x, y);
    }

    /** Converte NDC para posição no mundo */
    private toWorld(ndc: { x: number; y: number }): Vec3 {
        const camera = this.cameraSystem.getCamera() as Camera;
        this.raycaster.setFromCamera(new Vector2(ndc.x, ndc.y), camera);
        const intersection = new Vector3();
        this.raycaster.ray.intersectPlane(this.plane, intersection);
        return Vec3Factory.create(intersection.x, intersection.y, intersection.z);
    }

    /** Obtém os modificadores do evento */
    private getModifiers(event: KeyboardEvent | PointerEvent): Modifiers {
        return {
            shift: event.shiftKey,
            ctrl: event.ctrlKey,
            alt: event.altKey,
            meta: event.metaKey,
            space: event instanceof KeyboardEvent && event.code === "Space",
        };
    }

    /** Obtém tamanho do alvo */
    private getTargetSize(): { width: number; height: number } {
        if ("innerWidth" in this.target) {
            const w = this.target as Window;
            return { width: w.innerWidth, height: w.innerHeight };
        }
        const rect = (this.target as HTMLElement).getBoundingClientRect();
        return { width: rect.width, height: rect.height };
    }

    /** Verifica se o evento ocorreu fora do alvo */
    private isHudTarget(event: MouseEvent | PointerEvent): boolean {
        if (!(this.target instanceof HTMLElement)) return false;
        const node = event.target;
        if (!(node instanceof Node)) return false;
        return !this.target.contains(node);
    }
}
