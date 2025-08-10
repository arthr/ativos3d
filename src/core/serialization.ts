export function exportLot<T>(lot: T, version: number = 1): string {
  return JSON.stringify({ version, lot }, null, 2);
}

export function importLot<T>(json: string): { version: number; lot: T } {
  const parsed = JSON.parse(json);
  if (typeof parsed.version !== "number") throw new Error("Versão inválida");
  return parsed;
}
