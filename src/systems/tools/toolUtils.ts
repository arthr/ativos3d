import * as THREE from "three";

// Plano do chão Y=0 reutilizável
const GROUND_PLANE = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

export function getNormalizedPointer(
  e: PointerEvent | MouseEvent,
  canvas: HTMLCanvasElement,
  out?: THREE.Vector2,
): THREE.Vector2 {
  const rect = canvas.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  if (out) {
    out.set(x, y);
    return out;
  }
  return new THREE.Vector2(x, y);
}

export function intersectGround(
  raycaster: THREE.Raycaster,
  camera: THREE.Camera,
  ndc: THREE.Vector2,
  out?: THREE.Vector3,
): THREE.Vector3 | null {
  raycaster.setFromCamera(ndc, camera);
  const hit = raycaster.ray.intersectPlane(GROUND_PLANE, out ?? new THREE.Vector3());
  return hit ?? null;
}

export function isHudEventTarget(e: Event): boolean {
  const target = e.target as HTMLElement | null;
  return Boolean(target?.closest('[data-hud="true"]'));
}

export function snapToGrid(
  v: THREE.Vector3,
  mode: "floor" | "round" = "floor",
  out?: THREE.Vector3,
): THREE.Vector3 {
  const x = mode === "round" ? Math.round(v.x) : Math.floor(v.x);
  const z = mode === "round" ? Math.round(v.z) : Math.floor(v.z);
  if (out) {
    out.set(x, 0, z);
    return out;
  }
  return new THREE.Vector3(x, 0, z);
}
