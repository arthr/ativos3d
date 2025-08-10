import { useEffect, useState } from "react";
import { useStore } from "../../store/useStore";
import { Instances, Instance } from "@react-three/drei";

export function FloorLayer() {
  const floor = useStore((s) => s.floor);
  const [capacity, setCapacity] = useState(() => Math.max(floor.length, 1));
  useEffect(() => {
    if (floor.length > capacity) setCapacity(Math.max(floor.length, capacity * 2));
  }, [floor.length, capacity]);
  return (
    <Instances key={capacity} limit={capacity}>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial color="#e2e8f0" />
      {floor.map((t, i) => (
        <Instance
          key={i}
          position={[t.x + 0.5, 0.001, t.z + 0.5]}
          rotation={[-Math.PI / 2, 0, 0]}
        />
      ))}
    </Instances>
  );
}
