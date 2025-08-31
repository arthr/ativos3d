import type { InputManagerDependencies, InputManagerProvider, Modifiers } from "@core/types/input";
import { Vec2Factory, Vec3Factory } from "@core/geometry";
import { Raycaster, Plane, Vector2, Vector3 } from "three";
import type { Camera } from "three";

/**
 * Gerencia eventos de input e publica no EventBus
 */
export class InputManager implements InputManagerProvider {
    private readonly eventBus: InputManagerDependencies["eventBus"];
    private readonly cameraSystem: InputManagerDependencies["cameraSystem"];
    private readonly target: InputManagerDependencies["target"];
    private readonly raycaster = new Raycaster();
    private readonly plane = new Plane(new Vector3(0, 1, 0), 0);
    private lastScreen = Vec2Factory.create(-Infinity, -Infinity);

    constructor(private readonly dependencies: InputManagerDependencies) {
        this.eventBus = dependencies.eventBus;
        this.cameraSystem = dependencies.cameraSystem;
        this.target = dependencies.target;
        this.target.addEventListener("pointermove", this.handlePointerMove);
        this.target.addEventListener("pointerdown", this.handlePointerDown);
        this.target.addEventListener("pointerup", this.handlePointerUp);
        this.target.addEventListener("click", this.handleClick);
        this.target.addEventListener("keydown", this.handleKeyDown as EventListener);
        this.target.addEventListener("keyup", this.handleKeyUp as EventListener);
    }

    /** Remove todos os listeners registrados */
    dispose(): void {
        this.target.removeEventListener("pointermove", this.handlePointerMove);
        this.target.removeEventListener("pointerdown", this.handlePointerDown);
        this.target.removeEventListener("pointerup", this.handlePointerUp);
        this.target.removeEventListener("click", this.handleClick);
        this.target.removeEventListener("keydown", this.handleKeyDown as EventListener);
        this.target.removeEventListener("keyup", this.handleKeyUp as EventListener);
    }

    /** Lida com movimento do ponteiro */
    private handlePointerMove = (event: PointerEvent): void => {
        const screen = Vec2Factory.create(event.clientX, event.clientY);
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
    private handlePointerDown = (event: PointerEvent): void => {
        const screen = Vec2Factory.create(event.clientX, event.clientY);
        const ndc = this.toNdc(screen);
        const world = this.toWorld(ndc);
        const modifiers = this.getModifiers(event);
        const hudTarget = event.target !== this.target;
        this.eventBus.emit("pointerDown", {
            worldPosition: world,
            screenPosition: screen,
            ndc,
            button: event.button,
            modifiers,
            hudTarget,
        });
    };

    /** Lida com soltar botão do ponteiro */
    private handlePointerUp = (event: PointerEvent): void => {
        const screen = Vec2Factory.create(event.clientX, event.clientY);
        const ndc = this.toNdc(screen);
        const world = this.toWorld(ndc);
        const modifiers = this.getModifiers(event);
        const hudTarget = event.target !== this.target;
        this.eventBus.emit("pointerUp", {
            worldPosition: world,
            screenPosition: screen,
            ndc,
            button: event.button,
            modifiers,
            hudTarget,
        });
    };

    /** Lida com clique do ponteiro */
    private handleClick = (event: MouseEvent): void => {
        const screen = Vec2Factory.create(event.clientX, event.clientY);
        const ndc = this.toNdc(screen);
        const world = this.toWorld(ndc);
        const hudTarget = event.target !== this.target;
        this.eventBus.emit("click", {
            worldPosition: world,
            screenPosition: screen,
            button: event.button,
            hudTarget,
        });
    };

    /** Lida com pressionar tecla */
    private handleKeyDown = (event: KeyboardEvent): void => {
        if (event.repeat) return;
        const modifiers = this.getModifiers(event);
        this.eventBus.emit("keyDown", {
            code: event.code,
            modifiers,
            repeat: event.repeat,
        });
    };

    /** Lida com soltar tecla */
    private handleKeyUp = (event: KeyboardEvent): void => {
        const modifiers = this.getModifiers(event);
        this.eventBus.emit("keyUp", {
            code: event.code,
            modifiers,
        });
    };

    /** Converte screen position para NDC */
    private toNdc(screen: { x: number; y: number }) {
        const { width, height } = this.getTargetSize();
        const x = (screen.x / width) * 2 - 1;
        const y = -(screen.y / height) * 2 + 1;
        return Vec2Factory.create(x, y);
    }

    /** Converte NDC para posição no mundo */
    private toWorld(ndc: { x: number; y: number }) {
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
    private getTargetSize() {
        if ("innerWidth" in this.target) {
            const w = this.target as Window;
            return { width: w.innerWidth, height: w.innerHeight };
        }
        const rect = (this.target as HTMLElement).getBoundingClientRect();
        return { width: rect.width, height: rect.height };
    }
}
