import React from 'react';
// usar elemento intrínseco prefixado
import { useStore } from '../../store/useStore';

type Props = { tile: number };

export function WallsLayer({ tile }: Props) {
  const walls = useStore((s) => s.lot.walls);
  return (
    <pixiGraphics
      draw={(g: any) => {
        g.clear();
        g.setStrokeStyle({ width: 4, color: 0x888888, alpha: 1 });
        for (const w of walls) {
          g.moveTo(w.ax * tile, w.ay * tile);
          g.lineTo(w.bx * tile, w.by * tile);
        }
        g.stroke();
      }}
    />
  );
}
