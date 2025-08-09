import React from 'react';
import { useStore } from '../store/useStore';

export function Toolbar() {
  const tool = useStore((s) => s.tool);
  const setTool = useStore((s) => s.setTool);
  const cmd = useStore((s) => s.cmd);

  const btn = (id: string, label: string, onClick: () => void, active: boolean) => (
    <button className={`button ${active ? 'active' : ''}`} onClick={onClick}>
      {label}
    </button>
  );

  return (
    <div className="toolbar">
      {btn(
        'place',
        '1 Place',
        () => setTool({ kind: 'place', item: null, rot: 0 }),
        tool.kind === 'place',
      )}
      {btn('move', '2 Move', () => setTool({ kind: 'move' }), tool.kind === 'move')}
      {btn('wall', '3 Wall', () => setTool({ kind: 'wall' }), tool.kind === 'wall')}
      {btn('floor', '4 Floor', () => setTool({ kind: 'floor', item: null }), tool.kind === 'floor')}
      {btn('bulldoze', 'B Bulldoze', () => setTool({ kind: 'bulldoze' }), tool.kind === 'bulldoze')}
      {btn(
        'eyedropper',
        'E Eyedropper',
        () => setTool({ kind: 'eyedropper' }),
        tool.kind === 'eyedropper',
      )}
      <span style={{ marginLeft: 16 }} />
      <button className="button" onClick={() => cmd.undo()} disabled={!cmd.canUndo()}>
        Undo (Ctrl+Z)
      </button>
      <button className="button" onClick={() => cmd.redo()} disabled={!cmd.canRedo()}>
        Redo (Ctrl+Y)
      </button>
    </div>
  );
}
