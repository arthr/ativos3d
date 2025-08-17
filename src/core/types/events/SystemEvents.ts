import type { SceneAction } from "../scene/SceneTypes";
import type { MessageLevel } from "../ui/UITypes";

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
