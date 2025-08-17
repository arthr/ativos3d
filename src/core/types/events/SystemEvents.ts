import type { SceneAction, MessageLevel } from "../Common";

/**
 * Eventos de sistema
 */
export interface SystemEvents {
    sceneStateChanged: {
        action: SceneAction;
        sceneId?: string;
        format?: string;
        filename?: string;
    };

    systemMessage: {
        level: MessageLevel;
        message: string;
        code?: string;
        timestamp: number;
    };

    performanceMetrics: {
        fps: number;
        memoryUsage: number;
        renderTime: number;
    };
}
