import { useEffect, useMemo, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useStore } from "../../store/useStore";
import { getNormalizedPointer, intersectGround } from "../tools/toolUtils";

// Mediator/Observer: centraliza eventos de ponteiro/teclado e publica no store
export function InputController() {
  const { camera, gl } = useThree();
  const setPointerNdc = useStore((s) => s.setPointerNdc);
  const setGroundPoint = useStore((s) => s.setGroundPoint);
  const setKeyDown = useStore((s) => s.setKeyDown);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const ndc = useRef(new THREE.Vector2(0, 0));

  useEffect(() => {
    function onPointerMove(e: PointerEvent) {
      getNormalizedPointer(e, gl.domElement, ndc.current);
      setPointerNdc(ndc.current.x, ndc.current.y);
      const hit = intersectGround(raycaster, camera, ndc.current);
      setGroundPoint(hit ? { x: hit.x, y: hit.y, z: hit.z } : null);
    }
    function onKeyDown(e: KeyboardEvent) {
      setKeyDown(e.code, true);
    }
    function onKeyUp(e: KeyboardEvent) {
      setKeyDown(e.code, false);
    }
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [camera, gl, raycaster, setPointerNdc, setGroundPoint, setKeyDown]);

  return null;
}
