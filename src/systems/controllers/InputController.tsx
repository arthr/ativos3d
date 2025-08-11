import { useEffect, useMemo, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useStore } from "../../store/useStore";
import { getNormalizedPointer, intersectGround, isHudEventTarget } from "../tools/toolUtils";
import { eventBus } from "../../core/events";

// Mediator/Observer: centraliza eventos de ponteiro/teclado e publica no store
export function InputController() {
  const { camera, gl } = useThree();
  const setPointerNdc = useStore((s) => s.input.setPointerNdc);
  const setGroundPoint = useStore((s) => s.input.setGroundPoint);
  const setKeyDown = useStore((s) => s.input.setKeyDown);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const ndc = useRef(new THREE.Vector2(0, 0));

  useEffect(() => {
    function onPointerMove(e: PointerEvent) {
      getNormalizedPointer(e, gl.domElement, ndc.current);
      setPointerNdc(ndc.current.x, ndc.current.y);
      const hit = intersectGround(raycaster, camera, ndc.current);
      setGroundPoint(hit ? { x: hit.x, y: hit.y, z: hit.z } : null);
      eventBus.emit("pointerNdc", { x: ndc.current.x, y: ndc.current.y });
      eventBus.emit("groundPoint", hit ? { x: hit.x, y: hit.y, z: hit.z } : null);
    }
    function onKeyDown(e: KeyboardEvent) {
      setKeyDown(e.code, true);
      eventBus.emit("keyDown", {
        code: e.code,
        shift: e.shiftKey,
        alt: e.altKey,
        ctrl: e.ctrlKey,
        meta: e.metaKey,
      });
    }
    function onKeyUp(e: KeyboardEvent) {
      setKeyDown(e.code, false);
      eventBus.emit("keyUp", {
        code: e.code,
        shift: e.shiftKey,
        alt: e.altKey,
        ctrl: e.ctrlKey,
        meta: e.metaKey,
      });
    }
    function onClick(e: MouseEvent) {
      // Usa último NDC/ground calculado; evita recomputar aqui
      const hudTarget = isHudEventTarget(e);
      eventBus.emit("click", {
        button: e.button,
        ndc: { x: ndc.current.x, y: ndc.current.y },
        ground: useStore.getState().input.groundPoint,
        hudTarget,
      });
    }
    function onPointerDown(e: PointerEvent) {
      const hudTarget = isHudEventTarget(e);
      eventBus.emit("pointerDown", {
        button: e.button,
        ndc: { x: ndc.current.x, y: ndc.current.y },
        ground: useStore.getState().input.groundPoint,
        hudTarget,
        shift: e.shiftKey,
        alt: e.altKey,
        ctrl: e.ctrlKey,
        meta: e.metaKey,
      });
    }
    function onPointerUp(e: PointerEvent) {
      const hudTarget = isHudEventTarget(e);
      eventBus.emit("pointerUp", {
        button: e.button,
        ndc: { x: ndc.current.x, y: ndc.current.y },
        ground: useStore.getState().input.groundPoint,
        hudTarget,
        shift: e.shiftKey,
        alt: e.altKey,
        ctrl: e.ctrlKey,
        meta: e.metaKey,
      });
    }
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("click", onClick);
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("click", onClick);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [camera, gl, raycaster, setPointerNdc, setGroundPoint, setKeyDown]);

  return null;
}
