import * as THREE from "three";
import { useStore } from "../../store/useStore";

export function Grid() {
  const lot = useStore((s) => s.lot);
  // Grid cobrindo o retângulo do lote (0..width, 0..depth), centrado para visualização
  const size = Math.max(lot.width, lot.depth);
  const divisions = size;
  return (
    <gridHelper
      args={[size, divisions, new THREE.Color("#94a3b8"), new THREE.Color("#cbd5e1")]}
      position={[size / 2, 0, size / 2]}
    />
  );
}
