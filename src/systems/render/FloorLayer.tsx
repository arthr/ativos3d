import { useMemo } from "react";
import { useStore } from "../../store/useStore";
import * as THREE from "three";

export function FloorLayer() {
  const floor = useStore((s) => s.floor);
  const geom = useMemo(() => new THREE.PlaneGeometry(1, 1), []);
  const mat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#e2e8f0", side: THREE.DoubleSide }),
    [],
  );
  if (floor.length === 0) return null;
  return (
    <instancedMesh args={[geom, mat, floor.length]} rotation={[-Math.PI / 2, 0, 0]}>
      {floor.map((t, i) => (
        <primitive
          // R3F usa attach="instance{index}" para instancedMesh; tipagem não expõe string literal dinâmica
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          attach={`instance${i}` as any}
          key={i}
          object={new THREE.Object3D()}
          position={[t.x + 0.5, 0.001, t.z + 0.5]}
        />
      ))}
    </instancedMesh>
  );
}
