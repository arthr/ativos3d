import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";

export function Stage() {
  const { camera, gl, scene } = useThree();
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    // Config padrão: isométrico leve
    cam.position.set(20, 20, 20);
    cam.lookAt(0, 0, 0);
    // Renderer: color management e sombras
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.0;
    scene.background = new THREE.Color(0xf3f4f6);
  }, [camera, gl, scene]);
  return (
    <>
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
    </>
  );
}
