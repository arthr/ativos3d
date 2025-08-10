import { exportLot, importLot } from "../../core/serialization";
import { useStore } from "../../store/useStore";

export function exportCurrentLotToDownload(): void {
  const s = useStore.getState();
  const lot = {
    width: s.lot.width,
    depth: s.lot.depth,
    height: s.lot.height,
    objects: s.objects,
    walls: s.walls,
    floor: s.floor,
    budget: s.budget,
    version: 1,
  } as const;
  const json = exportLot(lot, 1);
  const blob = new Blob([json], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "lot_export.json";
  a.click();
  URL.revokeObjectURL(a.href);
}

export async function importLotFromFile(file: File): Promise<void> {
  const text = await file.text();
  const parsed = importLot<any>(text);
  const lot = parsed.lot as any;
  useStore.setState({
    lot: { width: lot.width, depth: lot.depth, height: lot.height },
    objects: lot.objects ?? [],
    walls: lot.walls ?? [],
    floor: lot.floor ?? [],
    budget: lot.budget ?? useStore.getState().budget,
    selectedIds: [],
  });
}

export function exportThumbnailPng(): void {
  const canvas = document.querySelector("canvas");
  if (!canvas) return;
  const dataUrl = (canvas as HTMLCanvasElement).toDataURL("image/png");
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = "thumbnail.png";
  a.click();
}
