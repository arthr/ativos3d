import * as THREE from "three";
import { useStore } from "../../store/useStore";
import { Line } from "@react-three/drei";

export function Grid() {
  const lot = useStore((s) => s.lot);
  // Grid retangular width x depth, linhas em cada unidade
  return (
    <group position={[0, 0, 0]}>
      {Array.from({ length: lot.depth + 1 }, (_, zi) => {
        const z = zi;
        const color = zi % 5 === 0 ? "#94a3b8" : "#cbd5e1";
        return (
          <Line
            key={`zx-${zi}`}
            points={[
              [0, 0, z],
              [lot.width, 0, z],
            ]}
            color={color}
            lineWidth={1}
          />
        );
      })}
      {Array.from({ length: lot.width + 1 }, (_, xi) => {
        const x = xi;
        const color = xi % 5 === 0 ? "#94a3b8" : "#cbd5e1";
        return (
          <Line
            key={`xz-${xi}`}
            points={[
              [x, 0, 0],
              [x, 0, lot.depth],
            ]}
            color={color}
            lineWidth={1}
          />
        );
      })}
    </group>
  );
}
