import { useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";
import { useStore } from "../../store/useStore";

export function Stage() {
  const { camera, gl, scene } = useThree();
  const controlsEnabled = useStore((s) => s.cameraControlsEnabled);
  const controlsRef = useRef<any>(null);
  const [isSpaceDown, setIsSpaceDown] = useState(false);
  const [isPanDragging, setIsPanDragging] = useState(false);
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

  // Configurar mouse mapping: Right = rotate; Left = pan (habilitado/desabilitado via enablePan)
  useEffect(() => {
    const controls = controlsRef.current as any | null;
    if (!controls) return;
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.PAN,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.ROTATE,
    };
  }, []);

  // Toggle pan com Space e feedback de cursor
  useEffect(() => {
    const canvas = gl.domElement as HTMLCanvasElement;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        if (!isSpaceDown) {
          e.preventDefault();
          setIsSpaceDown(true);
          canvas.style.cursor = "grab";
        }
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        setIsSpaceDown(false);
        if (!isPanDragging) canvas.style.cursor = "auto";
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      if (e.button === 0 && isSpaceDown) {
        setIsPanDragging(true);
        canvas.style.cursor = "grabbing";
      }
    };
    const onPointerUp = () => {
      if (isPanDragging) {
        setIsPanDragging(false);
        canvas.style.cursor = isSpaceDown ? "grab" : "auto";
      }
    };
    const onContextMenu = (e: Event) => {
      // Evitar menu de contexto durante rotação com botão direito
      e.preventDefault();
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("contextmenu", onContextMenu);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("contextmenu", onContextMenu);
    };
  }, [gl, isSpaceDown, isPanDragging]);
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
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping
        dampingFactor={0.1}
        enabled={controlsEnabled}
        // Pan só quando Space estiver pressionado
        enablePan={controlsEnabled && isSpaceDown}
        enableZoom={controlsEnabled}
        enableRotate={controlsEnabled}
      />
    </>
  );
}
