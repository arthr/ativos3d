import React from 'react';
// usar elemento intrínseco prefixado
import { useStore } from '../../store/useStore';

type Props = { tile: number };

export function FloorLayer({ tile }: Props) {
  const floor = useStore((s) => s.lot.floor);
  return (
    <pixiGraphics
      draw={(g: any) => {
        g.clear();
        for (const t of floor) {
          const color = t.tex.includes('wood') ? 0x5b4636 : 0x2b5d6b;
          g.fill({ color });
          g.rect(t.x * tile, t.y * tile, tile, tile);
          g.fill();
        }
      }}
    />
  );
}
