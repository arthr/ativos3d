import React from 'react';

type Props = { width: number; height: number; tile: number };

export function Grid({ width, height, tile }: Props) {
  return (
    <pixiGraphics
      draw={(g: any) => {
        g.clear();
        g.setStrokeStyle({ width: 1, color: 0x222222, alpha: 1 });
        for (let x = 0; x <= width; x += tile) {
          g.moveTo(x, 0);
          g.lineTo(x, height);
        }
        for (let y = 0; y <= height; y += tile) {
          g.moveTo(0, y);
          g.lineTo(width, y);
        }
        g.stroke();
      }}
    />
  );
}
