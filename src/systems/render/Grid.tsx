import { useStore } from "../../store/useStore";
import { Grid as DreiGrid } from "@react-three/drei";

export function Grid() {
  const lot = useStore((s) => s.lot);
  return (
    <DreiGrid
      args={[lot.width, lot.depth]}
      cellSize={1}
      cellThickness={1}
      cellColor="#cbd5e1"
      sectionSize={5}
      sectionThickness={1.5}
      sectionColor="#94a3b8"
      infiniteGrid={false}
      fadeDistance={100}
      fadeStrength={1}
      position={[lot.width / 2, 0, lot.depth / 2]}
    />
  );
}
