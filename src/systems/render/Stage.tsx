import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Application } from '@pixi/react';
import { useStore } from '../../store/useStore';
import { Grid } from './Grid';
import { FloorLayer } from './FloorLayer';
import { WallsLayer } from './WallsLayer';
import { ObjectsLayer } from './ObjectsLayer';

const TILE = 32;

export function StageView() {
  const lot = useStore((s) => s.lot);
  const setHover = useStore((s) => s.setHover);
  const clickAt = useStore((s) => s.clickAt);
  const startDragStore = useStore((s) => s.startDrag);
  const dragTo = useStore((s) => s.dragTo);
  const endDrag = useStore((s) => s.endDrag);
  const rotateTool = useStore((s) => s.rotateTool);

  const [vp, setVp] = useState({ x: 0, y: 0, scale: 1 });
  const panning = useRef(false);
  const last = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    useStore.getState().loadCatalog();
  }, []);

  const width = lot.width * TILE;
  const height = lot.height * TILE;

  function screenToWorld(clientX: number, clientY: number) {
    const rect = containerRef.current?.getBoundingClientRect();
    const x = (clientX - (rect?.left ?? 0) - vp.x) / vp.scale;
    const y = (clientY - (rect?.top ?? 0) - vp.y) / vp.scale;
    return { x: x / TILE, y: y / TILE };
  }

  const onWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    const delta = Math.sign(e.deltaY);
    const factor = delta > 0 ? 0.9 : 1.1;
    setVp((v) => ({ ...v, scale: Math.max(0.3, Math.min(3, v.scale * factor)) }));
  };

  const containerRef = useRef<HTMLDivElement>(null);

  const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (e.button === 1 || e.shiftKey) {
      panning.current = true;
      last.current = { x: e.clientX, y: e.clientY };
      return;
    }
    const w = screenToWorld(e.clientX, e.clientY);
    startDragStore(w);
  };
  const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (panning.current) {
      const dx = e.clientX - last.current.x;
      const dy = e.clientY - last.current.y;
      last.current = { x: e.clientX, y: e.clientY };
      setVp((v) => ({ ...v, x: v.x + dx, y: v.y + dy }));
      return;
    }
    const w = screenToWorld(e.clientX, e.clientY);
    setHover(w);
    dragTo(w);
  };
  const onPointerUp: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (panning.current) {
      panning.current = false;
      return;
    }
    const w = screenToWorld(e.clientX, e.clientY);
    endDrag(w);
    clickAt(w);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'r') rotateTool();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [rotateTool]);

  const appProps = useMemo(() => ({ background: 0x0a0a0a, antialias: false }), []);

  // Tipagem de @pixi/react está inconsistente no ambiente; usar fallback any
  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%' }}
      onWheel={onWheel}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onDoubleClick={(e) => clickAt(screenToWorld(e.clientX, e.clientY))}
    >
      <Application {...appProps} width={window.innerWidth} height={window.innerHeight}>
        <pixiContainer x={vp.x} y={vp.y} scale={vp.scale}>
          <Grid width={width} height={height} tile={TILE} />
          <FloorLayer tile={TILE} />
          <WallsLayer tile={TILE} />
          <ObjectsLayer tile={TILE} />
        </pixiContainer>
      </Application>
    </div>
  );
}
