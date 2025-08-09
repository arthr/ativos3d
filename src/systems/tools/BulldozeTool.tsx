import { useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useStore } from "../../store/useStore";

export function BulldozeTool() {
  const activeTool = useStore((s) => s.activeTool);
  const { camera, gl, scene } = useThree();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const pointer = useRef(new THREE.Vector2(0, 0));
  const hover = useRef<
    { kind: "object"; id: string } | { kind: "tile"; x: number; z: number } | null
  >(null);

  useEffect(() => {
    function onPointerMove(e: PointerEvent) {
      const rect = gl.domElement.getBoundingClientRect();
      pointer.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      if (activeTool !== "bulldoze") return;
      raycaster.setFromCamera(pointer.current, camera);
      const hits = raycaster.intersectObjects(scene.children, true);
      const objHit = hits.find((h) => h.object?.userData?.idObjeto);
      if (objHit?.object?.userData?.idObjeto) {
        hover.current = { kind: "object", id: objHit.object.userData.idObjeto as string };
        return;
      }
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const hit = raycaster.ray.intersectPlane(plane, new THREE.Vector3());
      if (!hit) {
        hover.current = null;
        return;
      }
      hover.current = { kind: "tile", x: Math.floor(hit.x), z: Math.floor(hit.z) };
    }
    window.addEventListener("pointermove", onPointerMove);
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [gl, activeTool, camera, raycaster, scene]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (activeTool !== "bulldoze") return;
      const target = e.target as HTMLElement | null;
      if (target?.closest('[data-hud="true"]')) return;
      raycaster.setFromCamera(pointer.current, camera);
      // Raycast na cena por meshes com userData.idObjeto
      const hits = raycaster.intersectObjects(scene.children, true);
      const objHit = hits.find((h) => h.object?.userData?.idObjeto);
      if (objHit?.object?.userData?.idObjeto) {
        const id = objHit.object.userData.idObjeto as string;
        useStore.setState((s) => ({ objects: s.objects.filter((o) => o.id !== id) }));
        return;
      }
      // Nada de objeto: apagar piso do tile clicado
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const hit = raycaster.ray.intersectPlane(plane, new THREE.Vector3());
      if (!hit) return;
      const x = Math.floor(hit.x);
      const z = Math.floor(hit.z);
      useStore.setState((s) => ({ floor: s.floor.filter((t) => !(t.x === x && t.z === z)) }));
    }
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [activeTool, camera, raycaster, scene]);

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
