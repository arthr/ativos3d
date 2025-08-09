import React from 'react';
import { CatalogPanel } from '../ui/CatalogPanel';
import { Topbar } from '../ui/Topbar';
import { StageView } from '../systems/render/Stage';

export default function App() {
  return (
    <div className="app">
      <div className="topbar">
        <Topbar />
      </div>
      <div className="sidebar">
        <CatalogPanel />
      </div>
      <div className="stage">
        <StageView />
      </div>
    </div>
  );
}
