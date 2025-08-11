import { useEffect, useState } from "react";
import * as THREE from "three";
import { useStore } from "../../../store/useStore";
import type { AppState } from "../../../store/useStore";
import { getCursorForTool } from "../../../core/modeMachine";

export function useRendererSetup(gl: THREE.WebGLRenderer, scene: THREE.Scene) {
  useEffect(() => {
    // feito via strategy.applyInitial; hook mantém compat
  }, [gl, scene]);
}

export function useCameraGestures(gl: THREE.WebGLRenderer, cameraMode: "persp" | "ortho") {
  const controlsEnabled = useStore((s: AppState) => s.cameraControlsEnabled);
  const setCameraGestureActive = useStore((s: AppState) => s.setCameraGestureActive);
  const activeTool = useStore((s: AppState) => s.activeTool);
  const [isSpaceDown, setIsSpaceDown] = useState(false);
  const [isPanDragging, setIsPanDragging] = useState(false);
  const [isRotateDragging, setIsRotateDragging] = useState(false);

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
        if (isPanDragging) setIsPanDragging(false);
        setCameraGestureActive(isRotateDragging);
        canvas.style.cursor = isRotateDragging
          ? "auto"
          : getCursorForTool(activeTool) ?? "auto";
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      if (e.button === 0 && isSpaceDown) {
        setIsPanDragging(true);
        canvas.style.cursor = "grabbing";
        setCameraGestureActive(true);
      }
      if (e.button === 2 && controlsEnabled && cameraMode === "persp") {
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
    const onContextMenu = (e: Event) => e.preventDefault();

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
    activeTool,
  ]);

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

  return { isSpaceDown };
}
