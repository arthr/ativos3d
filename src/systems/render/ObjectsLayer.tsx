import React, { useMemo } from 'react';
// usar elemento intrínseco prefixado
import { useStore } from '../../store/useStore';
import { rotateFootprint } from '../../core/geometry';

export function ObjectsLayer({ tile }: { tile: number }) {
  const objects = useStore((s) => s.lot.objects);
  const selection = useStore((s) => s.selection);
  const catalog = useStore((s) => s.catalog);

  const defs = catalog.byId;

  const drawObjects = useMemo(
    () => (g: any) => {
      g.clear();
      for (const o of objects) {
        const def = defs.get(o.defId);
        const color = selection === o.id ? 0x44bb55 : 0x5588aa;
        if (def?.footprint?.kind === 'rect') {
          const fp = rotateFootprint(def.footprint, o.rot);
          if (fp.kind === 'rect') {
            g.fill({ color, alpha: 0.9 });
            g.rect(o.pos.x * tile, o.pos.y * tile, fp.w * tile, fp.h * tile);
            g.fill();
          }
        } else {
          g.fill({ color, alpha: 0.9 });
          g.rect(o.pos.x * tile, o.pos.y * tile, tile, tile);
          g.fill();
        }
      }
    },
    [objects, selection, defs, tile],
  );

  return <pixiGraphics draw={drawObjects as any} />;
}
