import { useEffect, useState } from "react";
import { useStore } from "../../store/useStore";
import { Instances, Instance } from "@react-three/drei";

export function WallsLayer() {
  const walls = useStore((s) => s.walls);
  const height = useStore((s) => s.lot.height);
  const thickness = 0.1;
  const [capacity, setCapacity] = useState(() => Math.max(walls.length, 1));
  useEffect(() => {
    if (walls.length > capacity) setCapacity(Math.max(walls.length, capacity * 2));
  }, [walls.length, capacity]);
  return (
    <Instances key={capacity} limit={capacity}>
      <boxGeometry args={[1, height, thickness]} />
      <meshStandardMaterial color="#94a3b8" />
      {walls.map((w, i) => {
        const dx = w.bx - w.ax;
        const dz = w.bz - w.az;
        const len = Math.sqrt(dx * dx + dz * dz) || 0.0001;
        const cx = (w.ax + w.bx) / 2;
        const cz = (w.az + w.bz) / 2;
        const yaw = Math.atan2(dz, dx);
        return (
          <Instance
            key={i}
            position={[cx, height / 2, cz]}
            rotation={[0, yaw, 0]}
            scale={[len, 1, 1]}
          />
        );
      })}
    </Instances>
  );
}
