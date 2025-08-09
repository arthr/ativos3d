import { useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useStore } from "../../store/useStore";
import { getNormalizedPointer, isHudEventTarget } from "./toolUtils";

export function EyedropperTool() {
  const activeTool = useStore((s) => s.activeTool);
  const cameraGestureActive = useStore((s) => s.cameraGestureActive);
  const setSelectedCatalogId = useStore((s) => s.setSelectedCatalogId);
  const { camera, gl, scene } = useThree();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const pointer = useRef(new THREE.Vector2(0, 0));
  const hover = useRef<{ defId: string } | null>(null);

  useEffect(() => {
    function onPointerMove(e: PointerEvent) {
      getNormalizedPointer(e, gl.domElement, pointer.current);
      if (activeTool !== "eyedropper") return;
      raycaster.setFromCamera(pointer.current, camera);
      const hits = raycaster.intersectObjects(scene.children, true);
      const objHit = hits.find((h) => h.object?.userData?.defId);
      hover.current = objHit?.object?.userData?.defId
        ? { defId: objHit.object.userData.defId as string }
        : null;
    }
    window.addEventListener("pointermove", onPointerMove);
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [gl, activeTool, camera, raycaster, scene]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (activeTool !== "eyedropper" || cameraGestureActive) return;
      if (isHudEventTarget(e)) return;
      raycaster.setFromCamera(pointer.current, camera);
      const hits = raycaster.intersectObjects(scene.children, true);
      const objHit = hits.find((h) => h.object?.userData?.defId);
      if (objHit?.object?.userData?.defId) {
        const defId = objHit.object.userData.defId as string;
        setSelectedCatalogId(defId);
        useStore.setState({ activeTool: "place" });
      }
    }
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [activeTool, camera, raycaster, scene, setSelectedCatalogId, cameraGestureActive]);

  // Ghost preview simples: realçar área com um retângulo abaixo do objeto alvo (opcional)
  if (activeTool !== "eyedropper" || !hover.current) return null;
  return null;
}
