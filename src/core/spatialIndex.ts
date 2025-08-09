// Placeholder simples de indexação espacial
// TODO: implementar octree ou grid hashing para AABB

export type Aabb = {
  min: { x: number; y: number; z: number };
  max: { x: number; y: number; z: number };
};

export class SpatialIndex {
  // TODO: estrutura real
  private boxes: Aabb[] = [];

  insert(box: Aabb) {
    this.boxes.push(box);
  }

  query(box: Aabb): Aabb[] {
    // TODO: retorno eficiente; hoje retorna todos (placeholder)
    return this.boxes;
  }
}
