import { useStore } from "../../store/useStore";
import { Instances, Instance } from "@react-three/drei";
import { useInstanceCapacity } from "./useInstanceCapacity";

export function FloorLayer() {
  const floor = useStore((s) => s.floor);
  const [capacity] = useInstanceCapacity(floor.length);
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
