import { useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useStore } from "../../store/useStore";

export function WallTool() {
  const activeTool = useStore((s) => s.activeTool);
  const cameraGestureActive = useStore((s) => s.cameraGestureActive);
  const lot = useStore((s) => s.lot);
  const { camera, gl } = useThree();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const pointer = useRef(new THREE.Vector2(0, 0));
  const [start, setStart] = useState<THREE.Vector3 | null>(null);
  const [end, setEnd] = useState<THREE.Vector3 | null>(null);

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
    function onPointerDown(e: MouseEvent) {
      if (activeTool !== "wall" || cameraGestureActive) return;
      const rect = gl.domElement.getBoundingClientRect();
      const target = e.target as HTMLElement | null;
      if (target?.closest('[data-hud="true"]')) return;
      pointer.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer.current, camera);
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const hit = raycaster.ray.intersectPlane(plane, new THREE.Vector3());
      if (!hit) return;
      const snapped = new THREE.Vector3(Math.round(hit.x), 0, Math.round(hit.z));
      setStart(snapped);
      setEnd(snapped.clone());
    }
    function onPointerUp(e: MouseEvent) {
      if (activeTool !== "wall" || cameraGestureActive || !start || !end) return;
      // Constrange a ortogonal e cria sequência de segmentos
      const dx = Math.round(end.x - start.x);
      const dz = Math.round(end.z - start.z);
      let segments: { ax: number; ay: number; az: number; bx: number; by: number; bz: number }[] =
        [];
      if (Math.abs(dx) >= Math.abs(dz)) {
        const step = dx >= 0 ? 1 : -1;
        for (let i = 0; i !== dx; i += step) {
          const ax = start.x + i;
          const bx = start.x + i + step;
          segments.push({ ax, ay: 0, az: start.z, bx, by: 0, bz: start.z });
        }
      } else {
        const step = dz >= 0 ? 1 : -1;
        for (let i = 0; i !== dz; i += step) {
          const az = start.z + i;
          const bz = start.z + i + step;
          segments.push({ ax: start.x, ay: 0, az, bx: start.x, by: 0, bz });
        }
      }
      // Clipa aos limites do lote
      segments = segments.filter(
        (s) =>
          s.ax >= 0 &&
          s.bx >= 0 &&
          s.az >= 0 &&
          s.bz >= 0 &&
          s.ax <= lot.width &&
          s.bx <= lot.width &&
          s.az <= lot.depth &&
          s.bz <= lot.depth,
      );
      if (segments.length) {
        useStore.setState((s) => ({ walls: [...s.walls, ...segments] }));
      }
      setStart(null);
      setEnd(null);
    }
    function onPointerMoveDraw() {
      if (activeTool !== "wall" || cameraGestureActive || !start) return;
      raycaster.setFromCamera(pointer.current, camera);
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const hit = raycaster.ray.intersectPlane(plane, new THREE.Vector3());
      if (!hit) return;
      const snapped = new THREE.Vector3(Math.round(hit.x), 0, Math.round(hit.z));
      setEnd(snapped);
    }
    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mouseup", onPointerUp);
    const id = setInterval(onPointerMoveDraw, 16);
    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("mouseup", onPointerUp);
      clearInterval(id);
    };
  }, [activeTool, camera, gl, raycaster, start, end]);

  if (activeTool !== "wall" || !start || !end) return null;
  // Preview
  const dx = end.x - start.x;
  const dz = end.z - start.z;
  const useX = Math.abs(dx) >= Math.abs(dz);
  const len = useX ? Math.abs(Math.round(dx)) : Math.abs(Math.round(dz));
  const yaw = useX ? 0 : Math.PI / 2;
  const cx = (start.x + end.x) / 2;
  const cz = (start.z + end.z) / 2;
  const previewHeight = Math.max(1, lot.height * 0.5);
  return (
    <mesh position={[cx, previewHeight / 2, cz]} rotation={[0, yaw, 0]}>
      <boxGeometry args={[Math.max(0.001, len), previewHeight, 0.05]} />
      <meshStandardMaterial color="#38bdf8" transparent opacity={0.5} />
    </mesh>
  );
}
