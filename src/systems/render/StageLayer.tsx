import { useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";
import { useStore } from "../../store/useStore";
import { createCameraStrategy } from "./camera/CameraStrategies";
import { useCameraGestures } from "./camera/hooks";

export function StageLayer() {
  const { camera, gl, scene } = useThree();
  const controlsEnabled = useStore((s) => s.cameraControlsEnabled);
  const cameraMode = useStore((s) => s.cameraMode);

  // Strategy: câmera por modo (memoizada para identidade estável)
  const strategy = useMemo(() => createCameraStrategy(cameraMode), [cameraMode]);

  useEffect(() => {
    strategy.applyInitial(camera, gl, scene);
  }, [cameraMode, camera, gl, scene, strategy]);

  // Gestos de câmera
  const { isSpaceDown } = useCameraGestures(gl, cameraMode);
  return (
    <>
      <strategy.CameraElement />
      <ambientLight intensity={0.7} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={0.6}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={1}
        shadow-camera-far={60}
      />
      {/* TODO: adicionar controles de pan/zoom (Orbit/MapControls custom) */}
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.1}
        enabled={controlsEnabled}
        // Pan só quando Space estiver pressionado
        enablePan={controlsEnabled && isSpaceDown}
        enableZoom={controlsEnabled}
        enableRotate={controlsEnabled && cameraMode === "persp"}
        // Mapeamento: LEFT=PAN, RIGHT=ROTATE
        mouseButtons={{
          LEFT: THREE.MOUSE.PAN,
          MIDDLE: THREE.MOUSE.DOLLY,
          RIGHT: THREE.MOUSE.ROTATE,
        }}
      />
    </>
  );
}
