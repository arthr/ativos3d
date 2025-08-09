import React, { useMemo, useState } from 'react';
import { useStore } from '../store/useStore';

export function CatalogPanel() {
  const catalog = useStore((s) => s.catalog.items);
  const setTool = useStore((s) => s.setTool);
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const qq = q.toLowerCase();
    return catalog.filter(
      (i) => i.name.toLowerCase().includes(qq) || i.tags.some((t) => t.toLowerCase().includes(qq)),
    );
  }, [catalog, q]);

  return (
    <div>
      <input
        className="input"
        placeholder="Buscar por nome ou tag"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <div className="list" style={{ marginTop: 8 }}>
        {filtered.map((it) => (
          <button
            key={it.id}
            className="button"
            onClick={() => setTool({ kind: 'place', item: it, rot: 0 })}
          >
            {it.name} — R$ {it.price}
          </button>
        ))}
      </div>
    </div>
  );
}
