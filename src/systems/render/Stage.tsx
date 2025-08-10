import { useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls, PerspectiveCamera, OrthographicCamera } from "@react-three/drei";
import { useStore } from "../../store/useStore";
import { getCursorForTool } from "../../core/modeMachine";

export function Stage() {
  const { camera, gl, scene } = useThree();
  const controlsEnabled = useStore((s) => s.cameraControlsEnabled);
  const cameraMode = useStore((s) => s.cameraMode);
  const activeTool = useStore((s) => s.activeTool);
  const setCameraGestureActive = useStore((s) => s.setCameraGestureActive);
  const [isSpaceDown, setIsSpaceDown] = useState(false);
  const [isPanDragging, setIsPanDragging] = useState(false);
  const [isRotateDragging, setIsRotateDragging] = useState(false);
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

  // Mouse mapping configurado via prop em OrbitControls (LEFT=PAN, RIGHT=ROTATE)

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
        if (isPanDragging) {
          setIsPanDragging(false);
        }
        // recomputa gesto ativo baseado em rotate
        setCameraGestureActive(isRotateDragging);
        canvas.style.cursor = isRotateDragging ? "auto" : "auto";
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      if (e.button === 0 && isSpaceDown) {
        setIsPanDragging(true);
        canvas.style.cursor = "grabbing";
        setCameraGestureActive(true);
      }
      if (e.button === 2 && controlsEnabled && cameraMode === "persp") {
        // Right mouse begins rotate gesture
        setIsRotateDragging(true);
        setCameraGestureActive(true);
      }
    };
    const onPointerUp = (e: PointerEvent) => {
      let nextPan = isPanDragging;
      let nextRot = isRotateDragging;
      if (e.button === 0 && isPanDragging) {
        nextPan = false;
        setIsPanDragging(false);
        canvas.style.cursor = isSpaceDown ? "grab" : "auto";
      }
      if (e.button === 2 && isRotateDragging) {
        nextRot = false;
        setIsRotateDragging(false);
      }
      setCameraGestureActive(nextPan || nextRot);
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
  }, [
    gl,
    isSpaceDown,
    isPanDragging,
    controlsEnabled,
    cameraMode,
    setCameraGestureActive,
    isRotateDragging,
  ]);

  // Cursor comportamental por ferramenta (prioridade: dragging pan > space pan > cursor por ferramenta)
  useEffect(() => {
    const canvas = gl.domElement as HTMLCanvasElement;
    if (isPanDragging) {
      canvas.style.cursor = "grabbing";
      return;
    }
    if (isSpaceDown) {
      canvas.style.cursor = "grab";
      return;
    }
    const toolCursor = getCursorForTool(activeTool);
    canvas.style.cursor = toolCursor ?? "auto";
  }, [gl, activeTool, isSpaceDown, isPanDragging]);
  return (
    <>
      {cameraMode === "persp" ? (
        <PerspectiveCamera makeDefault position={[20, 20, 20]} fov={50} near={0.1} far={1000} />
      ) : (
        <OrthographicCamera makeDefault position={[20, 20, 20]} zoom={30} near={-1000} far={1000} />
      )}
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
