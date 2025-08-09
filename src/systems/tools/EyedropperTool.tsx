import { useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useStore } from "../../store/useStore";
import { eventBus } from "../../core/events";

export function EyedropperTool() {
  const activeTool = useStore((s) => s.activeTool);
  const cameraGestureActive = useStore((s) => s.cameraGestureActive);
  const setSelectedCatalogId = useStore((s) => s.setSelectedCatalogId);
  const { camera, gl, scene } = useThree();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const hover = useRef<{ defId: string } | null>(null);

  useEffect(() => {
    if (activeTool !== "eyedropper") return;
    const off = eventBus.on("pointerNdc", ({ x, y }) => {
      const ndc = new THREE.Vector2(x, y);
      raycaster.setFromCamera(ndc, camera);
      const hits = raycaster.intersectObjects(scene.children, true);
      const objHit = hits.find((h) => h.object?.userData?.defId);
      hover.current = objHit?.object?.userData?.defId
        ? { defId: objHit.object.userData.defId as string }
        : null;
    });
    return () => off();
  }, [activeTool, camera, raycaster, scene]);

  useEffect(() => {
    if (activeTool !== "eyedropper") return;
    const off = eventBus.on("click", ({ button, hudTarget }) => {
      if (cameraGestureActive || hudTarget || button !== 0) return;
      // Reusar hover calculado no último pointerNdc
      const h = hover.current;
      if (h?.defId) {
        setSelectedCatalogId(h.defId);
        useStore.setState({ activeTool: "place" });
      }
    });
    return () => off();
  }, [activeTool, cameraGestureActive, setSelectedCatalogId]);

  // Ghost preview simples: realçar área com um retângulo abaixo do objeto alvo (opcional)
  if (activeTool !== "eyedropper" || !hover.current) return null;
  return null;
}
