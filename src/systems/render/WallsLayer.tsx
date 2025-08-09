import { useStore } from "../../store/useStore";

export function WallsLayer() {
  const walls = useStore((s) => s.walls);
  const height = useStore((s) => s.lot.height);
  const thickness = 0.1;
  return (
    <group>
      {walls.map((w, i) => {
        const dx = w.bx - w.ax;
        const dz = w.bz - w.az;
        const len = Math.sqrt(dx * dx + dz * dz) || 0.0001;
        const cx = (w.ax + w.bx) / 2;
        const cz = (w.az + w.bz) / 2;
        const yaw = Math.atan2(dz, dx);
        return (
          <mesh
            key={i}
            position={[cx, height / 2, cz]}
            rotation={[0, yaw, 0]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[len, height, thickness]} />
            <meshStandardMaterial color="#94a3b8" />
          </mesh>
        );
      })}
    </group>
  );
}
