import { Scene } from "three";
import type { SceneId, SceneManagerDependencies } from "@core/types/scene";
import type { EventBus } from "@core/events/EventBus";

/**
 * Gerenciador de cenas Three.js
 *
 * Responsável por criar, armazenar e alternar entre cenas.
 */
export class SceneManager {
    private static instance: SceneManager | null = null;
    private readonly scenes: Map<SceneId, Scene> = new Map();
    private readonly eventBus: EventBus;
    private readonly sceneFactory: () => Scene;
    private activeSceneId: SceneId | null = null;

    private constructor(deps: SceneManagerDependencies) {
        this.eventBus = deps.eventBus;
        this.sceneFactory = deps.createScene ?? ((): Scene => new Scene());
    }

    /**
     * Obtém a instância singleton do SceneManager
     */
    public static getInstance(deps: SceneManagerDependencies): SceneManager {
        if (!SceneManager.instance) {
            SceneManager.instance = new SceneManager(deps);
        }
        return SceneManager.instance;
    }

    /**
     * Reseta a instância singleton (apenas para testes)
     */
    public static resetInstance(): void {
        SceneManager.instance = null;
    }

    /**
     * Cria uma nova cena e a define como ativa
     */
    public createScene(id: SceneId = this.generateId()): Scene {
        if (this.scenes.has(id)) {
            throw new Error(`Cena com ID ${id} já existe`);
        }

        const scene = this.sceneFactory();
        this.scenes.set(id, scene);
        this.setActiveScene(id);
        return scene;
    }

    /**
     * Define a cena ativa
     */
    public setActiveScene(id: SceneId): void {
        if (!this.scenes.has(id)) {
            throw new Error(`Cena com ID ${id} não existe`);
        }
        this.activeSceneId = id;
        this.eventBus.emit("sceneStateChanged", { action: "loaded", sceneId: id });
    }

    /**
     * Obtém a cena ativa
     */
    public getActiveScene(): Scene | undefined {
        return this.activeSceneId ? this.scenes.get(this.activeSceneId) : undefined;
    }

    /**
     * Obtém uma cena pelo ID
     */
    public getScene(id: SceneId): Scene | undefined {
        return this.scenes.get(id);
    }

    /**
     * Remove uma cena
     */
    public removeScene(id: SceneId): boolean {
        const removed = this.scenes.delete(id);
        if (removed && this.activeSceneId === id) {
            this.activeSceneId = null;
        }
        return removed;
    }

    /**
     * Gera um ID único para cena
     */
    private generateId(): SceneId {
        return crypto.randomUUID();
    }
}
