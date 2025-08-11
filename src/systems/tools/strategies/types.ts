import type { ReactNode } from "react";
import * as THREE from "three";

export type ToolContext = {
  camera: THREE.Camera;
  gl: THREE.WebGLRenderer;
  scene: THREE.Scene;
};

export interface ToolStrategy {
  onActivate(): void | (() => void);
  onDeactivate(): void;
  onFrame?(): void;
  renderPreview(): ReactNode | null;
}

export type StrategyComponent = (props: { ctx: ToolContext }) => ReactNode | null;
