import * as THREE from "three";
import { useStore } from "../../store/useStore";

export function Grid() {
	const lot = useStore((s) => s.lot);
	const size = Math.max(lot.width, lot.depth);
	const divisions = size;
	return (
		<gridHelper
			args={[
				size,
				divisions,
				new THREE.Color("#94a3b8"),
				new THREE.Color("#cbd5e1"),
			]}
			position={[0, 0, 0]}
		/>
	);
}
