import { useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useStore } from "../../store/useStore";
import { intersectGround, isHudEventTarget, snapToGrid } from "./toolUtils";

export function WallTool() {
  const activeTool = useStore((s) => s.activeTool);
  const cameraGestureActive = useStore((s) => s.cameraGestureActive);
  const lot = useStore((s) => s.lot);
  const { camera, gl } = useThree();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const [start, setStart] = useState<THREE.Vector3 | null>(null);
  const [end, setEnd] = useState<THREE.Vector3 | null>(null);
  const pointerNdc = useStore((s) => s.input.pointerNdc);

  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      // Somente botão esquerdo, sem gesto de câmera e sem Space pressionado
      if (
        activeTool !== "wall" ||
        cameraGestureActive ||
        e.button !== 0 ||
        e.getModifierState("Space")
      )
        return;
      if (isHudEventTarget(e)) return;
      const ndc = new THREE.Vector2(pointerNdc.x, pointerNdc.y);
      const hit = intersectGround(raycaster, camera, ndc);
      if (!hit) return;
      const snapped = snapToGrid(hit, "round");
      setStart(snapped);
      setEnd(snapped.clone());
    }
    function onPointerUp(e: MouseEvent) {
      if (e.button !== 0) return;
      // adiar commit para garantir Stage atualizar gesture
      setTimeout(() => {
        if (activeTool !== "wall" || useStore.getState().cameraGestureActive || !start || !end)
          return;
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
        const lotState = useStore.getState().lot;
        segments = segments.filter(
          (s) =>
            s.ax >= 0 &&
            s.bx >= 0 &&
            s.az >= 0 &&
            s.bz >= 0 &&
            s.ax <= lotState.width &&
            s.bx <= lotState.width &&
            s.az <= lotState.depth &&
            s.bz <= lotState.depth,
        );
        if (segments.length) {
          useStore.setState((s) => ({ walls: [...s.walls, ...segments] }));
        }
        setStart(null);
        setEnd(null);
      }, 0);
    }
    function onPointerMoveDraw() {
      if (activeTool !== "wall" || cameraGestureActive || !start) return;
      const ndc = new THREE.Vector2(pointerNdc.x, pointerNdc.y);
      const hit = intersectGround(raycaster, camera, ndc);
      if (!hit) return;
      const snapped = snapToGrid(hit, "round");
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
  }, [activeTool, camera, gl, raycaster, start, end, pointerNdc, cameraGestureActive]);

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
  //TODO: Validar e evitar segmentos vazios quando start===end (comprimento 0)
  return (
    <mesh position={[cx, previewHeight / 2, cz]} rotation={[0, yaw, 0]}>
      <boxGeometry args={[Math.max(0.001, len), previewHeight, 0.05]} />
      <meshStandardMaterial color="#38bdf8" transparent opacity={0.5} />
    </mesh>
  );
}
