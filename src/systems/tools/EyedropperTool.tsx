import { useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useStore } from "../../store/useStore";

export function EyedropperTool() {
  const activeTool = useStore((s) => s.activeTool);
  const setSelectedCatalogId = useStore((s) => s.setSelectedCatalogId);
  const { camera, gl, scene } = useThree();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const pointer = useRef(new THREE.Vector2(0, 0));

  useEffect(() => {
    function onPointerMove(e: PointerEvent) {
      const rect = gl.domElement.getBoundingClientRect();
      pointer.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    }
    window.addEventListener("pointermove", onPointerMove);
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [gl]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (activeTool !== "eyedropper") return;
      const target = e.target as HTMLElement | null;
      if (target?.closest('[data-hud="true"]')) return;
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
  }, [activeTool, camera, raycaster, scene, setSelectedCatalogId]);

  return null;
}
