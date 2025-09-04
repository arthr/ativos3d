import type { EventBus } from "../../events/EventBus";
import type { CameraSystemProvider } from "../camera/CameraSystem";
import type { Vec2, Vec3, CollisionBody } from "../../geometry";

export interface WallSnapDependencies {
    readonly eventBus: EventBus;
    readonly cameraSystem: CameraSystemProvider;
    readonly getWallBodies: () => CollisionBody[];
}

export interface WallSnapProvider {
    calculateSnapPoint(ndc: Vec2): Vec3 | null;
    dispose(): void;
}
