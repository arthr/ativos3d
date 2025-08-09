import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useStore } from "../../store/useStore";
import { catalog } from "../../core/catalog";

export function PlaceObjectTool() {
	const activeTool = useStore((s) => s.activeTool);
	const selectedCatalogId = useStore((s) => s.selectedCatalogId);
	const objects = useStore((s) => s.objects);
	const { camera, gl } = useThree();
	const raycaster = useMemo(() => new THREE.Raycaster(), []);
	const pointer = useRef(new THREE.Vector2(0, 0));
	const [preview, setPreview] = useState<{
		pos: THREE.Vector3;
		w: number;
		h: number;
		d: number;
		color: string;
		yawDeg?: 0 | 90 | 180 | 270;
		valid?: boolean;
	} | null>(null);

	// Rotação do preview e cancelar
	useEffect(() => {
		function onKeyDown(e: KeyboardEvent) {
			if (activeTool !== "place" || !selectedCatalogId) return;
			if (e.key.toLowerCase() === "r") {
				setPreview((p) =>
					p
						? {
								...p,
								yawDeg: (((p.yawDeg ?? 0) +
									(e.shiftKey ? 270 : 90)) %
									360) as 0 | 90 | 180 | 270,
						  }
						: p
				);
			}
			if (e.key === "Escape") {
				useStore.setState({ selectedCatalogId: undefined });
				setPreview(null);
			}
		}
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [activeTool, selectedCatalogId]);

	useEffect(() => {
		function onPointerMove(e: PointerEvent) {
			// Usar o retângulo do canvas, independente do alvo do evento (HUD Html é irmão, não pai, do canvas)
			const rect = gl.domElement.getBoundingClientRect();
			pointer.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
			pointer.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
		}
		window.addEventListener("pointermove", onPointerMove);
		return () => window.removeEventListener("pointermove", onPointerMove);
	}, [gl]);

	useFrame(() => {
		if (activeTool !== "place" || !selectedCatalogId) {
			setPreview(null);
			return;
		}
		// Raycast contra plano XZ (y=0)
		raycaster.setFromCamera(pointer.current, camera);
		const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
		const hit = raycaster.ray.intersectPlane(plane, new THREE.Vector3());
		if (!hit) {
			setPreview(null);
			return;
		}
		const item = (catalog as any[]).find((i) => i.id === selectedCatalogId);
		if (!item) {
			setPreview(null);
			return;
		}
		const fp = item.footprint || { w: 1, d: 1, h: 1 };
		// Snap ao grid inteiro
		const snapped = new THREE.Vector3(
			Math.floor(hit.x),
			0,
			Math.floor(hit.z)
		);

		const yaw = (preview?.yawDeg ?? 0) as 0 | 90 | 180 | 270;
		const baseW = fp.w ?? 1;
		const baseD = fp.d ?? 1;
		const baseH = fp.h ?? 1;
		const rotW = yaw % 180 === 0 ? baseW : baseD;
		const rotD = yaw % 180 === 0 ? baseD : baseW;

		// Validação simples: bounds do lote + colisão AABB
		const lot = useStore.getState().lot;
		const aabb = {
			min: { x: snapped.x, y: 0, z: snapped.z },
			max: { x: snapped.x + rotW, y: baseH, z: snapped.z + rotD },
		};
		let valid = true;
		if (
			aabb.min.x < 0 ||
			aabb.min.z < 0 ||
			aabb.max.x > lot.width ||
			aabb.max.z > lot.depth
		) {
			valid = false;
		}
		if (valid) {
			const idToItem = new Map<string, any>();
			for (const it of catalog as any[]) idToItem.set(it.id, it);
			for (const obj of objects) {
				const def = idToItem.get(obj.defId);
				const ofp = def?.footprint || { w: 1, d: 1, h: 1 };
				const oyaw = Math.round(obj.rot.y) % 360;
				const ow = oyaw % 180 === 0 ? ofp.w ?? 1 : ofp.d ?? 1;
				const od = oyaw % 180 === 0 ? ofp.d ?? 1 : ofp.w ?? 1;
				const obb = {
					min: { x: obj.pos.x, y: 0, z: obj.pos.z },
					max: {
						x: obj.pos.x + ow,
						y: ofp.h ?? 1,
						z: obj.pos.z + od,
					},
				};
				const intersects = !(
					aabb.max.x <= obb.min.x ||
					aabb.min.x >= obb.max.x ||
					aabb.max.z <= obb.min.z ||
					aabb.min.z >= obb.max.z
				);
				if (intersects) {
					valid = false;
					break;
				}
			}
		}

		setPreview({
			pos: snapped,
			w: rotW,
			d: rotD,
			h: baseH,
			color: item.art?.color ?? "#64748b",
			yawDeg: yaw,
			valid,
		});
	});

	useEffect(() => {
		function onClick(e: MouseEvent) {
			const target = e.target as HTMLElement | null;
			// Ignorar cliques na HUD (Html overlay) identificada por data-hud
			if (target?.closest('[data-hud="true"]')) return;
			if (
				activeTool !== "place" ||
				!preview ||
				!selectedCatalogId ||
				!preview.valid
			)
				return;
			const id = crypto.randomUUID();
			const obj = {
				id,
				defId: selectedCatalogId,
				pos: { x: preview.pos.x, y: 0, z: preview.pos.z },
				rot: { x: 0, y: preview.yawDeg ?? 0, z: 0 },
			};
			useStore.setState((s) => ({ objects: [...s.objects, obj] }));
		}
		window.addEventListener("click", onClick);
		return () => window.removeEventListener("click", onClick);
	}, [activeTool, preview, selectedCatalogId]);

	if (!preview || activeTool !== "place") return null;
	return (
		<mesh
			position={[
				preview.pos.x + preview.w / 2,
				preview.h / 2,
				preview.pos.z + preview.d / 2,
			]}>
			<boxGeometry args={[preview.w, preview.h, preview.d]} />
			<meshStandardMaterial
				color={preview.valid ? "#16a34a" : "#ef4444"}
				transparent
				opacity={0.5}
			/>
		</mesh>
	);
}
