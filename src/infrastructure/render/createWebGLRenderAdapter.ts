import { WebGLRenderer, Scene, Camera } from "three";
import type { RenderAdapter } from "@core/types/render";

/**
 * Cria um adaptador de renderização utilizando WebGLRenderer do Three.js
 */
export function createWebGLRenderAdapter(canvas?: HTMLCanvasElement): RenderAdapter {
    try {
        const renderer = new WebGLRenderer({ canvas });
        return {
            render: (scene: Scene, camera: Camera): void => {
                renderer.render(scene, camera);
            },
        };
    } catch (error) {
        return {
            render: (): void => {
                throw new Error(
                    error instanceof Error ? error.message : "Failed to create WebGLRenderer",
                );
            },
        };
    }
}
