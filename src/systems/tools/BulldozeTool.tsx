import { useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useStore } from "../../store/useStore";
import { intersectGround, isHudEventTarget, snapToGrid } from "./toolUtils";

export function BulldozeTool() {
  const activeTool = useStore((s) => s.activeTool);
  const cameraGestureActive = useStore((s) => s.cameraGestureActive);
  const { camera, gl, scene } = useThree();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const pointerNdc = useStore((s) => s.input.pointerNdc);
  const hover = useRef<
    { kind: "object"; id: string } | { kind: "tile"; x: number; z: number } | null
  >(null);

  useEffect(() => {
    if (activeTool !== "bulldoze") return;
    const ndc = new THREE.Vector2(pointerNdc.x, pointerNdc.y);
    raycaster.setFromCamera(ndc, camera);
    const hits = raycaster.intersectObjects(scene.children, true);
    const objHit = hits.find((h) => h.object?.userData?.idObjeto);
    if (objHit?.object?.userData?.idObjeto) {
      hover.current = { kind: "object", id: objHit.object.userData.idObjeto as string };
      return;
    }
    const hit = intersectGround(raycaster, camera, ndc);
    if (!hit) {
      hover.current = null;
      return;
    }
    const snapped = snapToGrid(hit, "floor");
    hover.current = { kind: "tile", x: snapped.x, z: snapped.z };
  }, [gl, activeTool, camera, raycaster, scene, pointerNdc]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (activeTool !== "bulldoze" || cameraGestureActive) return;
      if (isHudEventTarget(e)) return;
      const ndc = new THREE.Vector2(pointerNdc.x, pointerNdc.y);
      raycaster.setFromCamera(ndc, camera);
      // Raycast na cena por meshes com userData.idObjeto
      const hits = raycaster.intersectObjects(scene.children, true);
      const objHit = hits.find((h) => h.object?.userData?.idObjeto);
      if (objHit?.object?.userData?.idObjeto) {
        const id = objHit.object.userData.idObjeto as string;
        useStore.setState((s) => ({ objects: s.objects.filter((o) => o.id !== id) }));
        return;
      }
      // Nada de objeto: apagar piso do tile clicado
      const hit = intersectGround(raycaster, camera, ndc);
      if (!hit) return;
      const snapped = snapToGrid(hit, "floor");
      const x = snapped.x;
      const z = snapped.z;
      useStore.setState((s) => ({ floor: s.floor.filter((t) => !(t.x === x && t.z === z)) }));
    }
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [activeTool, camera, raycaster, scene, cameraGestureActive]);

  if (activeTool !== "bulldoze" || !hover.current) return null;
  if (hover.current.kind === "object") {
    // highlight via emissive já ocorre no mesh selecionado normalmente; aqui, um aro/silhueta simples
    return null;
  }
  const t = hover.current;
  if (!t || t.kind !== "tile") return null;
  return (
    <mesh position={[t.x + 0.5, 0.02, t.z + 0.5]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial color="#ef4444" transparent opacity={0.2} />
    </mesh>
  );
}
