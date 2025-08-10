import React from "react";
import * as THREE from "three";
import { PerspectiveCamera, OrthographicCamera } from "@react-three/drei";

export type AppCameraMode = "persp" | "ortho";

export interface CameraStrategy {
  CameraElement: React.FC;
  applyInitial(camera: THREE.Camera, gl: THREE.WebGLRenderer, scene: THREE.Scene): void;
}

function applyCommonRendererSettings(gl: THREE.WebGLRenderer, scene: THREE.Scene) {
  gl.shadowMap.enabled = true;
  gl.shadowMap.type = THREE.PCFSoftShadowMap;
  gl.outputColorSpace = THREE.SRGBColorSpace as any;
  gl.toneMapping = THREE.ACESFilmicToneMapping;
  gl.toneMappingExposure = 1.0;
  scene.background = new THREE.Color(0xf3f4f6);
}

export function createCameraStrategy(mode: AppCameraMode): CameraStrategy {
  if (mode === "ortho") {
    const CameraElement: React.FC = () => (
      <OrthographicCamera makeDefault position={[20, 20, 20]} zoom={30} near={-1000} far={1000} />
    );
    return {
      CameraElement,
      applyInitial(camera, gl, scene) {
        applyCommonRendererSettings(gl, scene);
        // posição/target padrão
        (camera as THREE.Camera).position.set(20, 20, 20);
        (camera as THREE.Camera).lookAt(0, 0, 0);
      },
    };
  }
  const CameraElement: React.FC = () => (
    <PerspectiveCamera makeDefault position={[30, 20, 30]} fov={50} near={0.1} far={1000} />
  );
  return {
    CameraElement,
    applyInitial(camera, gl, scene) {
      applyCommonRendererSettings(gl, scene);
      (camera as THREE.Camera).position.set(30, 20, 30);
      (camera as THREE.Camera).lookAt(0, 0, 0);
    },
  };
}
